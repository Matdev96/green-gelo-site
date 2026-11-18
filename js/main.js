/* =========================================================
   Green Gelo — animações da página
   Usa GSAP + ScrollTrigger (arquivos locais em js/vendor)
   ========================================================= */

const WHATSAPP = '5511994814543';

/* ---------- Lista de sabores ----------
   cor        = fundo do banner
   corEscura  = sombra/gradiente do fundo
   texto      = cor do texto (escolhida para dar contraste)
   descricao / combina = textos de exemplo: confirmar com o cliente */
const SABORES = [
  { id:'pessego', nome:'Pêssego', img:'pessego.webp', cor:'#F6A26B', corEscura:'#D9653A', texto:'#2B1406',
    descricao:'Doce na medida e super refrescante. O queridinho de quem pede drink de fruta.',
    combina:'vodka, espumante e energético' },
  { id:'melancia', nome:'Melancia', img:'melancia.webp', cor:'#C8102E', corEscura:'#7A0A1C', texto:'#FFFFFF',
    descricao:'Sabor de verão o ano inteiro. Cor intensa que chama atenção no copo.',
    combina:'gin, vodka e energético' },
  { id:'laranja', nome:'Laranja', img:'laranja.webp', cor:'#F7861E', corEscura:'#C4520A', texto:'#2B1406',
    descricao:'Cítrico e equilibrado, vai bem com quase tudo que sai do balcão.',
    combina:'whisky, gin e energético' },
  { id:'morango', nome:'Morango', img:'morango.webp', cor:'#E0263F', corEscura:'#8F0E22', texto:'#FFFFFF',
    descricao:'Um clássico que nunca sai de moda. Gira rápido em qualquer ponto de venda.',
    combina:'vodka, espumante e energético' },
  { id:'maracuja', nome:'Maracujá', img:'maracuja.webp', cor:'#F5C518', corEscura:'#C98F00', texto:'#2B1F00',
    descricao:'Azedinho e tropical, dá personalidade ao drink logo no primeiro gole.',
    combina:'cachaça, vodka e energético' },
  { id:'sal-e-limao', nome:'Sal e limão', pre:'Gelo para cerveja', img:'sal-e-limao.webp', cor:'#F3A712', corEscura:'#B86E00', texto:'#2B1A00',
    descricao:'Feito para a cerveja: um toque de sal e limão que deixa cada gole mais gelado.',
    combina:'cerveja' },
  { id:'agua-de-coco', nome:'Água de coco', img:'agua-de-coco.webp', cor:'#1E7A35', corEscura:'#0B4A1E', texto:'#FFFFFF',
    descricao:'Leve e natural. Perfeito para drinks mais suaves e para o calor.',
    combina:'gin, vodka e energético tropical' },
  { id:'maca-verde', nome:'Maçã verde', img:'maca-verde.webp', cor:'#8CC63F', corEscura:'#4E8A1A', texto:'#10220A',
    descricao:'Ácida, fresca e com aquela cor que fica linda no copo.',
    combina:'vodka, gin e energético' },
  { id:'mel', nome:'Mel', img:'mel.webp', cor:'#E9B949', corEscura:'#A87412', texto:'#2B1C00',
    descricao:'Doce e encorpado, dá um toque especial em drinks com destilados.',
    combina:'whisky, cachaça e vodka' }
];

/* ---------- Monta os banners a partir da lista ---------- */
const palco   = document.getElementById('palco');
const antesDe = document.getElementById('porque');   // banners entram antes desta seção
const pontos  = document.getElementById('pontos');
const tpl     = document.getElementById('tpl-sabor');

