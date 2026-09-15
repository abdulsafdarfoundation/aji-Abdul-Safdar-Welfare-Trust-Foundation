/**
 * Single source of truth for org-level settings.
 * Haji Abdul Safdar Welfare Trust & Foundation (France)
 */
export const SITE = {
  name: "Haji Abdul Safdar Welfare Trust & Foundation",
  shortName: "Haji Abdul Safdar Foundation",
  tagline: {
    en: "Hunger has no religion — Let us unite to serve humanity",
    fr: "La faim n'a pas de religion — Unissons-nous pour servir l'humanité",
  },
  motto: {
    en: "By the Grace of God, Our Purpose is Serving Humanity",
    fr: "Par la Grâce de Dieu, Notre Objectif est de Servir l'Humanité",
  },
  description: {
    en: "Providing clean solar drinking water in Tharparkar Sindh, monthly ration packages, community meal distribution, orphan girl marriage support, mosque/madrasa construction, and orphan education.",
    fr: "Fourniture d'eau potable solaire à Tharparkar Sindh, colis alimentaires mensuels, distribution de repas, soutien au mariage d'orphelines, construction de mosquées et éducation d'orphelins.",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL
    ? (process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`)
    : "http://localhost:3000",
  email: "contact@hasffoundation.com",

  contacts: {
    france: {
      name: "Mr. Haji Abdul Safdar",
      phone: "+33646817178",
      displayPhone: "+33 6 46 81 71 78",
      whatsapp: "https://wa.me/33646817178",
      country: "France",
    },
    pakistan: {
      name: "Hafiz Faiz Ahmed (Fiaz Ahmad)",
      phone: "+923336048001",
      displayPhone: "+92 333 6048001",
      whatsapp: "https://wa.me/923336048001",
      country: "Pakistan",
    },
    usa: {
      name: "Asad",
      phone: "+15516890350",
      displayPhone: "+1 (551) 689-0350",
      zelle: "+15516890350",
      country: "USA",
    },
  },

  bankDetails: {
    france: {
      country: "France / Europe",
      flag: "🇫🇷",
      bankName: "LCL Bank",
      accountTitle: "MR SAFDAR ABDUL",
      iban: "FR98 3000 2076 5500 0003 9502 L41",
      bic: "CRLYFRPP",
    },
    pakistan: {
      country: "Pakistan",
      flag: "🇵🇰",
      bankName: "Meezan Bank",
      accountTitle: "Fiaz Ahmad",
      iban: "PKMEZN0076020106855687",
    },
    usa: {
      country: "United States (Zelle)",
      flag: "🇺🇸",
      method: "Zelle Transfer",
      accountTitle: "ASAD",
      zelleId: "+1 (551) 689-0350",
    },
  },

  currency: "EUR",
  currencySymbol: "€",
  locale: "en-FR",
} as const;

export interface CausePackage {
  id: string;
  titleEn: string;
  titleFr: string;
  priceEuro: number;
  pricePkr: number;
  descriptionEn: string;
  descriptionFr: string;
  image: string;
  categoryEn: string;
  categoryFr: string;
  popular?: boolean;
}

export const CAUSE_PACKAGES: CausePackage[] = [
  {
    id: "solar-water",
    titleEn: "Solar Drinking Water Pump",
    titleFr: "Pompe à Eau Potable Solaire",
    priceEuro: 460,
    pricePkr: 140000,
    descriptionEn: "Clean, sustainable solar-powered drinking water pumps for thirsty desert villages in Tharparkar (Sindh).",
    descriptionFr: "Pompes à eau potables solaires durables pour les villages assoiffés du désert de Tharparkar (Sindh).",
    image: "/ads/Appeals/Solar Water Project .jpeg",
    categoryEn: "Clean Water",
    categoryFr: "Eau Potable",
    popular: true,
  },
  {
    id: "monthly-ration",
    titleEn: "Monthly Household Ration Package",
    titleFr: "Colis Alimentaire Mensuel",
    priceEuro: 30,
    pricePkr: 9000,
    descriptionEn: "Provides 1 month of essential grocery staples (flour, rice, oil, lentils, sugar, tea) to a needy family.",
    descriptionFr: "Fournit 1 mois de denrées alimentaires essentielles (farine, riz, huile, lentilles, sucre, thé) à une famille dans le besoin.",
    image: "/ads/Appeals/Monthly Rashan.jpeg",
    categoryEn: "Food Security",
    categoryFr: "Sécurité Alimentaire",
    popular: true,
  },
  {
    id: "orphan-marriage",
    titleEn: "Marriage of Orphan & Needy Girls",
    titleFr: "Mariage de Jeunes Filles Orphelines",
    priceEuro: 615,
    pricePkr: 185000,
    descriptionEn: "Financial support, basic household essentials, marriage reception support, and dignity for orphan brides.",
    descriptionFr: "Soutien financier, équipements ménagers essentiels et dignité pour les mariées orphelines et démunies.",
    image: "/ads/Appeals/Orphan Girls Marriage Reception.jpeg",
    categoryEn: "Social Welfare",
    categoryFr: "Action Sociale",
    popular: true,
  },
  {
    id: "community-meal",
    titleEn: "Monthly Langar (Community Meals)",
    titleFr: "Langar Mensuel (Repas Communautaires)",
    priceEuro: 185,
    pricePkr: 56000,
    descriptionEn: "Serves hundreds of daily workers, orphans, and poor individuals with hot, wholesome cooked meals.",
    descriptionFr: "Offre des repas chauds et nutritifs à des centaines de travailleurs quotidiens, orphelins et personnes démunies.",
    image: "/ads/Appeals/Monthly Langar.jpeg",
    categoryEn: "Food Security",
    categoryFr: "Sécurité Alimentaire",
  },
  {
    id: "mosque-construction",
    titleEn: "Mosque & School Construction",
    titleFr: "Construction de Mosquée et École",
    priceEuro: 500,
    pricePkr: 150000,
    descriptionEn: "Building brick structures for rural mosques and school facilities in underdeveloped villages.",
    descriptionFr: "Construction d'édifices en briques pour les mosquées rurales et écoles dans les villages reculés.",
    image: "/ads/Appeals/mosque and school.jpeg",
    categoryEn: "Religious & Education",
    categoryFr: "Éducation & Édifices",
  },
  {
    id: "orphan-education",
    titleEn: "Religious & School Education",
    titleFr: "Éducation Religieuse et Scolaire",
    priceEuro: 304,
    pricePkr: 92000,
    descriptionEn: "Full educational sponsorship covering Islamic religious education, school books, uniform, and tuition for orphan children.",
    descriptionFr: "Parrainage éducatif complet couvrant l'éducation religieuse, livres, uniformes et scolarité pour enfants orphelins.",
    image: "/ads/Appeals/Religious Education.jpeg",
    categoryEn: "Education",
    categoryFr: "Éducation",
  },
];

export const GALLERY_IMAGES = [
  { src: "/ads/Appeals/Monthly Rashan.jpeg", titleEn: "Monthly Rashan Distribution", titleFr: "Distribution de Rashan Mensuel", categoryEn: "Ration", categoryFr: "Ration" },
  { src: "/ads/Appeals/mosque and school.jpeg", titleEn: "Mosque & School Construction", titleFr: "Construction de Mosquée et École", categoryEn: "Mosque", categoryFr: "Mosquée" },
  { src: "/ads/Appeals/Monthly Langar.jpeg", titleEn: "Monthly Langar (Community Meals)", titleFr: "Langar Mensuel (Repas Communautaires)", categoryEn: "Meal", categoryFr: "Repas" },
  { src: "/ads/Appeals/Solar Water Project .jpeg", titleEn: "Solar Drinking Water Project", titleFr: "Projet de Pompe Solaire à Eau", categoryEn: "Water", categoryFr: "Eau" },
  { src: "/ads/Appeals/Orphan Girls Marriage Reception.jpeg", titleEn: "Orphan Girls Marriage Support", titleFr: "Soutien au Mariage d'Orphelines", categoryEn: "Welfare", categoryFr: "Aide Sociale" },
  { src: "/ads/Appeals/Religious Education.jpeg", titleEn: "Religious & School Education", titleFr: "Éducation Religieuse et Scolaire", categoryEn: "Education", categoryFr: "Éducation" },
];

export const CAMPAIGN_CATEGORIES = [
  "Clean Water",
  "Food Security",
  "Social Welfare",
  "Religious & Education",
  "Education",
  "General Relief",
] as const;

export const DONATION_PRESETS = [30, 185, 304, 460, 500, 615] as const;
export const MIN_DONATION = 5;
export const MAX_DONATION = 100000;

