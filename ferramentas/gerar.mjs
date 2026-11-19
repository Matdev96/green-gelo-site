/* =========================================================
   Gerador do site Green Gelo
   ---------------------------------------------------------
   Lê os dados em dados/*.json e escreve no index.html:
     - bloco de SEO do <head> (título, descrição, Open Graph, JSON-LD)
     - os 9 banners de sabor
     - as perguntas do FAQ
   E gera na raiz: sitemap.xml, robots.txt e llms.txt

   Uso (Node 18+, sem dependências):
     node ferramentas/gerar.mjs

   Para trocar o endereço do site (ex.: greengelo.com.br),
   altere "url" em dados/site.json e rode o comando de novo.
   ========================================================= */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => JSON.parse(readFileSync(join(raiz, f), 'utf8'));
const site = ler('dados/site.json');
const sabores = ler('dados/sabores.json');
const duvidas = ler('dados/duvidas.json');

const hoje = new Date().toISOString().slice(0, 10);
const abs = (caminho) => new URL(caminho, site.url).href;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (msg) => 'https://wa.me/' + site.whatsapp + '?text=' + encodeURIComponent(msg);
const dois = (n) => String(n).padStart(2, '0');

/* ---------- SEO do <head> ---------- */
const jsonld = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': site.url + '#organizacao',
      name: site.nome,
      legalName: site.razaoSocial,
      url: site.url,
      logo: abs(site.logo),
      image: abs(site.imagemCompartilhar),
      description: site.descricao,
      foundingDate: site.fundacao,
      taxID: site.cnpj,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.endereco.rua,
        addressLocality: site.endereco.cidade,
        addressRegion: site.endereco.estado,
        postalCode: site.endereco.cep,
        addressCountry: site.endereco.pais
      },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.telefone,
        contactType: 'sales',
        areaServed: 'BR',
        availableLanguage: 'pt-BR'
      },
      sameAs: [site.instagram]
    },
    {
      '@type': 'WebSite',
      '@id': site.url + '#site',
      url: site.url,
      name: site.nome,
      inLanguage: 'pt-BR',
      publisher: { '@id': site.url + '#organizacao' }
    },
    {
      '@type': 'WebPage',
      '@id': site.url + '#pagina',
      url: site.url,
      name: site.titulo,
      description: site.descricao,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': site.url + '#site' },
      about: { '@id': site.url + '#organizacao' },
      primaryImageOfPage: abs(site.imagemCompartilhar),
      dateModified: hoje
    },
    {
      '@type': 'ItemList',
      name: 'Sabores de gelo saborizado Green',
      numberOfItems: sabores.length,
      itemListElement: sabores.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: (s.pre === 'Gelo sabor' ? 'Gelo saborizado sabor ' : s.pre + ' sabor ') + s.nome.toLowerCase(),
          url: site.url + '#sabor-' + s.id,
          image: abs(s.img),
          description: s.descricao,
          category: 'Gelo saborizado para drinks',
          brand: { '@type': 'Brand', name: 'Green' },
          manufacturer: { '@id': site.url + '#organizacao' },
          weight: { '@type': 'QuantitativeValue', value: 190, unitCode: 'GRM' }
        }
      }))
    },
    {
      '@type': 'FAQPage',
      '@id': site.url + '#duvidas',
      mainEntity: duvidas.map((d) => ({
        '@type': 'Question',
        name: d.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: d.resposta }
      }))
    }
  ]
};

const seo = `
  <title>${esc(site.titulo)}</title>
  <meta name="description" content="${esc(site.descricao)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#063A1D">
  <link rel="canonical" href="${site.url}">
  <link rel="alternate" type="text/markdown" title="Resumo para IA (llms.txt)" href="${abs('llms.txt')}">

  <!-- Compartilhamento (WhatsApp, Facebook, Instagram, LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${esc(site.nome)}">
  <meta property="og:title" content="${esc(site.tituloCompartilhar)}">
  <meta property="og:description" content="${esc(site.descricaoCompartilhar)}">
  <meta property="og:url" content="${site.url}">
  <meta property="og:image" content="${abs(site.imagemCompartilhar)}">
  <meta property="og:image:secure_url" content="${abs(site.imagemCompartilhar)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Logo da ${esc(site.nome)} com as cores dos 9 sabores">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(site.tituloCompartilhar)}">
  <meta name="twitter:description" content="${esc(site.descricaoCompartilhar)}">
  <meta name="twitter:image" content="${abs(site.imagemCompartilhar)}">

  <!-- Ícones -->
  <link rel="icon" type="image/png" href="assets/img/logo-green.png">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">

  <!-- Dados estruturados (Google): empresa, site, sabores e FAQ -->
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2).split('\n').map((l) => '  ' + l).join('\n')}
  </script>
`;