SABORES.forEach((s, i) => {
  const el = tpl.content.firstElementChild.cloneNode(true);
  el.id = 'sabor-' + s.id;
  if (i % 2 === 1) el.classList.add('banner--invertido');
  el.style.setProperty('--lado', i % 2 === 1 ? 1 : -1);
  el.style.setProperty('--cor', s.cor);
  el.style.setProperty('--cor-escura', s.corEscura);
  el.style.setProperty('--texto', s.texto);
  el.style.setProperty('--texto-suave', s.texto === '#FFFFFF' ? 'rgba(255,255,255,.88)' : 'rgba(0,0,0,.72)');
  el.setAttribute('aria-label', 'Sabor ' + s.nome);
  el.dataset.sabor = i;

  el.querySelector('.banner__marca-dagua').textContent = s.nome;
  const img = el.querySelector('.banner__img');
  img.dataset.src = 'assets/img/produtos/' + s.img;   // carregado só perto da hora de aparecer
  img.alt = 'Pacote de gelo para drink Green sabor ' + s.nome.toLowerCase();

  el.querySelector('.banner__contador').textContent =
    String(i + 1).padStart(2, '0') + ' / ' + String(SABORES.length).padStart(2, '0');
  el.querySelector('.banner__pre').textContent  = s.pre || 'Gelo sabor';
  el.querySelector('.banner__nome').textContent = s.nome;
  el.querySelector('.banner__desc').textContent = s.descricao;
  el.querySelector('.banner__fichas').innerHTML =
    '<li>190 g · 200 ml</li><li>Já vem congelado</li><li>Abre fácil</li>';
  el.querySelector('.banner__combina').innerHTML = '<strong>Combina com:</strong> ' + s.combina;

  const msg = 'Olá, Green! Vim pelo site e quero o gelo sabor ' + s.nome.toLowerCase() + '.';
  el.querySelector('.banner__botao').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);

  palco.insertBefore(el, antesDe);

  const p = document.createElement('a');
  p.href = '#' + el.id;
  p.innerHTML = '<span>' + s.nome + '</span>';
  p.title = s.nome;
  pontos.appendChild(p);
});

/* Todos os painéis, na ordem em que aparecem */
const paineis = Array.from(palco.querySelectorAll(':scope > .painel'));
paineis.forEach((p, i) => {
  p.style.zIndex = i + 1;                       // o próximo sempre fica por cima
  const veu = document.createElement('div');    // escurece o painel quando é coberto
  veu.className = 'painel__veu';
  veu.setAttribute('aria-hidden', 'true');
  p.appendChild(veu);
});
const links = Array.from(pontos.querySelectorAll('a'));

function marcarSabor(i) {
  const ativo = i !== null && i !== undefined;
  pontos.classList.toggle('visivel', ativo);
  if (!ativo) return;
  links.forEach((l, k) => l.classList.toggle('ativo', k === i));
  pontos.style.color = SABORES[i].texto;
}


/* ---------- Bolinhas dos 9 sabores (card "9 sabores que giram") ---------- */
const bolinhas = document.getElementById('bolinhas-sabores');
if (bolinhas) {
  bolinhas.innerHTML = SABORES.map((s) => '<i aria-hidden="true" style="background:' + s.cor + '" title="' + s.nome + '"></i>').join('') +
    '<span class="so-leitor">' + SABORES.map((s) => s.nome).join(', ') + '</span>';
}

/* ---------- Dúvidas frequentes (acordeão) ---------- */
const DUVIDAS = [
  { p: 'Qual é o pedido mínimo?', r: 'Varia conforme a região e o tipo de ponto. Você recebe as condições pelo WhatsApp logo após o cadastro.' },
  { p: 'Vocês entregam na minha cidade?', r: 'A fábrica fica em São Paulo e atendemos todo o Brasil. Informe sua cidade no WhatsApp e confirmamos a entrega e o prazo.' },
  { p: 'Preciso de freezer?', r: 'Sim. O gelo é um produto que necessita de temperatura controlada e deve ser conservado em freezer.' },
  { p: 'Posso ser distribuidor?', r: 'Sim, avaliamos parcerias de distribuição. Fale com a gente no WhatsApp e conte sobre a sua operação.' }
];
const acordeao = document.getElementById('acordeao');
if (acordeao) {
  DUVIDAS.forEach((d, i) => {
    const item = document.createElement('div');
    item.className = 'pergunta';
    item.innerHTML =
      '<h3 style="margin:0"><button class="pergunta__botao" type="button" aria-expanded="false" aria-controls="resp-' + i + '" id="perg-' + i + '">' +
      '<span>' + d.p + '</span><span class="pergunta__mais" aria-hidden="true"></span></button></h3>' +
      '<div class="pergunta__resposta" id="resp-' + i + '" role="region" aria-labelledby="perg-' + i + '"><div><p>' + d.r + '</p></div></div>';
    acordeao.appendChild(item);
  });
  acordeao.addEventListener('click', (e) => {
    const b = e.target.closest('.pergunta__botao');
    if (!b) return;
    const item = b.closest('.pergunta');
    const abrir = !item.classList.contains('aberta');
    item.classList.toggle('aberta', abrir);
    b.setAttribute('aria-expanded', String(abrir));
  });
}

