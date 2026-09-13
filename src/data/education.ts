import type { Localized } from './portfolio';

export const education: {
  title: Localized;
  school: string;
  meta: Localized;
}[] = [
  {
    title: {
      en: 'Bachelor of Science in Software Engineering and Management',
      es: 'Ingeniería en TI, Desarrollo y Gestión de Software',
    },
    school: 'Universidad Tecnológica de Jalisco (UTJ) · Guadalajara, Jalisco',
    meta: {
      en: 'August 2018 – September 2022 · GPA: 3.71 / 4.0 (Prom 9.1 / 10)',
      es: 'Agosto 2018 – Septiembre 2022 · Promedio: 9.1 / 10 (GPA 3.71 / 4.0)',
    },
  },
  {
    title: {
      en: 'Associate of Applied Science in IT, Multiplatform Software Development',
      es: 'TSU en TI, Desarrollo de Software Multiplataforma',
    },
    school: 'Universidad Tecnológica de Jalisco (UTJ) · Guadalajara, Jalisco',
    meta: {
      en: 'August 2018 – December 2020 · GPA: 3.71 / 4.0 (Prom 9.1 / 10)',
      es: 'Agosto 2018 – Diciembre 2020 · Promedio: 9.1 / 10 (GPA 3.71 / 4.0)',
    },
  },
];

export const certifications: { title: string; detail?: string | Localized }[] =
  [
    {
      title: 'AWS Certified AI Practitioner (AIF-C01)',
      detail: {
        en: 'AWS Partner Preparation course',
        es: 'Curso de preparación por un socio AWS',
      },
    },
    {
      title: 'Azure Administrator Associate',
      detail: {
        en: 'Certificate of Achievement by Microsoft Partner',
        es: 'Certificado de logro por un socio de Microsoft',
      },
    },
    {
      title: 'React - The Complete Guide 2025 (incl. Next.js, Redux)',
      detail: 'Udemy',
    },
    {
      title: 'JavaScript (Basic) Certificate',
      detail: 'HackerRank / LinkedIn',
    },
    { title: 'Warrior Certificate & Learning Achievement Award' },
  ];

export const spokenLanguages: {
  country: 'MX' | 'US' | 'FR';
  label: Localized;
  level?: string;
  description: Localized;
}[] = [
  {
    country: 'MX',
    label: { en: 'Spanish (MX):', es: 'Español (MX):' },
    description: { en: 'Native', es: 'Nativo' },
  },
  {
    country: 'US',
    label: { en: 'English (US):', es: 'Inglés (EE.UU.):' },
    level: 'B2',
    description: {
      en: 'Upper Intermediate / Professional Working',
      es: 'Nivel Intermedio Superior',
    },
  },
  {
    country: 'FR',
    label: { en: 'French:', es: 'Francés:' },
    level: 'A2',
    description: { en: 'Elementary', es: 'Elemental' },
  },
];
