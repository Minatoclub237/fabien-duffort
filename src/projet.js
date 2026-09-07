/* Page projet : le hero se referme en carte au défilement, la galerie
   horizontale s'épingle, chaque image glisse dans son cadre à contresens. */
import { gsap, ScrollTrigger, defilement, revelerLignes, reveler, curseur, annee, reduit, bureau } from './commun.js';
import { menuMobile } from './menu.js';

defilement();
annee();
curseur();
menuMobile();

/* ── entrée ─────────────────────────────────────────── */
if (!reduit) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.pr__heroTexte .pill', { opacity: 0, y: 16, duration: 0.9, clearProps: 'all' }, 0.15)
    .from('.pr__lieu', { opacity: 0, y: 14, duration: 0.9, clearProps: 'all' }, 0.7)
    .from('.pr__scroll', { opacity: 0, duration: 0.8, clearProps: 'all' }, 0.9);
  revelerLignes(document.querySelector('.pr__hero [data-split]'),
    { tout_de_suite: true, delai: 0.25, duree: 1.25 });

  /* le hero se referme en carte arrondie pendant que le contenu monte */
  gsap.fromTo('.pr__heroMedia',
    { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
    {
      clipPath: 'inset(6% 5% 10% 5% round 20px)', ease: 'none',
      scrollTrigger: { trigger: '.pr__hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
  gsap.to('.pr__heroMedia img', {
    yPercent: 5, scale: 1.01, ease: 'none',
    scrollTrigger: { trigger: '.pr__hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.pr__heroTexte', {
    yPercent: -30, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.pr__hero', start: 'top top', end: '70% top', scrub: true },
  });
}

/* ── résumé et fiche technique ──────────────────────── */
if (!reduit) {
  revelerLignes(document.querySelector('[data-lignes]'), { duree: 1, decalage: 0.07 });
  reveler('.pr__fiche > div', { y: 18, duree: 0.75, decalage: 0.06 });
}

/* ── galerie horizontale épinglée ───────────────────── */
let pisteST = null;
function piste() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  if (pisteST) { pisteST.kill(); pisteST = null; gsap.set(rail, { x: 0 }); }
  if (reduit) return;    // idem : le defilement tactile pilote l'epinglage

  const course = () => Math.max(0, rail.scrollWidth - window.innerWidth);
  const t = gsap.to(rail, {
    x: () => -course(), ease: 'none',
    scrollTrigger: {
      trigger: '.pr__piste', start: 'top top',
      end: () => '+=' + (course() + window.innerHeight * 0.4),
      pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
    },
  });
  pisteST = t.scrollTrigger;

  /* chaque photo glisse à contresens dans son cadre : la profondeur vient de là */
  rail.querySelectorAll('.pr__vign').forEach((f) => {
    gsap.fromTo(f.querySelector('img'), { xPercent: -2.5 }, {
      xPercent: 2.5, ease: 'none',
      scrollTrigger: {
        trigger: f, containerAnimation: t,
        start: 'left right', end: 'right left', scrub: true,
      },
    });
  });
}
piste();

/* ── duo d'images (projets de moins de trois photos) ── */
if (!reduit) {
  gsap.utils.toArray('.pr__fig').forEach((f) => {
    gsap.fromTo(f.querySelector('img'), { yPercent: -2.5 }, {
      yPercent: 2.5, ease: 'none',
      scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ── projet suivant ─────────────────────────────────── */
if (!reduit) {
  const suiv = document.querySelector('.pr__suivant');
  if (suiv) {
    gsap.fromTo(suiv.querySelector('.pr__suivantMedia img'), { yPercent: -3 }, {
      yPercent: 3, ease: 'none',
      scrollTrigger: { trigger: suiv, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
    reveler(suiv.querySelectorAll('.eyebrow, .titre-geant, .pr__suivantLieu'),
      { y: 26, duree: 1, decalage: 0.08, start: 'top 88%' });
  }
}

let rt;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => { piste(); ScrollTrigger.refresh(); }, 200);
});
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
