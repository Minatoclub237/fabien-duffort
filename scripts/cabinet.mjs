/* Agrégats tirés des 49 projets, pour la page « Le cabinet ». */
import { PROJETS } from '../src/projets.js';

const net = (s) => String(s).replace(/\s+/g, ' ').trim();

/* fusion des libellés qui désignent le même maître d'ouvrage */
const ALIAS = {
  'ATB (Aéroport Toulouse Blagnac)': 'Aéroport Toulouse-Blagnac',
  'Groupe Klépierre': 'Klépierre',
  'Toulouse Métropôle': 'Toulouse Métropole',
  'Toulouse Football Club - TFC': 'Toulouse Football Club',
  'Institut Universitaire du Cancer de Toulouse - Oncopôle': 'Institut Universitaire du Cancer',
  'Nouvelle Clinique de L’Union, SciVal Du Flotis(Ramsay Santé)': 'Clinique de l’Union — Ramsay Santé',
  'Conseil Régional Occitanie Midi Pyrénées': 'Région Occitanie',
  'Université Toulouse, Sacim Université Fédérale': 'Université de Toulouse',
  'Ministère de l’économie': 'Ministère de l’Économie',
  'Ovalto investissement Racing Arena': 'Racing — Ovalto Investissement',
  'Fédération Marocaine de football': 'Fédération Royale Marocaine de Football',
  'Centre hopitalier de Bergerac': 'Centre hospitalier de Bergerac',
  'INSTITUT CATHOLIQUE DE TOULOUSE': 'Institut Catholique de Toulouse',
  'Porcelanosa Group': 'Porcelanosa Grupo',
  'RTE -Marseille': 'RTE',
  'Mab Développement': 'MAB Développement',
  'Carrefour Property et Carmila': 'Carrefour Property & Carmila',
  'AUCHAN': 'Auchan', 'AIRBUS': 'Airbus', 'BATPART': 'Batipart',
  'GROUPAMA': 'Groupama', 'LIEBHERR': 'Liebherr', 'INTRATERRA': 'Intraterra',
  'Particulier': 'Particuliers', 'Particulié': 'Particuliers',
  'Le Vasco _ particulier': 'Particuliers',
};
const alias = (s) => ALIAS[net(s)] || net(s);

export function agregats() {
  const mo = new Map();
  PROJETS.forEach((p) => {
    if (!p.mo) return;
    const k = alias(p.mo);
    const e = mo.get(k) || { nom: k, n: 0, img: p.img[0], slug: p.slug };
    e.n += 1;
    mo.set(k, e);
  });
  const clients = [...mo.values()].sort((a, b) => b.n - a.n || a.nom.localeCompare(b.nom));

  const part = new Map();
  PROJETS.forEach((p) => (p.partenaires || '').split(',').map(net)
    .filter((x) => x.length > 2 && !/^\(/.test(x))
    .forEach((x) => part.set(x, (part.get(x) || 0) + 1)));
  const partenaires = [...part.entries()].sort((a, b) => b[1] - a[1])
    .map(([nom, n]) => ({ nom, n }));

  const concours = PROJETS.filter((p) => /Concours|Lauréat|non réalisé/i.test(p.statut))
    .sort((a, b) => (b.annee || '').localeCompare(a.annee || ''));

  const lieux = new Map();
  PROJETS.forEach((p) => { if (p.lieu) lieux.set(p.lieu, (lieux.get(p.lieu) || 0) + 1); });
  const villes = [...lieux.entries()].sort((a, b) => b[1] - a[1]).map(([nom, n]) => ({ nom, n }));

  const annees = PROJETS.flatMap((p) => (String(p.annee || '').match(/\d{4}/g) || []).map(Number))
    .filter((a) => a > 1990);

  return {
    clients, partenaires, concours, villes,
    de: Math.min(...annees), a: Math.max(...annees),
    livres: PROJETS.filter((p) => p.statut === 'Livré').length,
    laureats: PROJETS.filter((p) => /Lauréat|projet annulé/.test(p.statut)).length,
    total: PROJETS.length,
    programmes: new Set(PROJETS.map((p) => p.secteur)).size,
  };
}
