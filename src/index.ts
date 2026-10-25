import { writeFile } from 'node:fs/promises';
import { parseArgs } from './cli';
import { scrapeEaRatings } from './eaRatingsScraper';

const main = async () => {
  const args = parseArgs(process.argv.slice(2));

  const gender = args.gender !== undefined ? Number(args.gender) : 0;

  const orderBy = args.orderBy ?? 'rank';

  const maxPages =
    args.maxPages !== undefined ? Number(args.maxPages) : undefined;

  const delayMs = args.delayMs !== undefined ? Number(args.delayMs) : undefined;

  const out = args.out ?? 'downloaded_files/ea-sports-fc-ratings.json';

  console.log(`Coletando ratings (gender=${gender}, orderBy=${orderBy})...`);

  const players = await scrapeEaRatings({
    gender,
    orderBy,
    maxPages,
    delayMs,
    onPageFetched: (page, totalPages, totalItems) => {
      console.log(
        `  página ${page}/${totalPages} (${Math.min(page * 100, totalItems)}/${totalItems} jogadores)`,
      );
    },
  });

  await writeFile(out, JSON.stringify(players, null, 2), 'utf-8');
  console.log(`Concluído: ${players.length} jogadores salvos em ${out}`);
};

main().catch((error) => {
  console.error('Erro ao executar o scraper:', error);
  process.exitCode = 1;
});
