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
  { id:'pessego', nome:'Pêssego', img:'pessego.png', cor:'#F6A26B', corEscura:'#D9653A', texto:'#2B1406',
    descricao:'Doce na medida e super refrescante. O queridinho de quem pede drink de fruta.',
    combina:'vodka, espumante e energético' },
  { id:'melancia', nome:'Melancia', img:'melancia.png', cor:'#C8102E', corEscura:'#7A0A1C', texto:'#FFFFFF',
    descricao:'Sabor de verão o ano inteiro. Cor intensa que chama atenção no copo.',
    combina:'gin, vodka e energético' },
  { id:'laranja', nome:'Laranja', img:'laranja.png', cor:'#F7861E', corEscura:'#C4520A', texto:'#2B1406',
    descricao:'Cítrico e equilibrado, vai bem com quase tudo que sai do balcão.',
    combina:'whisky, gin e energético' },
  { id:'morango', nome:'Morango', img:'morango.png', cor:'#E0263F', corEscura:'#8F0E22', texto:'#FFFFFF',
    descricao:'Um clássico que nunca sai de moda. Gira rápido em qualquer ponto de venda.',
    combina:'vodka, espumante e energético' },
  { id:'maracuja', nome:'Maracujá', img:'maracuja.png', cor:'#F5C518', corEscura:'#C98F00', texto:'#2B1F00',
    descricao:'Azedinho e tropical, dá personalidade ao drink logo no primeiro gole.',
    combina:'cachaça, vodka e energético' },
  { id:'sal-e-limao', nome:'Sal e limão', pre:'Gelo para cerveja', img:'sal-e-limao.png', cor:'#F3A712', corEscura:'#B86E00', texto:'#2B1A00',
    descricao:'Feito para a cerveja: um toque de sal e limão que deixa cada gole mais gelado.',
    combina:'cerveja' },
  { id:'agua-de-coco', nome:'Água de coco', img:'agua-de-coco.png', cor:'#1E7A35', corEscura:'#0B4A1E', texto:'#FFFFFF',
    descricao:'Leve e natural. Perfeito para drinks mais suaves e para o calor.',
    combina:'gin, vodka e energético tropical' },
  { id:'maca-verde', nome:'Maçã verde', img:'maca-verde.png', cor:'#8CC63F', corEscura:'#4E8A1A', texto:'#10220A',
    descricao:'Ácida, fresca e com aquela cor que fica linda no copo.',
    combina:'vodka, gin e energético' },
  { id:'mel', nome:'Mel', img:'mel.png', cor:'#E9B949', corEscura:'#A87412', texto:'#2B1C00',
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
  el.style.setProperty('--cor', s.cor);
  el.style.setProperty('--cor-escura', s.corEscura);
  el.style.setProperty('--texto', s.texto);
  el.style.setProperty('--texto-suave', s.texto === '#FFFFFF' ? 'rgba(255,255,255,.88)' : 'rgba(0,0,0,.72)');
  el.setAttribute('aria-label', 'Sabor ' + s.nome);
  el.dataset.sabor = i;

  el.querySelector('.banner__marca-dagua').textContent = s.nome;
  const img = el.querySelector('.banner__img');
  img.src = 'assets/img/produtos/' + s.img;
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
   ANIMAÇÕES (GSAP)
   ========================================================= */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  /* ----- Comum: entrada do hero e inclinação com o mouse ----- */
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('js-anima');
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.hero__selo', { y: 20, opacity: 0, duration: .8 })
      .from('.hero__titulo .linha > span', { yPercent: 110, duration: 1.1, stagger: .12 }, '-=.5')
      .from(['.hero__texto', '.hero__acoes'], { y: 30, opacity: 0, duration: .9, stagger: .12 }, '-=.6')
      .from('.hero__rolar', { opacity: 0, duration: .8 }, '-=.4');

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
    return () => document.documentElement.classList.remove('js-anima');
  });

  /* ----- COMPUTADOR: palco com transições de sobreposição -----
     Cada seção entra por cima da anterior, alternando a direção. */
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    document.documentElement.classList.add('palco-ativo');

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

    return () => {
      document.documentElement.classList.remove('palco-ativo');
      document.removeEventListener('click', irPara);
      marcarSabor(null);
    };
  });

  /* ----- CELULAR: cada seção sobe por cima da anterior ----- */
  mm.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.to('.hero__conteudo', { yPercent: -25, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    paineis.forEach((p, i) => {
      if (i === paineis.length - 1) return;
      // fixa o painel quando o fim dele chega ao fim da tela; o próximo sobe por cima
      ScrollTrigger.create({
        trigger: p,
        start: () => (p.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom'),
        end: () => '+=' + window.innerHeight,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true
      });
      gsap.to(p.querySelector('.painel__veu'), { opacity: .55, ease: 'none',
        scrollTrigger: { trigger: paineis[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
    });

    paineis.forEach((b) => {
      if (!b.classList.contains('banner')) return;
      const lado = b.classList.contains('banner--invertido') ? 1 : -1;
      gsap.timeline({ scrollTrigger: { trigger: b, start: 'top 70%', toggleActions: 'play none none reverse' } })
        .from(b.querySelector('.banner__palco'), { xPercent: 30 * lado, rotationY: 70 * lado, transformPerspective: 1200,
          scale: .75, opacity: 0, duration: 1.1, ease: 'power3.out' })
        .from(b.querySelectorAll('.banner__info > *'), { y: 30, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out' }, '-=.7');
      gsap.fromTo(b.querySelector('.banner__pacote'), { rotationY: -24 * lado, y: 40 }, { rotationY: 24 * lado, y: -40, ease: 'none',
        scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });

    // Por que revender: cards entram em sequência
    gsap.from('.porque__topo > *', { y: 30, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out',
      scrollTrigger: { trigger: '.porque', start: 'top 70%' } });
    gsap.from('.card', { y: 80, rotation: (k) => [-10, 8, -6, 10][k], opacity: 0, duration: .8, stagger: .12, ease: 'power3.out',
      scrollTrigger: { trigger: '.porque__cards', start: 'top 85%' } });

    // Fábrica: foto revelada, contador e checks
    gsap.fromTo('.foto--grande', { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)',
      duration: 1.1, ease: 'power2.inOut', scrollTrigger: { trigger: '.fabrica__fotos', start: 'top 80%' } });
    gsap.from('.foto--pequena', { y: 60, rotation: -8, opacity: 0, duration: .8, delay: .4, ease: 'power2.out',
      scrollTrigger: { trigger: '.fabrica__fotos', start: 'top 80%' } });
    const cont = document.querySelector('.contador');
    gsap.fromTo(cont, { textContent: 1990 }, { textContent: Number(cont.dataset.ate || 2019), snap: { textContent: 1 },
      duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: cont, start: 'top 85%' } });
    gsap.from('.fabrica__lista li', { x: -24, opacity: 0, duration: .6, stagger: .1, ease: 'power2.out',
      scrollTrigger: { trigger: '.fabrica__lista', start: 'top 85%' } });
    gsap.fromTo('.check path', { strokeDashoffset: 16 }, { strokeDashoffset: 0, duration: .4, stagger: .1, delay: .2,
      scrollTrigger: { trigger: '.fabrica__lista', start: 'top 85%' } });

    // Como funciona: linha vertical desenhada pela rolagem e passos acendendo
    const passosM = document.querySelectorAll('.passo');
    gsap.fromTo('.rota__progresso', { scaleY: 0 }, { scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.rota', start: 'top 70%', end: 'bottom 60%', scrub: true,
        onUpdate: (st) => passosM.forEach((ps, k) => ps.classList.toggle('ativo', st.progress >= k * .3 && st.progress > 0)) } });
    gsap.fromTo('.rota__pacote', { top: '0%' }, { top: '100%', ease: 'none',
      scrollTrigger: { trigger: '.rota', start: 'top 70%', end: 'bottom 60%', scrub: true } });

    paineis.forEach((p) => {
      const n = Number(p.dataset.sabor);
      if (Number.isNaN(n)) return;
      ScrollTrigger.create({ trigger: p, start: 'top center', end: 'bottom center',
        onToggle: (s) => s.isActive && marcarSabor(n) });
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
}
