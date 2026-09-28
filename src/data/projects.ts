import type { ImageMetadata } from 'astro';
import tramitesImage from '../assets/projects/tramites-digitales.png';
import tramitesHistoricalImage from '../assets/projects/tramites-digitales-2022.png';
import espaciosImage from '../assets/projects/espacios-escenicos.png';
import pbhImage from '../assets/projects/pbh-abogados.png';
import type { Localized } from './portfolio';

interface ProjectImage {
  src: ImageMetadata;
  alt: Localized;
  caption: Localized;
}

interface Project {
  id: string;
  title: Localized;
  client: string;
  employer: string;
  period: Localized;
  description: Localized;
  technologies: string;
  href: string;
  images: [ProjectImage, ...ProjectImage[]];
}

const currentSiteCaption: Localized = {
  en: 'Current public website · September 2026',
  es: 'Sitio público actual · Septiembre de 2026',
};

// Contribution dates were supplied by the author from his LinkedIn projects.
// Screenshot provenance is recorded in src/assets/projects/README.md.
export const projects: Project[] = [
  {
    id: 'tramites-digitales',
    title: {
      en: 'Trámites Digitales Guadalajara',
      es: 'Trámites Digitales Guadalajara',
    },
    client: 'Gobierno de Guadalajara',
    employer: 'SONETASOT',
    period: { en: 'Mar 2022 – Jun 2022', es: 'Mar 2022 – Jun 2022' },
    description: {
      en: 'Contributed to Guadalajara’s digital services platform, building Angular interfaces, forms, and REST API integrations to help residents explore requirements and manage municipal procedures online.',
      es: 'Contribuí a la plataforma de trámites digitales de Guadalajara, desarrollando interfaces en Angular, formularios e integraciones con APIs REST para consultar requisitos y gestionar trámites municipales en línea.',
    },
    technologies: 'Angular · PHP · Laravel · PostgreSQL · REST APIs · Jest',
    href: 'https://tramitesdigitales.guadalajara.gob.mx/inicio',
    images: [
      {
        src: tramitesImage,
        alt: {
          en: 'Guadalajara digital services homepage with a procedure search and service cards.',
          es: 'Inicio de Trámites Digitales Guadalajara con buscador y tarjetas de trámites.',
        },
        caption: currentSiteCaption,
      },
      {
        src: tramitesHistoricalImage,
        alt: {
          en: 'Original 2022 Trámites Digitales homepage with procedure cards and municipal service categories.',
          es: 'Inicio original de Trámites Digitales de 2022 con tarjetas de trámites y categorías de servicios municipales.',
        },
        caption: {
          en: 'Original 2022 interface · Screenshot from my undergraduate thesis, page 26',
          es: 'Interfaz original de 2022 · Captura de mi tesina, página 26',
        },
      },
    ],
  },
  {
    id: 'espacios-escenicos',
    title: {
      en: 'Espacios Escénicos Jalisco',
      es: 'Espacios Escénicos Jalisco',
    },
    client: 'Secretaría de Cultura de Jalisco',
    employer: 'SONETASOT',
    period: { en: 'Nov 2021 – Feb 2022', es: 'Nov 2021 – Feb 2022' },
    description: {
      en: 'Contributed to a cultural events platform for Jalisco’s Secretaría de Cultura, developing the React frontend and Node.js backend for discovering performances and performing arts venues.',
      es: 'Contribuí a una plataforma de eventos culturales de la Secretaría de Cultura de Jalisco, desarrollando el frontend en React y el backend en Node.js para descubrir espectáculos y espacios escénicos.',
    },
    technologies: 'React · Node.js',
    href: 'https://espaciosescenicos.jalisco.gob.mx/',
    images: [
      {
        src: espaciosImage,
        alt: {
          en: 'Espacios Escénicos event listings with theater and orchestral performance cards.',
          es: 'Cartelera de Espacios Escénicos con tarjetas de obras de teatro y conciertos de orquesta.',
        },
        caption: {
          en: 'Cultural events listing · Screenshot provided by the author',
          es: 'Cartelera cultural · Captura proporcionada por el autor',
        },
      },
    ],
  },
  {
    id: 'pbh-abogados',
    title: { en: 'PBH Abogados', es: 'PBH Abogados' },
    client: 'PBH Abogados',
    employer: 'Sharptech',
    period: { en: 'Jan 2021 – Aug 2021', es: 'Ene 2021 – Ago 2021' },
    description: {
      en: 'Led the React frontend for PBH Abogados’ legal services platform, delivering a responsive experience and integrating Stripe payments and Nodemailer email workflows.',
      es: 'Lideré el desarrollo frontend en React de la plataforma de servicios legales de PBH Abogados, creando una experiencia adaptable e integrando pagos con Stripe y flujos de correo con Nodemailer.',
    },
    technologies: 'React · Stripe · Nodemailer',
    href: 'https://app.pbhabogados.com/',
    images: [
      {
        src: pbhImage,
        alt: {
          en: 'PBH Abogados homepage with legal services introduction, sign-in links, and appointment booking.',
          es: 'Inicio de PBH Abogados con presentación de servicios legales, acceso de usuarios y enlace para agendar una cita.',
        },
        caption: currentSiteCaption,
      },
    ],
  },
];
