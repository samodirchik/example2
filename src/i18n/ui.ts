export const languages = {
  en: 'English',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    // Header & Global
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.disinsection': 'Pest Control',
    'nav.deratization': 'Rodent Control',
    'nav.disinfection': 'Disinfection',
    'nav.shop': 'Chemical Products',
    'nav.contacts': 'Contacts',
    'nav.call': 'Request a Call',
    'header.subtitle': 'Professional pest control and extermination services across Ukraine',
    'header.247': '24/7 Support',
    
    // Services Dropdowns
    'srv.bugs': 'Bed Bugs',
    'srv.roaches': 'Cockroaches',
    'srv.fleas': 'Fleas',
    'srv.ticks': 'Ticks',
    'srv.ants': 'Ants',
    'srv.wasps': 'Wasps',
    'srv.moths': 'Moths',
    'srv.bark_beetles': 'Bark Beetles',
    'srv.booklice': 'Booklice',
    'srv.hornets': 'Hornets',
    'srv.spiders': 'Spiders',
    'srv.mosquitoes': 'Mosquitoes',
    'srv.flies': 'Flies',
    'srv.woodlice': 'Woodlice & Silverfish',
    'srv.carpet_beetles': 'Carpet Beetles',
    'srv.biscuit_beetles': 'Drugstore Beetles',
    'srv.midges': 'Midges & Gnats',
    'srv.termites': 'Termites',
    'srv.centipedes': 'Centipedes',
    'srv.slugs': 'Slugs',
    'srv.rats_mice': 'Rats & Mice',
    'srv.viruses': 'Viruses & Bacteria',
    'srv.corona': 'Coronavirus (COVID-19)',
    'srv.mold': 'Mold & Mildew',
    'srv.attics': 'Attics & Basements',

    // Hero
    'hero.badge': 'Pest Control Leaders',
    'hero.title1': 'Professional',
    'hero.title2': 'Pest Control',
    'hero.f1': '12-Month Guarantee',
    'hero.f2': 'Prices starting from 500 UAH up to 25m²',
    'hero.f3': 'Over 9 years of professional experience',
    'hero.f4': 'Treatment in 30 minutes without stains or odor',
    'hero.f5': 'Certified European licensed products only',
    'hero.f6': 'Free barrier protection included',
    'hero.discount.badge': 'Special Offer',
    'hero.discount.title': '20% DISCOUNT',
    'hero.discount.text': 'Claim your first treatment discount. Special offer valid until',
    'hero.timer.d': 'days',
    'hero.timer.h': 'hours',
    'hero.timer.m': 'mins',
    'hero.timer.s': 'secs',
    'hero.btn.discount': 'Get Discount',

    // Footer
    'footer.desc': 'Cucaracha - professional pest control and extermination services',
    'footer.rights': 'All rights reserved.',
    'footer.dev': 'Created by ',
    'footer.studio': 'sdccode.studio',

    // ConsultationForm
    'form.title1': 'Free Consultation',
    'form.title2': 'Right Now!',
    'form.desc': 'Leave your request and our specialist will contact you within 5 minutes for a free consultation and price quote.',
    'form.or_call': 'Or call us directly:',
    'form.box.title1': 'FREE CONSULTATION',
    'form.box.title2': 'GET EXPERT HELP TODAY!',
    'form.input': 'Your phone number',
    'form.submit': 'SUBMIT REQUEST',
  }
} as const;

export function useTranslations(lang?: string) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui.en[key] || '';
  };
}
