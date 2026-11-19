/* =========================================================
   Green Gelo — animações da página
   Usa GSAP + ScrollTrigger (arquivos locais em js/vendor)
   ========================================================= */

/* Os banners dos sabores e o FAQ já vêm escritos no index.html
   (gerados por ferramentas/gerar.mjs a partir de dados/*.json).
   Aqui o script só lê o que está na página. */

const palco   = document.getElementById('palco');
const pontos  = document.getElementById('pontos');
const banners = Array.from(palco.querySelectorAll('.banner'));

/* ---------- Pontos laterais (um por sabor) ---------- */
banners.forEach((b) => {
  const p = document.createElement('a');
  p.href = '#' + b.id;
  p.title = b.dataset.nome;
  p.innerHTML = '<span>' + b.dataset.nome + '</span>';
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
  pontos.style.color = banners[i].dataset.texto;
}

/* ---------- Bolinhas dos 9 sabores (card "9 sabores que giram") ---------- */
const bolinhas = document.getElementById('bolinhas-sabores');
if (bolinhas) {
  bolinhas.innerHTML = banners.map((b) => '<i aria-hidden="true" style="background:' + b.dataset.cor + '" title="' + b.dataset.nome + '"></i>').join('') +
    '<span class="so-leitor">' + banners.map((b) => b.dataset.nome).join(', ') + '</span>';
}

/* ---------- Dúvidas frequentes (acordeão) ---------- */
const acordeao = document.getElementById('acordeao');
if (acordeao) {
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
requestAnimationFrame(marcarTopo);   // depois do primeiro desenho (evita recalcular o layout à toa)
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
  const gruda = () => {
    const alturas = paineis.map((p) => p.offsetHeight);          // primeiro lê tudo...
    paineis.forEach((p, i) =>                                     // ...depois escreve
      p.style.setProperty('--gruda', Math.min(0, window.innerHeight - alturas[i]) + 'px'));
  };
  requestAnimationFrame(gruda);
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