/* ---------- Banners de sabor ---------- */
const banners = sabores.map((s, i) => {
  const inv = i % 2 === 1;
  const suave = s.texto.toUpperCase() === '#FFFFFF' ? 'rgba(255,255,255,.88)' : 'rgba(0,0,0,.72)';
  const nomeMin = s.nome.toLowerCase();
  return `
    <article class="painel banner${inv ? ' banner--invertido' : ''}" id="sabor-${s.id}" data-sabor="${i}" data-nome="${esc(s.nome)}" data-cor="${s.cor}" data-texto="${s.texto}"
             aria-labelledby="nome-${s.id}" style="--cor:${s.cor};--cor-escura:${s.corEscura};--texto:${s.texto};--texto-suave:${suave};--lado:${inv ? 1 : -1}">
      <div class="banner__fundo" aria-hidden="true">
        <span class="banner__marca-dagua">${esc(s.nome)}</span>
        <span class="bolha b1"></span><span class="bolha b2"></span><span class="bolha b3"></span>
        <span class="bolha b4"></span><span class="bolha b5"></span>
      </div>
      <div class="banner__grade">
        <div class="banner__palco">
          <div class="banner__pacote">
            <div class="banner__flutua">
              <img class="banner__img" src="${s.img}" alt="Pacote de gelo para drink Green sabor ${esc(nomeMin)}, ${esc(site.embalagem)}" width="286" height="760" loading="lazy" decoding="async">
            </div>
          </div>
          <span class="banner__chao" aria-hidden="true"></span>
        </div>
        <div class="banner__info">
          <p class="banner__contador">${dois(i + 1)} / ${dois(sabores.length)}</p>
          <p class="banner__pre">${esc(s.pre)}</p>
          <h3 class="banner__nome" id="nome-${s.id}">${esc(s.nome)}</h3>
          <p class="banner__desc">${esc(s.descricao)}</p>
          <ul class="banner__fichas"><li>190 g · 200 ml</li><li>Já vem congelado</li><li>Abre fácil</li></ul>
          <p class="banner__combina"><strong>Combina com:</strong> ${esc(s.combina)}</p>
          <a class="botao banner__botao" href="${wa('Olá, Green! Vim pelo site e quero o gelo sabor ' + nomeMin + '.')}" target="_blank" rel="noopener">Pedir agora<span class="so-leitor"> o sabor ${esc(nomeMin)} pelo WhatsApp</span></a>
        </div>
      </div>
    </article>`;
}).join('\n');

/* ---------- FAQ ---------- */
const faq = duvidas.map((d, i) => `
        <div class="pergunta">
          <h3 class="pergunta__titulo"><button class="pergunta__botao" type="button" aria-expanded="false" aria-controls="resp-${i}" id="perg-${i}"><span>${esc(d.pergunta)}</span><span class="pergunta__mais" aria-hidden="true"></span></button></h3>
          <div class="pergunta__resposta" id="resp-${i}" role="region" aria-labelledby="perg-${i}"><div><p>${esc(d.resposta)}</p></div></div>
        </div>`).join('');

/* ---------- Aplica no index.html ---------- */
function trocar(html, nome, conteudo) {
  const ini = `<!-- GERADO:${nome}:INICIO -->`, fim = `<!-- GERADO:${nome}:FIM -->`;
  const a = html.indexOf(ini), b = html.indexOf(fim);
  if (a < 0 || b < 0) throw new Error('Marcador não encontrado: ' + nome);
  return html.slice(0, a + ini.length) + '\n  <!-- (gerado por ferramentas/gerar.mjs; edite dados/*.json) -->' + conteudo + '\n  ' + html.slice(b);
}
let html = readFileSync(join(raiz, 'index.html'), 'utf8');
html = trocar(html, 'SEO', seo);
html = trocar(html, 'SABORES', banners);
html = trocar(html, 'DUVIDAS', faq);
writeFileSync(join(raiz, 'index.html'), html);

