/**
 * CONTEXTO I18N - Proveedor de Traducción
 * Gestiona el idioma según el rol del usuario
 * 
 * "Cada palabra pronunciada en el idioma del corazón"
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, UserRole, roleToLanguage, translations, Translations } from './translations';

interface I18nContextType {
  language: Language;
  currentLanguage: Language; // Alias para compatibilidad
  t: Translations;
  setLanguage: (lang: Language) => void;
  setUserRole: (role: UserRole) => void;
  currentRole: UserRole | null;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  defaultRole?: UserRole;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage = 'es',
  defaultRole = 'admin',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Intentar recuperar idioma guardado
    const saved = localStorage.getItem('serendipity-language');
    return (saved as Language) || defaultLanguage;
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole | null>(() => {
    // Intentar recuperar rol guardado
    const saved = localStorage.getItem('serendipity-role');
    return (saved as UserRole) || defaultRole;
  });

  // Persistir idioma en localStorage
  useEffect(() => {
    localStorage.setItem('serendipity-language', language);
  }, [language]);

  // Persistir rol en localStorage
  useEffect(() => {
    if (currentRole) {
      localStorage.setItem('serendipity-role', currentRole);
    }
  }, [currentRole]);

  // Función para cambiar idioma manualmente
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    console.log(`🌐 Idioma cambiado a: ${lang}`);
  };

  // Función para cambiar rol manualmente
  const setUserRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setLanguageState(roleToLanguage[role]);
    console.log(`🧑‍💼 Rol cambiado a: ${role}`);
  };

  const value: I18nContextType = {
    language,
    currentLanguage: language,
    t: translations[language],
    setLanguage,
    setUserRole,
    currentRole,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n debe usarse dentro de un I18nProvider');
  }
  return context;
};
