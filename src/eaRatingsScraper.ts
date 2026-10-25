import { buildPageUrl, fetchRatingsPage, PAGE_SIZE } from './eaRatingsApi';
import { sleep } from './http';
import { toPlayerRating } from './playerMapper';
import type { EaRatingsOptions, PlayerRating } from './types';

export type { EaRatingsOptions, PlayerRating } from './types';

/**
 * Busca todos os ratings de jogadores do site da EA, paginando até coletar
 * `totalItems` (informado pela própria API) ou até `maxPages`, se definido.
 */
export const scrapeEaRatings = async (
  options: EaRatingsOptions = {},
): Promise<PlayerRating[]> => {
  const config = {
    locale: options.locale ?? 'pt-br',
    franchiseSlug: options.franchiseSlug ?? 'ea-sports-fc',
    gender: options.gender ?? 0,
    orderBy: options.orderBy ?? 'rank',
  };

  const delayMs = options.delayMs ?? 300;

  const players: PlayerRating[] = [];
  let page = 1;
  let totalItems = Infinity;
  let totalPages = Infinity;

  while (players.length < totalItems && page <= totalPages) {
    if (options.maxPages && page > options.maxPages) break;

    const url = buildPageUrl(config, page);
    const { items, totalItems: reportedTotal } = await fetchRatingsPage(url);

    totalItems = reportedTotal;
    totalPages = Math.ceil(totalItems / PAGE_SIZE);

    if (items.length === 0) break;

    for (const item of items) players.push(toPlayerRating(item));

    options.onPageFetched?.(page, totalPages, totalItems);

    page += 1;
    if (page <= totalPages && delayMs > 0) await sleep(delayMs);
  }

  return players;
};
