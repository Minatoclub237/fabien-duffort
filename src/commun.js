/* Socle commun aux pages projets : défilement fluide, curseur suiveur,
   découpe de titres. Le défilement garde la même inertie que la page d'accueil
   (demi-vie de 100 ms mesurée sur la vidéo de référence). */
import '@fontsource-variable/urbanist';
import '@fontsource-variable/inter';
import './pages.css';

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

export function annee() {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}
