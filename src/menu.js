/* Menu mobile. Sous 860 px les liens de la barre sont masqués : sans ce
   panneau, un visiteur au téléphone n'a aucune navigation. */
export function menuMobile() {
  const bouton = document.getElementById('burger');
  const panneau = document.getElementById('menuMobile');
  if (!bouton || !panneau) return;

  let ouvert = false;

  const basculer = (etat) => {
    ouvert = etat;
    bouton.setAttribute('aria-expanded', String(etat));
    bouton.setAttribute('aria-label', etat ? 'Fermer le menu' : 'Ouvrir le menu');
    bouton.classList.toggle('est-ouvert', etat);
    document.documentElement.classList.toggle('menu-ouvert', etat);
    if (etat) {
      panneau.hidden = false;
      requestAnimationFrame(() => panneau.classList.add('est-ouvert'));
      panneau.querySelector('a')?.focus({ preventScroll: true });
    } else {
      panneau.classList.remove('est-ouvert');
      const fin = () => { panneau.hidden = true; panneau.removeEventListener('transitionend', fin); };
      panneau.addEventListener('transitionend', fin);
      setTimeout(() => { if (!ouvert) panneau.hidden = true; }, 500);
    }
  };

  bouton.addEventListener('click', () => basculer(!ouvert));
  panneau.addEventListener('click', (e) => { if (e.target.closest('a')) basculer(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && ouvert) basculer(false); });
  window.addEventListener('resize', () => { if (ouvert && window.innerWidth > 860) basculer(false); });
}
