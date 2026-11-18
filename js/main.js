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
const lista  = document.getElementById('lista-sabores');
const pontos = document.getElementById('pontos');
const tpl    = document.getElementById('tpl-sabor');

SABORES.forEach((s, i) => {
  const el = tpl.content.firstElementChild.cloneNode(true);
  el.id = 'sabor-' + s.id;
  if (i % 2 === 1) el.classList.add('banner--invertido');
  el.style.setProperty('--cor', s.cor);
  el.style.setProperty('--cor-escura', s.corEscura);
  el.style.setProperty('--texto', s.texto);
  el.style.setProperty('--texto-suave', s.texto === '#FFFFFF' ? 'rgba(255,255,255,.88)' : 'rgba(0,0,0,.72)');
  el.setAttribute('aria-label', 'Sabor ' + s.nome);

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

  lista.appendChild(el);

  const p = document.createElement('a');
  p.href = '#' + el.id;
  p.innerHTML = '<span>' + s.nome + '</span>';
  p.title = s.nome;
  pontos.appendChild(p);
});

/* ---------- Cabeçalho muda ao rolar ---------- */
const topo = document.getElementById('topo');
const marcarTopo = () => topo.classList.toggle('rolou', window.scrollY > 40);
marcarTopo();
window.addEventListener('scroll', marcarTopo, { passive: true });

/* ---------- Animações (GSAP) ---------- */
const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (window.gsap && window.ScrollTrigger && !semMovimento) {
  gsap.registerPlugin(ScrollTrigger);

  /* Hero: entrada do título linha por linha */
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero__selo', { y: 20, opacity: 0, duration: .8 })
    .from('.hero__titulo .linha > span', { yPercent: 110, duration: 1.1, stagger: .12 }, '-=.5')
    .from(['.hero__texto', '.hero__acoes'], { y: 30, opacity: 0, duration: .9, stagger: .12 }, '-=.6')
    .from('.hero__rolar', { opacity: 0, duration: .8 }, '-=.4');

  /* Hero: parallax ao rolar */
  gsap.to('.hero__video',    { yPercent: 18, scale: 1.15, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__conteudo', { yPercent: -25, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Intro dos sabores */
  gsap.from('.sabores__intro > *', { y: 40, opacity: 0, duration: .9, stagger: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '.sabores__intro', start: 'top 80%' } });

  /* Cada banner */
  const banners = gsap.utils.toArray('.banner');
  const links   = gsap.utils.toArray('#pontos a');

  banners.forEach((b, i) => {
    const lado    = b.classList.contains('banner--invertido') ? 1 : -1;
    const palco   = b.querySelector('.banner__palco');
    const pacote  = b.querySelector('.banner__pacote');
    const img     = b.querySelector('.banner__img');
    const info    = b.querySelectorAll('.banner__info > *');
    const marca   = b.querySelector('.banner__marca-dagua');

    // 1) Entrada: pacote gira e chega de lado, textos sobem em sequência
    gsap.timeline({ scrollTrigger: { trigger: b, start: 'top 70%', toggleActions: 'play none none reverse' } })
      .from(palco, { xPercent: 40 * lado, rotationY: 80 * lado, transformPerspective: 1200, scale: .7, opacity: 0, duration: 1.2, ease: 'power3.out' })
      .from(info,  { y: 40, opacity: 0, duration: .8, stagger: .08, ease: 'power3.out' }, '-=.8');

    // 2) Enquanto rola: o pacote gira em 3D e sobe (scrub)
    gsap.fromTo(pacote,
      { rotationY: -28 * lado, rotationX: 8, y: 80 },
      { rotationY: 28 * lado, rotationX: -6, y: -80, ease: 'none',
        scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: 1 } });

    // 3) Nome gigante no fundo desliza
    gsap.set(marca, { x: 0, y: 0, yPercent: -50 });
    gsap.fromTo(marca, { xPercent: -35 }, { xPercent: -65, ease: 'none',
      scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } });

    // 4) Bolhas em velocidades diferentes (profundidade)
    b.querySelectorAll('.bolha').forEach((bolha, k) => {
      gsap.fromTo(bolha, { y: 120 + k * 40 }, { y: -(120 + k * 60), ease: 'none',
        scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // 5) Pontos laterais: marca o sabor visível
    ScrollTrigger.create({
      trigger: b, start: 'top center', end: 'bottom center',
      onToggle: (st) => {
        if (!st.isActive) return;
        links.forEach((l, k) => l.classList.toggle('ativo', k === i));
        pontos.style.color = SABORES[i].texto;
      }
    });

    // 6) Inclinação 3D com o mouse (só desktop)
    if (window.matchMedia('(hover: hover)').matches) {
      const rx = gsap.quickTo(img, 'rotationX', { duration: .6, ease: 'power3.out' });
      const ry = gsap.quickTo(img, 'rotationY', { duration: .6, ease: 'power3.out' });
      b.addEventListener('mousemove', (e) => {
        const r = palco.getBoundingClientRect();
        const px = (e.clientX - (r.left + r.width / 2)) / r.width;
        const py = (e.clientY - (r.top + r.height / 2)) / r.height;
        ry(px * 30); rx(-py * 20);
      });
      b.addEventListener('mouseleave', () => { rx(0); ry(0); });
    }
  });

  /* Pontos aparecem só durante os banners */
  ScrollTrigger.create({
    trigger: '#lista-sabores', start: 'top center', end: 'bottom center',
    onToggle: (st) => pontos.classList.toggle('visivel', st.isActive)
  });

  /* Recalcula quando as imagens carregarem */
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
