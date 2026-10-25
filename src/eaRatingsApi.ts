import { withRetry } from './http';
import type { EaRatingsOptions, EaRatingsPage } from './types';

const BASE_URL = 'https://www.ea.com';
export const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 20_000;

const NEXT_DATA_RE =
  /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/;

type NextDataPayload = {
  props: {
    pageProps: {
      ratingDetails: EaRatingsPage;
    };
  };
};

export type PageUrlConfig = Required<
  Pick<EaRatingsOptions, 'locale' | 'franchiseSlug' | 'gender' | 'orderBy'>
>;

export const buildPageUrl = (
  { locale, franchiseSlug, gender, orderBy }: PageUrlConfig,
  page: number,
): string => {
  const url = new URL(`${BASE_URL}/${locale}/games/${franchiseSlug}/ratings`);

  url.searchParams.set('gender', String(gender));
  url.searchParams.set('orderBy', orderBy);
  url.searchParams.set('page', String(page));

  return url.toString();
};

const fetchRatingsPageOnce = async (url: string): Promise<EaRatingsPage> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; andreaskruisen-scraper/0.0.1; +https://github.com/leonardorossi)',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'pt-BR,pt;q=0.9',
    },
  });

  if (!response.ok)
    throw new Error(`Falha ao buscar ${url}: HTTP ${response.status}`);

  const html = await response.text();

  const match = html.match(NEXT_DATA_RE);

  if (!match)
    throw new Error(
      `__NEXT_DATA__ não encontrado em ${url} (layout da página pode ter mudado)`,
    );

  const payload = JSON.parse(match[1]) as NextDataPayload;
  const ratingDetails = payload.props?.pageProps?.ratingDetails;

  if (!ratingDetails)
    throw new Error(`ratingDetails ausente no __NEXT_DATA__ de ${url}`);

  return ratingDetails;
};

export const fetchRatingsPage = (
  url: string,
  maxRetries = 5,
): Promise<EaRatingsPage> =>
  withRetry(() => fetchRatingsPageOnce(url), {
    maxRetries,
    onRetry: (attempt, backoffMs) => {
      console.warn(
        `  falha transitória em ${url} (tentativa ${attempt}/${maxRetries}), tentando novamente em ${backoffMs}ms...`,
      );
    },
  });
