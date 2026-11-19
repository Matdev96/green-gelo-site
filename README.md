# Green Gelo Saborizado — nova versão do site

Proposta de nova versão do site da [Green Gelo](https://greengelo.com.br) (@greengelo_br).

Site estático em HTML, CSS e JavaScript, com animações de rolagem feitas com
[GSAP + ScrollTrigger](https://gsap.com) (arquivos locais em `js/vendor/`).

## Como abrir

Abra o `index.html` no navegador, ou use a extensão **Live Server** do VS Code.

## Estrutura

```
index.html          estrutura da página
css/style.css       visual, cores e responsivo
js/main.js          lista de sabores (SABORES) + animações
js/vendor/          GSAP e ScrollTrigger
assets/img/         logo e embalagens (PNG transparente)
assets/video/       vídeo do topo (loop sem som) + poster
```

## Editar conteúdo (sabores, FAQ, título, descrição, endereço do site)

O conteúdo fica em arquivos de dados e é escrito no `index.html` por um gerador:

| Arquivo | O que tem |
|---|---|
| `dados/site.json` | endereço do site, título, meta description, contatos, CNPJ, endereço |
| `dados/sabores.json` | os 9 sabores (nome, cores, imagem, descrição, "combina com") |
| `dados/duvidas.json` | perguntas e respostas do FAQ |

Depois de editar, rode (Node 18+, sem instalar nada):

```bash
node ferramentas/gerar.mjs
```

Ele atualiza no `index.html` o bloco de SEO (título, descrição, Open Graph e dados
estruturados JSON-LD), os banners dos sabores e o FAQ, e gera `sitemap.xml`,
`robots.txt` e `llms.txt`. Não edite à mão o que está entre os comentários
`<!-- GERADO:... -->`.

**Mudança de domínio** (ex.: greengelo.com.br): troque `url` em `dados/site.json`,
rode o gerador e ajuste os caminhos `/green-gelo-site/` do `404.html`.

Ordem da página: vídeo → sabores → por que revender → fábrica → como funciona → chamada final → dúvidas → rodapé.

## Versões

| Branch | O que tem |
|--------|-----------|
| v1 | Hero com vídeo em tela cheia + banners de sabor animados no scroll |
| v2 | v1 + transições de sobreposição entre seções |
| v3 | v2 + Por que revender, Fábrica, Como funciona, Dúvidas (rolagem normal) e rodapé |
| v4 | v3 + desempenho: WebP, fontes no site, vídeo leve no celular, GSAP só no computador |
| v5 | v4 + SEO: conteúdo no HTML, dados estruturados, sitemap, robots, llms.txt, 404 |

## Desempenho

- Imagens em **WebP** (`assets/img/**/*.webp`). Os PNG/JPG originais ficam no repositório só como fonte.
- Fontes hospedadas em `assets/fonts/` (sem Google Fonts).
- O vídeo do topo carrega depois da página; no celular usa `hero-loop-mobile.mp4` (360p).
- **Computador:** GSAP + ScrollTrigger são baixados e a tela fixa é montada no primeiro movimento do usuário.
- **Celular:** nenhuma biblioteca; seções com `position: sticky`, entradas com CSS e `IntersectionObserver`,
  e giro da embalagem / linha da rota com CSS *scroll-driven animations* (onde houver suporte).
- Imagens dos painéis usam `data-src` e são carregadas perto da hora de aparecer.

## SEO

- Título e meta description em `dados/site.json`.
- Sabores e FAQ escritos no HTML (lidos por buscadores e IAs sem precisar de JavaScript).
- Dados estruturados (JSON-LD): Organization, WebSite, WebPage, ItemList de Product (sabores) e FAQPage.
- `sitemap.xml` com as imagens dos produtos, `robots.txt`, `llms.txt`, `site.webmanifest` e `404.html`.
- **Atenção:** no GitHub Pages de projeto (`matdev96.github.io/green-gelo-site/`) os buscadores só leem o
  `robots.txt` da raiz do domínio. Ele passa a valer de verdade quando o site estiver no domínio próprio.
  Até lá, envie o `sitemap.xml` direto no Google Search Console.
