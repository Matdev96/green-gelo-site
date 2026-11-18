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

## Versões

| Tag  | O que tem |
|------|-----------|
| v1.0 | Hero com vídeo em tela cheia + banners de sabor animados no scroll |
| v2.0 | v1 + transições de sobreposição entre seções |
