import type { Localized } from './portfolio';

interface Project {
  title: Localized;
  description: Localized;
  technologies: string;
  href: string;
  currentSite?: boolean;
}

export const projects: Project[] = [
  {
    title: {
      en: 'Logistics Real-Time Analytics Dashboard',
      es: 'Panel de Analítica Logística en Tiempo Real',
    },
    description: {
      en: 'Container logistics and fee workflows analytics for port terminal operators, calculating truck turn times and gate congestion to drive operational efficiency.',
      es: 'Analítica de logística portuaria y flujos de tarifas, calculando tiempos de rotación de camiones y congestión de accesos para optimizar la toma de decisiones operativas.',
    },
    technologies:
      'Angular 18 · TypeScript · Chart.js · .NET · Azure · Vitest · Playwright',
    href: '#projects',
  },
  {
    title: {
      en: 'SATCOM Multi-Axis Telemetry Visualizer',
      es: 'Visualizador de Telemetría Multieje SATCOM',
    },
    description: {
      en: 'Real-time multi-axis sensor data visualization for Aerospace & Defense operations, streaming telemetry over WebSockets and RabbitMQ and integrated via Web Components.',
      es: 'Visualización multieje de datos de sensores en tiempo real para el sector Aeroespacial y Defensa, transmitiendo telemetría sobre WebSockets y RabbitMQ, integrado mediante componentes web.',
    },
    technologies:
      'Angular 16 · Plotly.js · WebSockets · RabbitMQ · Java · AWS S3/EC2 · Web Components',
    href: '#projects',
  },
  {
    title: {
      en: 'Banking Platform UI Modernization',
      es: 'Modernización de Plataforma Bancaria',
    },
    description: {
      en: 'Enterprise modernization migrating legacy AngularJS to Angular 17 component architecture with zero-defect standards, Adobe Analytics funnels, and 500+ security remediations.',
      es: 'Modernización bancaria migrando flujos legacy de AngularJS a Angular 17 basada en componentes con estándar de cero defectos, embudos analíticos y 500+ correcciones de seguridad.',
    },
    technologies:
      'Angular 17 · TypeScript · Java · JSP · Adobe Analytics · AWS Security Hub',
    href: '#projects',
  },
  {
    title: { en: 'Astro Portfolio', es: 'Portafolio Astro' },
    description: {
      en: 'Text-first engineering showcase built with Astro, semantic HTML, optimized CSS, and small client-side scripts. Bilingual content, accessible controls, locally served assets, and a measured Lighthouse report.',
      es: 'Demostración de ingeniería centrada en texto, construida con Astro, HTML semántico, CSS optimizado y pequeños scripts del lado del cliente. Contenido bilingüe, controles accesibles, recursos locales y un reporte medido de Lighthouse.',
    },
    technologies:
      'Astro · TypeScript · HTML5 · CSS3 · Performance API · Accessible Design',
    href: '#projects',
    currentSite: true,
  },
];
