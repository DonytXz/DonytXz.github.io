import type { Localized } from './portfolio';

interface SkillGroup {
  title: Localized;
  items: { label?: string; text: string | Localized }[];
}
export const skills: SkillGroup[] = [
  {
    title: { en: 'Languages', es: 'Lenguajes' },
    items: [
      { label: 'Core:', text: 'JavaScript (ES6+), TypeScript' },
      { label: 'Markup:', text: 'HTML5, CSS3, LESS' },
      { label: 'Backend:', text: 'C# (.NET), Java, PHP, Python' },
    ],
  },
  {
    title: { en: 'Frontend & Visualization', es: 'Frontend y Visualización' },
    items: [
      {
        label: 'Frameworks:',
        text: 'Angular (18 to legacy AngularJS), React.js, Vue.js',
      },
      { label: 'Data Viz:', text: 'Chart.js, Plotly.js, D3.js, Power BI' },
      { label: 'Reactive:', text: 'RxJS, NgRx, Redux' },
    ],
  },
  {
    title: { en: 'Backend & Cloud', es: 'Backend y Nube' },
    items: [
      { label: 'Runtimes:', text: 'Node.js, Express.js, AdonisJS' },
      { label: 'Frameworks:', text: '.NET, Laravel / Lumen, JSP' },
      {
        label: 'Cloud:',
        text: 'AWS (S3, EC2, Security Hub), Azure (App Service, Static Web Apps, Service Fabric)',
      },
    ],
  },
  {
    title: {
      en: 'Databases & Architecture',
      es: 'Bases de Datos y Arquitectura',
    },
    items: [
      { label: 'Databases:', text: 'PostgreSQL, MongoDB, MySQL, SQL Server' },
      { label: 'Messaging:', text: 'RabbitMQ, WebSockets' },
      {
        label: 'Architecture:',
        text: 'Component Architecture, Microfrontends, REST APIs',
      },
    ],
  },
  {
    title: { en: 'Testing & DevOps', es: 'Pruebas y DevOps' },
    items: [
      {
        label: 'Testing:',
        text: 'Vitest, Playwright, Cypress, Jasmine, Karma',
      },
      {
        label: 'DevOps:',
        text: 'CI/CD Pipelines, Docker, BrowserStack, SonarQube',
      },
    ],
  },
  {
    title: { en: 'Domain Knowledge', es: 'Conocimientos Sectoriales' },
    items: [
      {
        text: {
          en: 'Logistics Technology (LogTech)',
          es: 'Tecnología Logística (LogTech)',
        },
      },
      { text: { en: 'Banking & FinTech', es: 'Sector Bancario y FinTech' } },
      {
        text: {
          en: 'SATCOM (Aerospace & Defense)',
          es: 'SATCOM (Aeroespacial y Defensa)',
        },
      },
      {
        text: {
          en: 'Real Estate & Civic Platforms',
          es: 'Sector Inmobiliario y Trámites Ciudadanos',
        },
      },
    ],
  },
];
