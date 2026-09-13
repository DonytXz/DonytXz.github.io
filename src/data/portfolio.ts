export const languages = ['en', 'es'] as const;
export type Language = (typeof languages)[number];
export type Localized<T = string> = Record<Language, T>;

export const profile = {
  name: 'Donato Alvarez',
  email: 'me@donatoalvarez.dev',
  description:
    'Software Engineer with 6+ years specializing in frontend architecture (Angular, React, Vue.js), real-time data visualization, and full stack systems (.NET, Java, Node.js, Cloud).',
  subtitle: {
    en: 'Sr Software Engineer · Frontend Architecture & Full Stack',
    es: 'Ingeniero de Software Senior · Arquitectura Frontend y Full Stack',
  },
};

export const sections = [
  {
    id: 'about',
    nav: { en: 'About', es: 'Acerca de' },
    title: { en: 'About Me', es: 'Acerca de Mí' },
  },
  {
    id: 'experience',
    nav: { en: 'Experience', es: 'Experiencia' },
    title: { en: 'Experience', es: 'Experiencia' },
  },
  {
    id: 'projects',
    nav: { en: 'Projects', es: 'Proyectos' },
    title: { en: 'Featured Projects', es: 'Proyectos Destacados' },
  },
  {
    id: 'skills',
    nav: { en: 'Skills', es: 'Habilidades' },
    title: {
      en: 'Skills & Technical Stack',
      es: 'Habilidades y Stack Técnico',
    },
  },
  {
    id: 'education',
    nav: { en: 'Education', es: 'Educación' },
    title: { en: 'Education & Certifications', es: 'Educación y Certificados' },
  },
  {
    id: 'contact',
    nav: { en: 'Contact', es: 'Contacto' },
    title: { en: 'Contact', es: 'Contacto' },
  },
] as const satisfies readonly {
  id: string;
  nav: Localized;
  title: Localized;
}[];

export type SectionId = (typeof sections)[number]['id'];

export const about: Localized<string[]> = {
  en: [
    'Software Engineer with 6+ years of experience specializing in frontend architecture (Angular, React, Vue.js) and complex data visualization. I engineer AI-driven, scalable, and high-performance web applications with versatile full stack capabilities across Node.js, .NET, PHP, Java, and cloud platforms (AWS, Azure).',
    'Passionate about web standards, performance optimization, and clean architecture. This portfolio is built with Astro, generating semantic HTML and optimized CSS with small client-side scripts. System fonts and locally served assets keep the initial page free of external network requests.',
  ],
  es: [
    'Ingeniero de Software con 6 años de experiencia especializado en arquitectura frontend (Angular, React, Vue.js) y visualización compleja de datos. Desarrollo aplicaciones web escalables y de alto rendimiento priorizando la IA (AI-first), con capacidades full stack versátiles en Node.js, .NET, PHP, Java y plataformas en la nube (AWS, Azure).',
    'Apasionado por los estándares web, la optimización de rendimiento y la arquitectura limpia. Este portafolio está construido con Astro, generando HTML semántico y CSS optimizado con pequeños scripts del lado del cliente. Las fuentes del sistema y los recursos locales mantienen la carga inicial libre de solicitudes externas a la red.',
  ],
};

export const footer: Localized = {
  en: 'Built with Astro · Semantic HTML & CSS · Engineered for speed.',
  es: 'Construido con Astro · HTML y CSS semántico · Diseñado para máxima velocidad.',
};
