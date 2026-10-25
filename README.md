# andreaskruisen-scraper

Scraper em TypeScript que coleta os ratings de jogadores publicados no site oficial da EA (https://www.ea.com/pt-br/games/ea-sports-fc/ratings).

## Como funciona

A página é renderizada via Next.js SSR e embute os dados de cada página no script `__NEXT_DATA__`. O scraper busca o HTML de cada página (parâmetro `page`) e extrai esse JSON diretamente — sem precisar de um browser headless.

## Uso

```
pnpm start -- --gender=0 --orderBy=rank --out=downloaded_files/ea-sports-fc-ratings.json
```

- `--gender`: 0 = masculino, 1 = feminino.
- `--orderBy`: critério de ordenação usado pelo site (ex.: `rank`).
- `--maxPages`: limita a quantidade de páginas (útil para testes).
- `--delayMs`: intervalo entre requisições (padrão 300ms).

Saída: um arquivo JSON com todos os jogadores (~17.800), incluindo nome, overall, posição, time, seleção, liga, atributos físicos, stats completos e URLs de imagem (`photoUrl`, `teamCrestUrl`, `nationalityFlagUrl`, `cardShieldUrl`).

## Status

Scraper apenas gera o arquivo JSON — não persiste em banco de dados.
