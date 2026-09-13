import type { Localized } from './portfolio';

interface RoleCopy {
  title: string;
  company: string;
  meta: string;
  bullets: string[];
}
export interface Role {
  featured: boolean;
  content: Localized<RoleCopy>;
}

// Preserve the original CV grouping, ordering, and independently authored translations.
export const experience: Role[] = [
  {
    featured: true,
    content: {
      en: {
        title: 'Senior Software Engineer',
        company: 'Programming.com',
        meta: 'July 2025 – Present · Zapopan, Jalisco, México (Hybrid)',
        bullets: [
          'Engineered a real-time analytics dashboard using Angular 18, Chart.js, .NET and Azure, utilizing an AI-first development methodology to visualize complex container logistics and fee workflows, enabling terminal operators to make faster, data-driven decisions on truck turn times and gate congestion.',
          'Built Export Moves features managing container logistics and enabling third-party integrations for drayage companies, streamlining multi-tenant orchestration and improving cross-platform data synchronization.',
          'Owned CI/CD pipelines, Azure Service Fabric and Azure Static Web Apps deployments while implementing unit testing with Vitest and Playwright E2E tests, validating critical releases across all environments to ensure rapid feedback cycles and reliable rollouts.',
          'Contributed to seamless production deployments and established efficient fast-track procedures for resolving unexpected deployment-phase incidents.',
        ],
      },
      es: {
        title: 'Ingeniero de Software Senior',
        company: 'Programming.com',
        meta: 'Julio 2025 – Actual · Zapopan, Jalisco, México (Híbrido)',
        bullets: [
          'Desarrollé un panel de analítica usando Angular 18, Chart.js, .NET y Azure, desarrollo priorizando la IA (AI-first) para visualizar los movimientos portuarios. Esto permitió a los operadores de terminales tomar decisiones más rápidas y basadas en datos sobre los tiempos de rotación de camiones y la congestión en los accesos.',
          'Desarrollé la funcionalidad de exportación, gestionando la logística de contenedores y permitiendo integraciones de terceros para empresas de transporte de arrastre (drayage), optimizando la orquestación multi-tenant.',
          'Gestioné los despliegues de CI/CD, despliegues Azure Service Fabric y Azure Static Web Apps, implementando las pruebas unitarias con Vitest y E2E con Playwright, validando las versiones críticas y estableciendo procedimientos de vía rápida para resolver incidentes durante la fase de implementación.',
          'Contribuí a despliegues de producción sin interrupciones y establecí procedimientos rápidos y eficientes para resolver incidentes inesperados en la fase de despliegue.',
        ],
      },
    },
  },
  {
    featured: true,
    content: {
      en: {
        title: 'IT Analyst',
        company: 'Tata Consultancy Services (TCS)',
        meta: 'November 2023 – June 2025 · Zapopan, Jalisco, México (Hybrid)',
        bullets: [
          'Migrated legacy AngularJS flows to Angular 17, redesigning the UI into a component-based architecture and enforcing a zero-defect release standard for a major banking client. Implemented Adobe Analytics to capture granular user events and funnels, enabling data-driven UX improvements and prioritized feature delivery.',
          'Upgraded core UI and backend architectures across Angular, Java, JSP, and legacy visualization libraries, partnering with QA for rigorous testing to prevent regressions and maintain stable crossflow integrations.',
          'Documented migration runbooks and remediated 500+ security flaws (XSS, CSRF, dependencies), leveraging AWS Security Hub and Amazon Inspector for continuous vulnerability monitoring and verification, ensuring zero post-release incidents.',
        ],
      },
      es: {
        title: 'Analista TI',
        company: 'Tata Consultancy Services (TCS)',
        meta: 'Noviembre 2023 – Junio 2025 · Zapopan, Jalisco, México (Híbrido)',
        bullets: [
          'Migramos los flujos legacy de AngularJS a Angular 17, rediseñamos la interfaz de usuario con una arquitectura basada en componentes e implementamos un estándar de lanzamiento sin defectos para un importante cliente bancario. Implementamos Adobe Analytics para capturar eventos y embudos de usuario detallados, lo que permitió mejoras de la experiencia de usuario basadas en datos y priorizó la entrega de nuevas funcionalidades.',
          'Actualización del núcleo de UI y del backend en Angular, Java y las bibliotecas de visualización legacy.',
          'Se documentaron los manuales de migración y corrigieron 500+ fallos de seguridad (XSS, CSRF, dependencias), aprovechando AWS Security Hub y Amazon Inspector para monitorización y verificación continua de vulnerabilidades, asegurando cero incidentes post-lanzamiento.',
        ],
      },
    },
  },
  {
    featured: true,
    content: {
      en: {
        title: 'Software Engineer',
        company: 'Softtek',
        meta: 'July 2022 – May 2023 · Zapopan, Jalisco, México (Remote)',
        bullets: [
          "Developed and maintained Angular / .NET applications, managing cloud infrastructure on Azure App Service and utilizing Application Insights to monitor app health and optimize performance for a US real estate client, owning core app features like property valuation while supporting the React-based real estate agent's onboarding flow.",
          'Executed rigorous cross-browser and cross-device responsive testing using BrowserStack across high-traffic mobile and desktop devices to ensure UI consistency.',
        ],
      },
      es: {
        title: 'Ingeniero de Software',
        company: 'Softtek',
        meta: 'Julio 2022 – Mayo 2023 · Zapopan, Jalisco, México (Remoto)',
        bullets: [
          'Se desarrolló y mantuvo aplicaciones Angular/.NET, gestionando la infraestructura en la nube en Azure App Service y se utilizó Application Insights para monitorizar el estado de la aplicación y optimizar el rendimiento de un cliente inmobiliario estadounidense, gestionando funciones clave como la valoración de propiedades mientras apoyaba el flujo de incorporación del agente inmobiliario basado en React.',
          'Se garantizó alta calidad de código y coherencia de la interfaz mediante pruebas unitarias Jasmine/Karma, verificación por Sonar y rigurosas pruebas entre navegador/dispositivos usando BrowserStack.',
        ],
      },
    },
  },
  {
    featured: false,
    content: {
      en: {
        title: 'Sr Full Stack Developer',
        company: 'ConsultNet Technology Services and Solutions',
        meta: 'May 2023 – August 2023 · Zapopan, Jalisco, México (Onsite)',
        bullets: [
          'Built Plotly.js multi-axis visualizations with Angular 16, TypeScript, Java, AWS EC2 instances, and AWS S3 for sensor file storage, WebSockets and RabbitMQ for a SATCOM client (Aerospace & Defense).',
          'Embedded the Angular app into an existing CMDBuild project built with EXTJS JavaScript framework using web components.',
          'Processed and managed sensor data stored in AWS S3 buckets, enabling effective data visualization and analysis.',
        ],
      },
      es: {
        title: 'Desarrollador Full Stack Senior',
        company: 'ConsultNet Technology Services and Solutions',
        meta: 'Mayo 2023 – Julio 2023 · Zapopan, Jalisco, México (En sitio)',
        bullets: [
          'Construcción de visualizaciones multieje con Plotly.js usando Angular 16, Java, instancias AWS EC2 y AWS S3 para el guardado de datos de sensores, WebSockets y RabbitMQ para un cliente SATCOM (Aeroespacial y Defensa).',
          'Incrusté la aplicación Angular en un proyecto CMDBuild existente construido con el framework JavaScript EXTJS usando componentes web.',
          'Procesamiento y gestión de datos de sensores en buckets AWS S3, facilitando visualización y análisis eficaces.',
        ],
      },
    },
  },
  {
    featured: false,
    content: {
      en: {
        title: 'Full Stack Developer',
        company: 'SONETASOT MEXICO S.A. de C.V.',
        meta: 'August 2021 – July 2022 · Zapopan, Jalisco, México (Onsite)',
        bullets: [
          'Contributed to several Angular applications—such as a notary notices portal, a local newspaper verification system, and the municipal procedures platform for the city of Guadalajara—improving digital access to citizen services as well as a React app to promote cultural events. Delivered RESTful APIs with Laravel (PHP) and Node.js; used PostgreSQL and MongoDB, and managed AWS S3 image storage and WebSocket real-time notifications.',
          'Led frontend development guidelines and mentored the team to close Front End gaps, improving code consistency, maintainability, and overall application quality.',
        ],
      },
      es: {
        title: 'Desarrollador Full Stack',
        company: 'SONETASOT MEXICO S.A. de C. V.',
        meta: 'Agosto 2021 – Julio 2022 · Zapopan, Jalisco, México (En sitio)',
        bullets: [
          'Contribuí a varias aplicaciones de Angular —como un portal notarial, un sistema local de verificación de periódicos y la plataforma de procedimientos municipales para la ciudad de Guadalajara— mejorando el acceso digital a los servicios ciudadanos, así como a una aplicación React para promover eventos culturales y ofrecer APIs RESTful con Laravel (PHP) y Node.js; utilizaba PostgreSQL y MongoDB y gestionaba el almacenamiento de imágenes AWS S3 y notificaciones en tiempo real de WebSocket.',
          'Liderazgo en las directrices de desarrollo frontend y orientó al equipo para cerrar brechas en el frontend, mejorando la coherencia del código, la mantenibilidad y la calidad general de las aplicaciones.',
        ],
      },
    },
  },
  {
    featured: false,
    content: {
      en: {
        title: 'Web Developer',
        company: 'Sharptech',
        meta: 'January 2021 – August 2021 · Tijuana, Baja California, México (Remote)',
        bullets: [
          'Built multiple small to medium websites and web apps using React, Angular, TypeScript, Tailwind CSS, WordPress, and Shopify. Conducted unit and end-to-end testing (Jasmine/Karma, Cypress) and collaborated with UX teams for polished UI/UX.',
          'Led the React law firm project, delivering a responsive production frontend while implementing Stripe payments and Nodemailer email workflows; worked directly with clients to gather requirements.',
          'Contributed to the early development of a React Native application for medical supply management, laying the foundation for core features, architecture, and user workflows.',
        ],
      },
      es: {
        title: 'Desarrollador Web',
        company: 'Sharptech',
        meta: 'Enero 2021 – Agosto 2021 · Tijuana, Baja California, México (Remoto)',
        bullets: [
          'He creado múltiples sitios web y aplicaciones web pequeñas y medianas usando React, Angular, Tailwind CSS, WordPress y Shopify. Realizó pruebas unitarias y de extremo a extremo (Jasmine/Karma, Cypress) y colaboró con equipos de UX para optimizar la UI/UX.',
          'Lideró el proyecto del despacho React, entregando un frontend de producción responsivo mientras implementaba los pagos de Stripe y los flujos de trabajo de correo Nodemailer; trabajé directamente con los clientes para recopilar los requisitos.',
          'Contribuí al desarrollo inicial de una aplicación React Native para la gestión de suministros médicos, sentando las bases para las funcionalidades principales, la arquitectura y los flujos de trabajo de usuario.',
        ],
      },
    },
  },
  {
    featured: false,
    content: {
      en: {
        title: 'Data Visualization Intern',
        company: 'VR Life México',
        meta: 'August 2020 – December 2020 · Zapopan, Jalisco, México (Remote)',
        bullets: [
          'Built custom Power BI visuals with TypeScript, D3.js, and LESS, integrated interactive visuals into dashboards and fixed performance bugs.',
        ],
      },
      es: {
        title: 'Becario de Visualización de Datos',
        company: 'VR Life México',
        meta: 'Agosto 2020 – Diciembre 2020 · Zapopan, Jalisco, México (Remoto)',
        bullets: [
          'Construí objetos visuales personalizados para Power BI con TypeScript, D3.js y LESS, visuales interactivos en los paneles y se corrigieron errores de rendimiento.',
        ],
      },
    },
  },
  {
    featured: false,
    content: {
      en: {
        title: 'Junior Software Engineer',
        company: 'PrimalTechnologies',
        meta: 'July 2020 – December 2020 · Guadalajara, Jalisco, México (Remote)',
        bullets: [
          'Contributed to Tutorel (online tutoring platform) using Vue.js frontend and AdonisJS (Node.js) backend, supported cloud deployment and bug fixes.',
        ],
      },
      es: {
        title: 'Ingeniero de Software Junior',
        company: 'PrimalTechnologies',
        meta: 'Julio 2020 – Diciembre 2020 · Guadalajara, Jalisco, México (Remoto)',
        bullets: [
          'Contribuí a Tutorel (plataforma de tutoría online) usando Vue.js frontend y backend de AdonisJS, soportó despliegue en la nube y corrección de errores.',
        ],
      },
    },
  },
];
