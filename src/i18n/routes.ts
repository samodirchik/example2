const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');

export const routes = {
  home: `${base}/`,
  about: `${base}/about`,
  contacts: `${base}/contacts`,
  shop: `${base}/chemical-products`,
  disinsection: {
    bugs: `${base}/disinsection/bed-bugs`,
    roaches: `${base}/disinsection/cockroaches`,
    fleas: `${base}/disinsection/fleas`,
    ticks: `${base}/disinsection/ticks`,
    ants: `${base}/disinsection/ants`,
    wasps: `${base}/disinsection/wasps`,
    moths: `${base}/disinsection/moths`,
    bark_beetles: `${base}/disinsection/bark-beetles`,
    booklice: `${base}/disinsection/booklice`,
    hornets: `${base}/disinsection/hornets`,
    spiders: `${base}/disinsection/spiders`,
    mosquitoes: `${base}/disinsection/mosquitoes`,
    flies: `${base}/disinsection/flies`,
    woodlice: `${base}/disinsection/woodlice`,
    carpet_beetles: `${base}/disinsection/carpet-beetles`,
    biscuit_beetles: `${base}/disinsection/drugstore-beetles`,
    midges: `${base}/disinsection/midges`,
    termites: `${base}/disinsection/termites`,
    centipedes: `${base}/disinsection/centipedes`,
    slugs: `${base}/disinsection/slugs`,
  },
  deratization: {
    rats_mice: `${base}/deratization/rats-and-mice`,
  },
  disinfection: {
    viruses: `${base}/disinfection/viruses-and-bacteria`,
    corona: `${base}/disinfection/coronavirus`,
    mold: `${base}/disinfection/mold-and-mildew`,
    attics: `${base}/disinfection/attics-and-basements`,
  }
} as const;

export type Routes = typeof routes;