/* ---------- Cabeçalho muda ao rolar ---------- */
const topo = document.getElementById('topo');
const marcarTopo = () => topo.classList.toggle('rolou', window.scrollY > 40);
marcarTopo();
window.addEventListener('scroll', marcarTopo, { passive: true });


/* =========================================================
   CARREGAMENTO SOB DEMANDA (imagens e vídeo)
   ========================================================= */
function carregarImagens(raiz) {
  raiz.querySelectorAll('img[data-src]').forEach((img) => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}
function carregarProximos(i) {                 // painel atual, o anterior e os 2 próximos
  for (let k = Math.max(0, i - 1); k <= Math.min(paineis.length - 1, i + 2); k++) carregarImagens(paineis[k]);
}

const MOVIMENTO  = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
const COMPUTADOR = window.matchMedia('(min-width: 901px)').matches;

// Vídeo do topo: só depois que a página terminou de carregar; versão leve no celular
function carregarVideo() {
  const v = document.querySelector('.hero__video');
  const economia = navigator.connection && navigator.connection.saveData;
  if (!v || !MOVIMENTO || economia) return;
  v.src = COMPUTADOR ? v.dataset.video : v.dataset.videoMobile;
  v.autoplay = true;
  const p = v.play();
  if (p && p.catch) p.catch(() => {});
}
if (document.readyState === 'complete') setTimeout(carregarVideo, 300);
else window.addEventListener('load', () => setTimeout(carregarVideo, 300));

// Imagens fora do palco fixo (ou sem animação): carregam ao chegar perto da tela
function lazyPorRolagem() {
  const io = new IntersectionObserver((itens) => {
    itens.forEach((it) => { if (it.isIntersecting) { carregarImagens(it.target); io.unobserve(it.target); } });
  }, { rootMargin: '900px 0px' });
  paineis.forEach((p) => io.observe(p));
}

/* =========================================================
   CELULAR (e sem animação): só CSS + IntersectionObserver
   ========================================================= */
function iniciarCelular() {
  lazyPorRolagem();
  if (!MOVIMENTO) return;                       // "reduzir movimento": página estática
  const raiz = document.documentElement;
  raiz.classList.add('js-anima', 'modo-mob');

  // seções altas grudam pelo fim; as baixas, pelo topo
  const gruda = () => paineis.forEach((p) =>
    p.style.setProperty('--gruda', Math.min(0, window.innerHeight - p.offsetHeight) + 'px'));
  gruda();
  window.addEventListener('resize', gruda);
  window.addEventListener('load', gruda);

  // entradas: a seção ganha .em-cena quando aparece
  const ioCena = new IntersectionObserver((itens) => {
    itens.forEach((it) => {
      if (!it.isIntersecting) return;
      it.target.classList.add('em-cena');
      if (it.target.classList.contains('fabrica')) contarAte(it.target.querySelector('.contador'));
      ioCena.unobserve(it.target);
    });
  }, { threshold: 0.2 });
  paineis.forEach((p) => { if (!p.classList.contains('hero')) ioCena.observe(p); });

  // passos do "Como funciona" acendem ao passar do meio da tela
  const ioPasso = new IntersectionObserver((itens) => {
    itens.forEach((it) => it.target.classList.toggle('ativo', it.boundingClientRect.top < window.innerHeight * .6));
  }, { rootMargin: '0px 0px -40% 0px', threshold: [0, 1] });
  document.querySelectorAll('.passo').forEach((p) => ioPasso.observe(p));

  // pontos laterais não aparecem no celular; nada a fazer
}

function contarAte(el) {
  if (!el || el.dataset.contou) return;
  el.dataset.contou = '1';
  const fim = Number(el.dataset.ate || 2019), ini = 1990, t0 = performance.now(), dur = 1200;
  const passo = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(ini + (fim - ini) * e);
    if (k < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

/* =========================================================
   COMPUTADOR: palco com transições de sobreposição (GSAP)
   As bibliotecas só são baixadas aqui.
   ========================================================= */
function carregarScript(src) {
  return new Promise((ok, erro) => {
    const s = document.createElement('script');
    s.src = src; s.async = true; s.onload = ok; s.onerror = erro;
    document.head.appendChild(s);
  });
}

function iniciarComputador() {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('js-anima', 'palco-ativo');
  carregarProximos(0);


    // Direção de entrada de cada painel (repete em ciclo)
    //  cima     = sobe de baixo para cima
    //  esquerda = vem da direita para a esquerda
    //  direita  = vem da esquerda para a direita
    //  baixo    = desce de cima para baixo
    //  circulo  = abre em círculo a partir do centro
    const DIRECOES = ['cima', 'esquerda', 'direita', 'baixo', 'circulo'];
    const ENTRADA = {
      cima:     { de: { yPercent: 100 },  saida: { yPercent: -14 } },
      esquerda: { de: { xPercent: 100 },  saida: { xPercent: -14 } },
      direita:  { de: { xPercent: -100 }, saida: { xPercent: 14 } },
      baixo:    { de: { yPercent: -100 }, saida: { yPercent: 14 } },
      circulo:  { de: { clipPath: 'circle(0% at 50% 50%)' }, saida: {} }
    };

    const T = 1;     // duração da transição (em "telas" de rolagem)
    const H = 0.8;   // pausa em cada painel para ler

    const linha = gsap.timeline({ defaults: { ease: 'none' } });
    const inicio = [0];   // tempo em que cada painel termina de entrar
    const alvo = [0];     // onde os links levam (depois das animações internas)
    let t = 0;

    linha.to({}, { duration: H * 0.6 }, 0);   // pausa no hero
    t = H * 0.6;

    for (let i = 1; i < paineis.length; i++) {
      const ant = paineis[i - 1];
      const cur = paineis[i];
      const dir = ENTRADA[DIRECOES[(i - 1) % DIRECOES.length]];

      // painel anterior: recua, encolhe e escurece
      linha.to(ant, { scale: .9, ...dir.saida, duration: T }, t);
      linha.to(ant.querySelector('.painel__veu'), { opacity: .6, duration: T }, t);
      if (ant.classList.contains('hero')) {
        linha.to('.hero__conteudo', { y: -80, opacity: 0, duration: T * .6 }, t);
      }

      // painel novo: entra por cima
      if (dir.de.clipPath) {
        linha.fromTo(cur, { clipPath: 'circle(0% at 50% 50%)' },
                          { clipPath: 'circle(75% at 50% 50%)', duration: T, ease: 'power1.inOut' }, t);
      } else {
        linha.fromTo(cur, { ...dir.de }, { xPercent: 0, yPercent: 0, duration: T, ease: 'power1.inOut' }, t);
      }

      // animações internas de cada tipo de painel
      let pausa = H;
      if (cur.classList.contains('banner')) {
        pausa = H * 0.75;   // sabores: pausa um pouco menor
        const lado = cur.classList.contains('banner--invertido') ? 1 : -1;
        const marca = cur.querySelector('.banner__marca-dagua');
        gsap.set(marca, { x: 0, y: 0, yPercent: -50 });

        linha.from(cur.querySelector('.banner__palco'), {
          xPercent: 40 * lado, rotationY: 80 * lado, transformPerspective: 1200,
          scale: .7, opacity: 0, duration: T * .7, ease: 'power2.out' }, t + T * .35);
        linha.from(cur.querySelectorAll('.banner__info > *'), {
          y: 40, opacity: 0, duration: T * .5, stagger: .05, ease: 'power2.out' }, t + T * .5);

        // enquanto o painel está na tela: embalagem gira em 3D, nome e bolhas deslizam
        const vida = T + pausa + T;
        linha.fromTo(cur.querySelector('.banner__pacote'),
          { rotationY: -28 * lado, rotationX: 8, y: 60 },
          { rotationY: 28 * lado, rotationX: -6, y: -60, duration: vida }, t);
        linha.fromTo(marca, { xPercent: -35 }, { xPercent: -65, duration: vida }, t);
        cur.querySelectorAll('.bolha').forEach((b, k) => {
          linha.fromTo(b, { y: 120 + k * 40 }, { y: -(120 + k * 60), duration: vida }, t);
        });

      } else if (cur.classList.contains('porque')) {
        // cards "distribuídos" como cartas: saem do centro, girados, e se alinham
        pausa = H * 1.6;
        linha.from(cur.querySelectorAll('.porque__topo > *'), {
          y: 40, opacity: 0, duration: T * .45, stagger: .06, ease: 'power2.out' }, t + T * .35);
        const rot = [-14, 9, -7, 13];
        linha.from(cur.querySelectorAll('.card'), {
          y: () => window.innerHeight * .55, xPercent: (k) => (1.5 - k) * 106,
          rotation: (k) => rot[k], scale: .85, opacity: 0,
          duration: .55, stagger: .22, ease: 'power2.out' }, t + T * .55);
        linha.from(cur.querySelectorAll('.card__icone'), {
          scale: 0, rotation: -90, duration: .3, stagger: .22, ease: 'back.out(2)' }, t + T * .9);
        linha.from(cur.querySelectorAll('.card__sabores i'), {
          scale: 0, duration: .15, stagger: .04, ease: 'back.out(3)' }, t + T * 1.4);

      } else if (cur.classList.contains('fabrica')) {
        // foto revelada por máscara, contador até 2019 e checks desenhados
        pausa = H * 1.5;
        const grande = cur.querySelector('.foto--grande');
        linha.fromTo(grande, { clipPath: 'inset(100% 0% 0% 0% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: T * .7, ease: 'power2.inOut' }, t + T * .3);
        linha.fromTo(grande.querySelector('img'), { scale: 1.35 }, { scale: 1, duration: T + pausa }, t + T * .3);
        linha.from(cur.querySelector('.foto--pequena'), {
          y: 90, rotation: -8, opacity: 0, duration: T * .5, ease: 'power2.out' }, t + T * .8);
        linha.from(cur.querySelectorAll('.fabrica__texto > *:not(.fabrica__lista)'), {
          y: 40, opacity: 0, duration: T * .45, stagger: .06, ease: 'power2.out' }, t + T * .4);
        const cont = cur.querySelector('.contador');
        linha.fromTo(cont, { textContent: 1990 }, {
          textContent: Number(cont.dataset.ate || 2019), snap: { textContent: 1 },
          duration: T * .8, ease: 'power2.out' }, t + T * .6);
        linha.from(cur.querySelectorAll('.fabrica__lista li'), {
          x: -30, opacity: 0, duration: T * .35, stagger: .14, ease: 'power2.out' }, t + T * .75);
        linha.fromTo(cur.querySelectorAll('.check path'), { strokeDashoffset: 16 }, {
          strokeDashoffset: 0, duration: T * .25, stagger: .14 }, t + T * .9);

      } else if (cur.classList.contains('como')) {
        // linha da rota desenhada pela rolagem; o pacote anda e acende cada passo
        pausa = H * 2.6;
        linha.from(cur.querySelectorAll('.como__topo > *'), {
          y: 40, opacity: 0, duration: T * .45, stagger: .06, ease: 'power2.out' }, t + T * .35);
        const passos = cur.querySelectorAll('.passo');
        linha.from(passos, { y: 30, opacity: 0, duration: T * .4, stagger: .08, ease: 'power2.out' }, t + T * .55);
        const dur = pausa * .85;
        const prog = { p: 0 };
        linha.fromTo(cur.querySelector('.rota__progresso'), { scaleX: 0 }, { scaleX: 1, duration: dur }, t + T);
        linha.fromTo(cur.querySelector('.rota__pacote'), { left: '0%' }, { left: '100%', duration: dur }, t + T);
        linha.to(prog, { p: 1, duration: dur, onUpdate: () => {
          passos.forEach((ps, k) => ps.classList.toggle('ativo', prog.p >= k * .26 - .001 && prog.p > 0));
        } }, t + T);

      } else {
        const filhos = cur.querySelectorAll('.sabores-intro__conteudo > *, .proxima > *:not(.painel__veu)');
        if (filhos.length) {
          linha.from(filhos, { y: 60, opacity: 0, duration: T * .5, stagger: .08, ease: 'power2.out' }, t + T * .45);
        }
      }

      // painel de duas telas atrás some (deixa a pilha limpa)
      if (i >= 2) linha.set(paineis[i - 2], { autoAlpha: 0 }, t + T);

      t += T;
      inicio[i] = t;
      alvo[i] = cur.classList.contains('banner') ? t : t + pausa * .5;
      linha.to({}, { duration: pausa }, t);   // pausa para ler
      t += pausa;
    }

    const st = ScrollTrigger.create({
      animation: linha,
      trigger: palco,
      start: 'top top',
      end: () => '+=' + Math.round(linha.duration() * window.innerHeight * 0.9),
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: () => {
        const tempo = linha.time();
        let atual = 0;
        for (let i = 0; i < inicio.length; i++) if (tempo >= inicio[i] - T * .5) atual = i;
        carregarProximos(atual);
        const sabor = paineis[atual].dataset.sabor;
        marcarSabor(sabor !== undefined ? Number(sabor) : null);
      }
    });

    // Links internos (#sabores, #revenda, pontos...) levam ao painel certo
    const irPara = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const idx = paineis.findIndex((p) => '#' + p.id === a.getAttribute('href'));
      if (idx < 0) return;
      e.preventDefault();
      const y = st.start + (alvo[idx] / linha.duration()) * (st.end - st.start);
      window.scrollTo({ top: Math.ceil(y) + 2, behavior: 'smooth' });
    };
    document.addEventListener('click', irPara);


    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.banner').forEach((b) => {
        const img = b.querySelector('.banner__img');
        const area = b.querySelector('.banner__palco');
        const rx = gsap.quickTo(img, 'rotationX', { duration: .6, ease: 'power3.out' });
        const ry = gsap.quickTo(img, 'rotationY', { duration: .6, ease: 'power3.out' });
        b.addEventListener('mousemove', (e) => {
          const r = area.getBoundingClientRect();
          ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 30);
          rx(-((e.clientY - (r.top + r.height / 2)) / r.height) * 20);
        });
        b.addEventListener('mouseleave', () => { rx(0); ry(0); });
      });
    }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (COMPUTADOR && MOVIMENTO) {
  // A tela fixa é montada no primeiro sinal de uso (mouse, rolagem, toque ou teclado).
  // O topo já anima só com CSS, então a pessoa não percebe; e a página abre mais leve.
  ['gsap.min.js', 'ScrollTrigger.min.js'].forEach((f) => {       // baixa antes, sem executar
    const l = document.createElement('link');
    l.rel = 'prefetch'; l.as = 'script'; l.href = 'js/vendor/' + f;
    document.head.appendChild(l);
  });
  const EVENTOS = ['pointermove', 'pointerdown', 'wheel', 'scroll', 'keydown', 'touchstart'];
  let iniciou = false;
  const comecar = () => {
    if (iniciou) return;
    iniciou = true;
    EVENTOS.forEach((ev) => window.removeEventListener(ev, comecar));
    const y = window.scrollY;
    carregarScript('js/vendor/gsap.min.js')
      .then(() => carregarScript('js/vendor/ScrollTrigger.min.js'))
      .then(() => { iniciarComputador(); if (y > 0) window.scrollTo(0, y); })
      .catch(iniciarCelular);                   // se a biblioteca falhar, usa a versão leve
  };
  EVENTOS.forEach((ev) => window.addEventListener(ev, comecar, { passive: true }));
  if (location.hash) comecar();                 // chegou por um link com #seção
} else {
  iniciarCelular();
}

// Se a pessoa redimensionar e trocar entre computador e celular, recarrega no modo certo
window.matchMedia('(min-width: 901px)').addEventListener('change', () => location.reload());
