import type { Localized } from './portfolio';
import { profile } from './portfolio';

export const contactIntro: Localized = {
  en: "Have an interesting problem to solve, architecture to design, or looking to collaborate? Let's connect:",
  es: '¿Tienes un problema interesante por resolver, una arquitectura por diseñar o buscas colaborar? Conectemos:',
};
export const contacts: {
  label: Localized;
  text: string;
  href?: string;
  external?: boolean;
}[] = [
  {
    label: { en: 'Email:', es: 'Correo:' },
    text: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    label: { en: 'LinkedIn:', es: 'LinkedIn:' },
    text: 'linkedin.com/in/donatoalvarezdev',
    href: 'https://www.linkedin.com/in/donatoalvarezdev',
    external: true,
  },
  {
    label: { en: 'GitHub:', es: 'GitHub:' },
    text: 'github.com/DonytXz',
    href: 'https://github.com/DonytXz',
    external: true,
  },
  {
    label: { en: 'Location:', es: 'Ubicación:' },
    text: 'Zapopan / Guadalajara, Jalisco, México',
  },
];

export interface SocialLink {
  label: Localized;
  href: Localized<string> | string;
}

export const cvUrls: Localized = {
  en: 'https://drive.google.com/file/d/1SRp4-2t0IhTNaXhjRZsta13z31zSUGr_/view?usp=sharing',
  es: 'https://drive.google.com/file/d/19RqPzVqYeVGDIDOHLwEoAZ-DIE1VL3wd/view?usp=sharing',
};

export const socialLinks: SocialLink[] = [
  {
    label: { en: 'LinkedIn', es: 'LinkedIn' },
    href: 'https://www.linkedin.com/in/donatoalvarezdev',
  },
  {
    label: { en: 'CV', es: 'CV' },
    href: cvUrls,
  },
  {
    label: { en: 'GitHub', es: 'GitHub' },
    href: 'https://github.com/DonytXz',
  },
];
