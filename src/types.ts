export type EaRatingsOptions = {
  locale?: string;
  franchiseSlug?: string;
  gender?: number /** 0 = masculino, 1 = feminino (conforme filtro do site). */;
  orderBy?: string;
  maxPages?: number /** Limita a quantidade de páginas buscadas (útil para testes). */;
  delayMs?: number /** Intervalo entre requisições, em ms, para não sobrecarregar o site da EA. */;
  onPageFetched?: (
    page: number,
    totalPages: number,
    totalItems: number,
  ) => void;
};

export type EaRatingsLookup = {
  id: number | string;
  label: string;
  imageUrl?: string;
};

export type EaRatingsApiItem = {
  id: number;
  rank: number;
  overallRating: number;
  firstName: string;
  lastName: string;
  commonName: string | null;
  birthdate: string;
  height: string;
  weight: string;
  skillMoves: number;
  weakFootAbility: number;
  preferredFoot: number;
  leagueName: string;
  avatarUrl: string;
  shieldUrl: string;
  nationality: EaRatingsLookup;
  team: EaRatingsLookup;
  position: { id: string; label: string; shortLabel: string };
  alternatePositions: { id: string; label: string; shortLabel: string }[];
  stats: Record<string, { value: number; diff: number }>;
};

export type EaRatingsPage = {
  items: EaRatingsApiItem[];
  totalItems: number;
};

export type PlayerRating = {
  id: number;
  rank: number;
  name: string;
  overallRating: number;
  position: string;
  positionShort: string;
  alternatePositions: string[];
  photoUrl: string;
  cardShieldUrl: string;
  team: string;
  teamCrestUrl: string;
  nationality: string;
  nationalityFlagUrl: string;
  league: string;
  birthdate: string;
  height: string;
  weight: string;
  skillMoves: number;
  weakFootAbility: number;
  preferredFoot: 'Destro' | 'Esquerdo';
  stats: Record<string, number>;
};
