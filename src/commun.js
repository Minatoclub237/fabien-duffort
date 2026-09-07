/* Socle commun aux pages projets : défilement fluide, curseur suiveur,
   découpe de titres. Le défilement garde la même inertie que la page d'accueil
   (demi-vie de 100 ms mesurée sur la vidéo de référence). */

import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import Flip from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const bureau = () => window.innerWidth > 860;
export { gsap, ScrollTrigger, SplitText, Flip };

export function defilement() {
  if (reduit) return null;
  const lenis = new Lenis({ duration: 1.0, smoothWheel: true, touchMultiplier: 1.6 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/* Découpe un titre en lignes masquées et renvoie les lignes intérieures. */
export function enLignes(el) {
  if (!el) return [];
  const split = new SplitText(el, { type: 'lines', linesClass: 'ligne' });
  split.lines.forEach((l) => {
    const inner = document.createElement('span');
    inner.innerHTML = l.innerHTML;
    l.innerHTML = '';
    l.appendChild(inner);
  });
  return split.lines.map((l) => l.firstElementChild);
}

/* Curseur suiveur : grossit au survol des liens marqués [data-curseur]. */
export function curseur() {
  const el = document.getElementById('curseur');
  if (!el || reduit || !matchMedia('(hover: hover)').matches) return;
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const vise = { ...pos };
  let actif = false;

  addEventListener('pointermove', (e) => { vise.x = e.clientX; vise.y = e.clientY; }, { passive: true });
  gsap.ticker.add(() => {
    pos.x += (vise.x - pos.x) * 0.16;
    pos.y += (vise.y - pos.y) * 0.16;
    gsap.set(el, { x: pos.x - 41, y: pos.y - 41 });
  });

  const montre = (v) => {
    if (v === actif) return;
    actif = v;
    gsap.to(el, { opacity: v ? 1 : 0, scale: v ? 1 : 0.3, duration: 0.45, ease: 'expo.out' });
  };
  document.querySelectorAll('[data-curseur]').forEach((a) => {
    a.addEventListener('pointerenter', () => montre(true));
    a.addEventListener('pointerleave', () => montre(false));
  });
}

/* Révélation au défilement.
   On n'utilise PAS gsap.from + ScrollTrigger : si le déclencheur ne part pas
   (rafraîchissement pendant la mise en place, page ouverte déjà défilée), les
   éléments restent à opacity 0 définitivement. ScrollTrigger.batch déclenche
   aussi pour ce qui est déjà à l'écran, et le filet de sécurité en fin de
   fonction garantit que rien ne peut rester invisible. */
export function reveler(cible, opts = {}) {
  const els = gsap.utils.toArray(cible);
  if (!els.length) return;
  if (reduit) { gsap.set(els, { opacity: 1, y: 0 }); return; }

  gsap.set(els, { opacity: 0, y: opts.y ?? 22 });
  ScrollTrigger.batch(els, {
    start: opts.start || 'top 96%',
    once: true,
    onEnter: (lot) => gsap.to(lot, {
      opacity: 1, y: 0, duration: opts.duree ?? 0.8, ease: 'expo.out',
      stagger: opts.decalage ?? 0.05, overwrite: true,
    }),
  });

  const filet = () => els.forEach((el) => {
    if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
    }
  });
  window.addEventListener('load', () => setTimeout(filet, 2000), { once: true });
}

/* Même sécurité pour les titres découpés en lignes masquées : sans cela, une
   ligne restée à yPercent 108 est hors de son masque, donc invisible. */
export function revelerLignes(el, opts = {}) {
  const lignes = enLignes(el);
  if (!lignes.length) return lignes;
  if (reduit) return lignes;

  gsap.set(lignes, { yPercent: 108 });
  const jouer = () => gsap.to(lignes, {
    yPercent: 0, duration: opts.duree ?? 1.1, ease: 'expo.out',
    stagger: opts.decalage ?? 0.08, overwrite: true,
  });

  if (opts.tout_de_suite) gsap.delayedCall(opts.delai ?? 0.15, jouer);
  else ScrollTrigger.batch(lignes, { start: 'top 94%', once: true, onEnter: jouer });

  window.addEventListener('load', () => setTimeout(() => {
    lignes.forEach((l) => {
      const t = gsap.getProperty(l, 'yPercent');
      if (Math.abs(t) > 1) gsap.to(l, { yPercent: 0, duration: 0.4, overwrite: true });
    });
  }, 2000), { once: true });

  return lignes;
}

export function annee() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