/* ---------- sitemap.xml (com as imagens dos produtos) ---------- */
const imagens = [
  ...sabores.map((s) => ({ loc: abs(s.img), t: 'Gelo saborizado Green sabor ' + s.nome.toLowerCase() })),
  { loc: abs('assets/img/fotos/fabrica-envase.webp'), t: 'Máquina de envase na fábrica da Green em São Paulo' },
  { loc: abs('assets/img/fotos/equipe.webp'), t: 'Equipe da Green Gelo Saborizado' },
  { loc: abs(site.imagemCompartilhar), t: site.nome }
];
writeFileSync(join(raiz, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${site.url}</loc>
    <lastmod>${hoje}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
${imagens.map((im) => `    <image:image>\n      <image:loc>${esc(im.loc)}</image:loc>\n      <image:title>${esc(im.t)}</image:title>\n    </image:image>`).join('\n')}
  </url>
</urlset>
`);

/* ---------- robots.txt ---------- */
writeFileSync(join(raiz, 'robots.txt'), `# Green Gelo Saborizado
# Todo o site pode ser lido por buscadores e ferramentas de IA.
User-agent: *
Allow: /

Sitemap: ${abs('sitemap.xml')}
`);

/* ---------- llms.txt (resumo para ferramentas de IA, padrão llmstxt.org) ---------- */
writeFileSync(join(raiz, 'llms.txt'), `# ${site.nome}

> Indústria de gelo saborizado para drinks em ${site.endereco.cidade}/${site.endereco.estado}, fundada em ${site.fundacao}. Vende exclusivamente para revendedores (adegas, tabacarias, bares, quiosques, restaurantes, distribuidoras e eventos) e atende todo o Brasil. O produto já chega congelado, em embalagem que abre fácil, com ${sabores.length} sabores.

Informações principais:

- Produto: gelo saborizado em sachê de ${site.embalagem}, para usar com destilados, energéticos e cerveja.
- Sabores (${sabores.length}): ${sabores.map((s) => s.nome.toLowerCase() + (s.pre !== 'Gelo sabor' ? ' (' + s.pre.toLowerCase() + ')' : '')).join(', ')}.
- Fábrica própria e indústria 100% regularizada em ${site.endereco.cidade}/${site.endereco.estado}.
- Venda: somente para revendedores e distribuidores; não vende para consumidor final.
- Como revender: chamar no WhatsApp, receber a tabela de revenda, o pedido mínimo e o prazo da região, fazer o pedido com um consultor e repor pelo WhatsApp.
- Armazenamento: o gelo precisa de freezer (temperatura controlada).
- Pedido mínimo e prazo de entrega variam conforme a região e o tipo de ponto; são informados pelo WhatsApp.

## Páginas

- [Página inicial](${site.url}): apresentação da marca, os ${sabores.length} sabores, por que revender, a fábrica, como funciona e dúvidas frequentes.
- [Sabores](${site.url}#sabores): os ${sabores.length} sabores, com descrição e sugestão de drink.
- [Por que revender](${site.url}#porque): vantagens para o ponto de venda.
- [A fábrica](${site.url}#fabrica): produção própria em São Paulo desde ${site.fundacao}.
- [Como funciona](${site.url}#como-funciona): os 4 passos do cadastro à reposição.
- [Dúvidas frequentes](${site.url}#duvidas): pedido mínimo, entrega, freezer e distribuição.

## Dúvidas frequentes

${duvidas.map((d) => `- ${d.pergunta} ${d.resposta}`).join('\n')}

## Contato

- WhatsApp comercial: ${site.telefone} (https://wa.me/${site.whatsapp})
- Instagram: ${site.instagram}
- Endereço: ${site.endereco.rua}, ${site.endereco.cidade}/${site.endereco.estado}, CEP ${site.endereco.cep}
- Razão social: ${site.razaoSocial} · CNPJ ${site.cnpj}
`);

console.log('Gerado: index.html (SEO, ' + sabores.length + ' sabores, ' + duvidas.length + ' dúvidas), sitemap.xml, robots.txt, llms.txt');
