/* Page projet : le hero se referme en carte au défilement, la galerie
   horizontale s'épingle, chaque image glisse dans son cadre à contresens. */
import { gsap, ScrollTrigger, defilement, enLignes, curseur, annee, reduit, bureau } from './commun.js';

defilement();
annee();
curseur();

/* ── entrée ─────────────────────────────────────────── */
if (!reduit) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.pr__heroTexte .pill', { opacity: 0, y: 16, duration: 0.9 }, 0.15)
    .from(enLignes(document.querySelector('.pr__hero [data-split]')),
      { yPercent: 108, duration: 1.25, stagger: 0.08 }, 0.25)
    .from('.pr__lieu', { opacity: 0, y: 14, duration: 0.9 }, 0.7)
    .from('.pr__scroll', { opacity: 0, duration: 0.8 }, 0.9);

  /* le hero se referme en carte arrondie pendant que le contenu monte */
  gsap.fromTo('.pr__heroMedia',
    { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
    {
      clipPath: 'inset(6% 5% 10% 5% round 20px)', ease: 'none',
      scrollTrigger: { trigger: '.pr__hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
  gsap.to('.pr__heroMedia img', {
    yPercent: 12, scale: 1.02, ease: 'none',
    scrollTrigger: { trigger: '.pr__hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.pr__heroTexte', {
    yPercent: -30, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.pr__hero', start: 'top top', end: '70% top', scrub: true },
  });
}

/* ── résumé et fiche technique ──────────────────────── */
if (!reduit) {
  const resume = document.querySelector('[data-lignes]');
  if (resume) {
    gsap.from(enLignes(resume), {
      yPercent: 106, duration: 1, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: resume, start: 'top 88%', once: true },
    });
  }
  gsap.from('.pr__fiche > div', {
    opacity: 0, y: 18, duration: 0.75, ease: 'expo.out', stagger: 0.06,
    scrollTrigger: { trigger: '.pr__fiche', start: 'top 88%', once: true },
  });
}

/* ── galerie horizontale épinglée ───────────────────── */
let pisteST = null;
function piste() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  if (pisteST) { pisteST.kill(); pisteST = null; gsap.set(rail, { x: 0 }); }
  if (reduit || !bureau()) return;

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
    gsap.fromTo(f.querySelector('img'), { xPercent: -6 }, {
      xPercent: 6, ease: 'none',
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
    gsap.fromTo(f.querySelector('img'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ── projet suivant ─────────────────────────────────── */
if (!reduit) {
  const suiv = document.querySelector('.pr__suivant');
  if (suiv) {
    gsap.fromTo(suiv.querySelector('.pr__suivantMedia img'), { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: suiv, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
    gsap.from(suiv.querySelectorAll('.eyebrow, .titre-geant, .pr__suivantLieu'), {
      opacity: 0, y: 26, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: suiv, start: 'top 78%', once: true },
    });
  }
}

let rt;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => { piste(); ScrollTrigger.refresh(); }, 200);
});
document.fonts?.ready.then(() => ScrollTrigger.refresh());
window.addEventListener('load', () => ScrollTrigger.refresh());
