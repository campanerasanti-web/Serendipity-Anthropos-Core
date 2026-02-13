import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es.json";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

// Detectar idioma guardado o definir prioridad por defecto
// Sugerencia: Si es la planta, "vi" es el estándar de supervivencia.
const savedLang = localStorage.getItem("lang");
const defaultLang = savedLang || "vi"; 

i18n.use(initReactI18next).init({
  resources: { 
    es: { translation: es }, 
    en: { translation: en }, 
    vi: { translation: vi } 
  },
  lng: defaultLang,
  fallbackLng: "en", // El inglés actúa como el puente global si falta una traducción
  interpolation: { 
    escapeValue: false 
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  }
});

export default i18n;