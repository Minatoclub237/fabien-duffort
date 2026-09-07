/* Page « Le cabinet ». Mouvement propre à cette page :
   manifeste révélé mot à mot au défilement, image flottante sur la liste des
   maîtres d'ouvrage, rubans à vitesse pilotée par le scroll, cartes inclinables. */
import { gsap, ScrollTrigger, SplitText, defilement, revelerLignes, reveler, curseur, annee, reduit } from './commun.js';
import { menuMobile } from './menu.js';

defilement();
annee();
curseur();
menuMobile();

/* ── titres ─────────────────────────────────────────── */
document.querySelectorAll('[data-split]').forEach((t, i) => {
  revelerLignes(t, { tout_de_suite: i === 0, duree: 1.2 });
});
gsap.utils.toArray('.titre-moyen').forEach((t) => revelerLignes(t, { duree: 1 }));

/* ── manifeste : chaque mot s'allume au fil du défilement ── */
const manifeste = document.querySelector('[data-mots]');
if (manifeste && !reduit) {
  const split = new SplitText(manifeste, { type: 'words', wordsClass: 'mot' });
  gsap.fromTo(split.words,
    { opacity: 0.16 },
    {
      opacity: 1, ease: 'none', stagger: 0.4,
      scrollTrigger: {
        trigger: manifeste, start: 'top 78%', end: 'bottom 52%', scrub: 0.6,
      },
    });
}

/* ── chiffres ───────────────────────────────────────── */
document.querySelectorAll('.cb__chiffre strong').forEach((el, i) => {
  const cible = +el.dataset.n;
  if (reduit) { el.textContent = cible; return; }
  ScrollTrigger.create({
    trigger: el, start: 'top 92%', once: true,
    onEnter: () => {
      const o = { v: 0 };
      gsap.to(o, {
        v: cible, duration: 1.5, ease: 'power2.out', delay: i * 0.07,
        onUpdate: () => { el.textContent = Math.round(o.v); },
      });
    },
  });
  gsap.fromTo(el.parentElement, { y: 34 }, {
    y: -14, ease: 'none',
    scrollTrigger: { trigger: '.cb__chiffres', start: 'top bottom', end: 'bottom top', scrub: true },
  });
});

/* ── liste des maîtres d'ouvrage : image qui suit le curseur ── */
(() => {
  const liste = document.getElementById('listeClients');
  const flotte = document.getElementById('flotte');
  if (!liste || !flotte) return;
  const img = flotte.querySelector('img');
  const lignes = [...liste.querySelectorAll('.cb__ligne')];

  reveler(lignes, { y: 24, decalage: 0.03 });

  if (reduit || !matchMedia('(hover: hover)').matches) return;

  const pos = { x: 0, y: 0 }; const vise = { x: 0, y: 0 };
  let visible = false;
  liste.addEventListener('pointermove', (ev) => { vise.x = ev.clientX; vise.y = ev.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    pos.x += (vise.x - pos.x) * 0.12;
    pos.y += (vise.y - pos.y) * 0.12;
    gsap.set(flotte, { x: pos.x + 28, y: pos.y - 130 });
  });

  lignes.forEach((l) => {
    l.addEventListener('pointerenter', () => {
      img.src = l.dataset.img;
      lignes.forEach((o) => o.classList.toggle('is-pale', o !== l));
      if (!visible) {
        visible = true;
        gsap.fromTo(flotte,
          { opacity: 0, scale: 0.86, rotate: -3 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'expo.out' });
      }
      gsap.to(l, { x: 14, duration: 0.5, ease: 'expo.out' });
    });
    l.addEventListener('pointerleave', () => gsap.to(l, { x: 0, duration: 0.5, ease: 'expo.out' }));
  });
  liste.addEventListener('pointerleave', () => {
    visible = false;
    lignes.forEach((o) => o.classList.remove('is-pale'));
    gsap.to(flotte, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.in' });
  });
})();

/* ── concours ───────────────────────────────────────── */
reveler('.cb__ccLigne', { y: 22, duree: 0.7, decalage: 0.045 });

/* ── rubans des partenaires ─────────────────────────── */
if (!reduit) {
  const boucles = [...document.querySelectorAll('.cb__ruban')].map((r) => {
    const rail = r.querySelector('.cb__rubanRail');
    rail.innerHTML += rail.innerHTML;            // duplication pour boucler
    const sens = +r.dataset.sens;
    gsap.set(rail, { xPercent: sens > 0 ? -50 : 0 });
    return gsap.to(rail, {
      xPercent: sens > 0 ? 0 : -50, duration: 42, ease: 'none', repeat: -1,
    });
  });
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = Math.min(5, 1 + Math.abs(self.getVelocity()) / 1400);
      boucles.forEach((b) => {
        b.timeScale(self.direction * boost);
        gsap.to(b, { timeScale: self.direction, duration: 1.1, ease: 'power2.out', overwrite: true });
      });
    },
  });
}

/* ── villes ─────────────────────────────────────────── */
if (!reduit) {
  reveler('.cb__ville', { y: 26, duree: 0.75, decalage: 0.025 });
  gsap.utils.toArray('.cb__ville').forEach((v, i) => {
    gsap.fromTo(v, { y: (i % 3) * 12 }, {
      y: -(i % 3) * 12, ease: 'none',
      scrollTrigger: { trigger: '.cb__geo', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ── cartes inclinables ─────────────────────────────── */
if (!reduit && matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((c) => {
    const q = { rx: gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' }),
                ry: gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' }) };
    c.addEventListener('pointermove', (ev) => {
      const r = c.getBoundingClientRect();
      q.ry(((ev.clientX - r.left) / r.width - 0.5) * 13);
      q.rx((0.5 - (ev.clientY - r.top) / r.height) * 13);
    });
    c.addEventListener('pointerleave', () => { q.rx(0); q.ry(0); });
  });
}

reveler('.cb__lbCarte', { y: 30, duree: 0.85, decalage: 0.07 });

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
