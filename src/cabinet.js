/* Page « Le cabinet ». Mouvement propre à cette page :
   manifeste révélé mot à mot au défilement, image flottante sur la liste des
   maîtres d'ouvrage, rubans à vitesse pilotée par le scroll, cartes inclinables. */
import { gsap, ScrollTrigger, SplitText, defilement, enLignes, curseur, annee, reduit } from './commun.js';

defilement();
annee();
curseur();

/* ── titres ─────────────────────────────────────────── */
if (!reduit) {
  document.querySelectorAll('[data-split]').forEach((t, i) => {
    const lignes = enLignes(t);
    if (i === 0) {
      gsap.from(lignes, { yPercent: 108, duration: 1.2, ease: 'expo.out', stagger: 0.09, delay: 0.12 });
    } else {
      gsap.from(lignes, {
        yPercent: 108, duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: t, start: 'top 88%', once: true },
      });
    }
  });
  gsap.utils.toArray('.titre-moyen').forEach((t) => {
    gsap.from(enLignes(t), {
      yPercent: 106, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: t, start: 'top 88%', once: true },
    });
  });
}

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

  if (!reduit) {
    gsap.from(lignes, {
      opacity: 0, y: 24, duration: 0.8, ease: 'expo.out', stagger: 0.03,
      scrollTrigger: { trigger: liste, start: 'top 84%', once: true },
    });
  }

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
if (!reduit) {
  gsap.from('.cb__ccLigne', {
    opacity: 0, y: 22, duration: 0.7, ease: 'expo.out', stagger: 0.045,
    scrollTrigger: { trigger: '.cb__cc', start: 'top 86%', once: true },
  });
}

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
  gsap.from('.cb__ville', {
    opacity: 0, y: 26, scale: 0.94, duration: 0.75, ease: 'expo.out', stagger: 0.025,
    scrollTrigger: { trigger: '.cb__villes', start: 'top 86%', once: true },
  });
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
  gsap.from('.cb__lbCarte', {
    opacity: 0, y: 30, duration: 0.85, ease: 'expo.out', stagger: 0.07,
    scrollTrigger: { trigger: '.cb__lb', start: 'top 86%', once: true },
  });
}

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
