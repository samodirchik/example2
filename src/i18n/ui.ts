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
    'nav.call': 'Get a Free Quote',
    'header.subtitle': 'Serving Greater Austin & Surrounding Areas',
    'header.247': 'Same-Day Emergency Service',
    
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
    'hero.badge': 'Licensed, Bonded & Insured • EPA-Certified Technicians',
    'hero.title1': 'Professional',
    'hero.title2': 'Pest Control',
    'hero.f1': '12-Month Guarantee',
    'hero.f2': 'Treatments starting at $149 for up to 1,000 sq. ft.',
    'hero.f3': '9+ Years of proven expertise',
    'hero.f4': '30-Minute Odorless & Stainless Application',
    'hero.f5': 'EPA-Registered & Eco-Friendly products',
    'hero.f6': 'Free Perimeter Defense Treatment',
    'hero.discount.badge': 'Special Offer',
    'hero.discount.title': '20% DISCOUNT',
    'hero.discount.text': 'Claim your first treatment discount. Special offer valid until',
    'hero.timer.d': 'days',
    'hero.timer.h': 'hours',
    'hero.timer.m': 'mins',
    'hero.timer.s': 'secs',
    'hero.btn.discount': 'Get Discount',

    // Footer
    'footer.desc': 'Cucaracha - professional pest control and rodent extermination services. Serving Greater Austin & Surrounding Areas. Licensed, Bonded & Insured.',
    'footer.rights': 'All rights reserved.',
    'footer.dev': 'Created by ',
    'footer.studio': 'sdccode.studio',

    // ConsultationForm
    'form.title1': 'Free Inspection & Estimate',
    'form.title2': 'Schedule Service Today!',
    'form.desc': 'Submit your details for an instant quote and our certified technician will contact you within 5 minutes.',
    'form.or_call': 'Or call our 24/7 dispatch directly:',
    'form.box.title1': 'FREE INSPECTION & ESTIMATE',
    'form.box.title2': 'NOT SURE HOW TO GET RID OF PESTS? WE CAN HELP!',
    'form.input': 'Your phone number',
    'form.submit': 'GET A FREE QUOTE',
  }
} as const;

export function useTranslations(lang?: string) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui.en[key] || '';
  };
}
