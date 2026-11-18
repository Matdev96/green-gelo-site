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

Para editar textos, cores ou sabores, altere a lista `SABORES` no início de `js/main.js`.
As perguntas do FAQ ficam na lista `DUVIDAS`, no mesmo arquivo.

Ordem da página: vídeo → sabores → por que revender → fábrica → como funciona → chamada final → dúvidas → rodapé.

## Versões

| Branch | O que tem |
|--------|-----------|
| v1 | Hero com vídeo em tela cheia + banners de sabor animados no scroll |
| v2 | v1 + transições de sobreposição entre seções |
| v3 | v2 + Por que revender, Fábrica, Como funciona, Dúvidas (rolagem normal) e rodapé |
| v4 | v3 + desempenho: WebP, fontes no site, vídeo leve no celular, GSAP só no computador |

## Desempenho

- Imagens em **WebP** (`assets/img/**/*.webp`). Os PNG/JPG originais ficam no repositório só como fonte.
- Fontes hospedadas em `assets/fonts/` (sem Google Fonts).
- O vídeo do topo carrega depois da página; no celular usa `hero-loop-mobile.mp4` (360p).
- **Computador:** GSAP + ScrollTrigger são baixados e a tela fixa é montada no primeiro movimento do usuário.
- **Celular:** nenhuma biblioteca; seções com `position: sticky`, entradas com CSS e `IntersectionObserver`,
  e giro da embalagem / linha da rota com CSS *scroll-driven animations* (onde houver suporte).
- Imagens dos painéis usam `data-src` e são carregadas perto da hora de aparecer.
