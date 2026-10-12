export const routes = {
  home: '/',
  about: '/o-nac',
  contacts: '/kontakty-ua',
  shop: '/prodazh-khimii-ua',
  disinsection: {
    bugs: '/dezinsekciya-ua/klopy-ua',
    roaches: '/dezinsekciya-ua/tarakany-ua',
    fleas: '/dezinsekciya-ua/blohi-ua',
    ticks: '/dezinsekciya-ua/kleshchi-ua',
    ants: '/dezinsekciya-ua/murahy-ua',
    wasps: '/dezinsekciya-ua/osy-ua',
    moths: '/dezinsekciya-ua/mil-ua',
    bark_beetles: '/dezinsekciya-ua/koroidy-ua',
    booklice: '/dezinsekciya-ua/sinoidy-ua',
    hornets: '/dezinsekciya-ua/shershni-ua',
    spiders: '/dezinsekciya-ua/pavuky-ua',
    mosquitoes: '/dezinsekciya-ua/komari-ua',
    flies: '/dezinsekciya-ua/muhy-ua',
    woodlice: '/dezinsekciya-ua/mokryci-ua',
    carpet_beetles: '/dezinsekciya-ua/shkiroidy-ua',
    biscuit_beetles: '/dezinsekciya-ua/hlibni-tochilnyky-ua',
    midges: '/dezinsekciya-ua/moshky-ua',
    termites: '/dezinsekciya-ua/termity-ua',
    centipedes: '/dezinsekciya-ua/skolopendry-ua',
    slugs: '/dezinsekciya-ua/slyzni-ua',
  },
  deratization: {
    rats_mice: '/deratyzaciya-ua/shchury-ta-myshi-ua',
  },
  disinfection: {
    viruses: '/dezinfekciya-ua/virusy-i-bakterii-ua',
    corona: '/dezinfekciya-ua/koronavirus-ua',
    mold: '/dezinfekciya-ua/plesen-i-gribok-ua',
    attics: '/dezinfekciya-ua/gorysha-ta-pidvaly-ua',
  }
} as const;

export type Routes = typeof routes;
