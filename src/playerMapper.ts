import type { EaRatingsApiItem, PlayerRating } from './types';

export const flattenStats = (
  stats: EaRatingsApiItem['stats'],
): Record<string, number> => {
  const flat: Record<string, number> = {};

  for (const [key, stat] of Object.entries(stats ?? {})) {
    flat[key] = stat.value;
  }
  return flat;
};

export const toPlayerRating = (item: EaRatingsApiItem): PlayerRating => ({
  id: item.id,
  rank: item.rank,
  name: item.commonName?.trim() || `${item.firstName} ${item.lastName}`.trim(),
  overallRating: item.overallRating,
  position: item.position?.label ?? '',
  positionShort: item.position?.shortLabel ?? '',
  alternatePositions: (item.alternatePositions ?? []).map((p) => p.shortLabel),
  photoUrl: item.avatarUrl ?? '',
  cardShieldUrl: item.shieldUrl ?? '',
  team: item.team?.label ?? '',
  teamCrestUrl: item.team?.imageUrl ?? '',
  nationality: item.nationality?.label ?? '',
  nationalityFlagUrl: item.nationality?.imageUrl ?? '',
  league: item.leagueName ?? '',
  birthdate: item.birthdate,
  height: item.height,
  weight: item.weight,
  skillMoves: item.skillMoves,
  weakFootAbility: item.weakFootAbility,
  preferredFoot: item.preferredFoot === 1 ? 'Destro' : 'Esquerdo',
  stats: flattenStats(item.stats),
});
