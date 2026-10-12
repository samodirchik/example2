export const routes = {
  home: '/',
  about: '/about',
  contacts: '/contacts',
  shop: '/chemical-products',
  disinsection: {
    bugs: '/disinsection/bed-bugs',
    roaches: '/disinsection/cockroaches',
    fleas: '/disinsection/fleas',
    ticks: '/disinsection/ticks',
    ants: '/disinsection/ants',
    wasps: '/disinsection/wasps',
    moths: '/disinsection/moths',
    bark_beetles: '/disinsection/bark-beetles',
    booklice: '/disinsection/booklice',
    hornets: '/disinsection/hornets',
    spiders: '/disinsection/spiders',
    mosquitoes: '/disinsection/mosquitoes',
    flies: '/disinsection/flies',
    woodlice: '/disinsection/woodlice',
    carpet_beetles: '/disinsection/carpet-beetles',
    biscuit_beetles: '/disinsection/drugstore-beetles',
    midges: '/disinsection/midges',
    termites: '/disinsection/termites',
    centipedes: '/disinsection/centipedes',
    slugs: '/disinsection/slugs',
  },
  deratization: {
    rats_mice: '/deratization/rats-and-mice',
  },
  disinfection: {
    viruses: '/disinfection/viruses-and-bacteria',
    corona: '/disinfection/coronavirus',
    mold: '/disinfection/mold-and-mildew',
    attics: '/disinfection/attics-and-basements',
  }
} as const;

export type Routes = typeof routes;
