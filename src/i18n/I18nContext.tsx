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

  // Función para establecer rol (cambia idioma automáticamente)
  const setUserRole = (role: UserRole) => {
    setCurrentRoleState(role);
    const autoLanguage = roleToLanguage[role];
    setLanguageState(autoLanguage);
    console.log(`👤 Rol establecido: ${role} → Idioma: ${autoLanguage}`);
  };

  // Obtener traducciones del idioma actual
  const t = translations[language];

  const value: I18nContextType = {
    language,
    currentLanguage: language, // Alias para compatibilidad
    t,
    setLanguage,
    setUserRole,
    currentRole,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/**
 * Hook para usar traducciones en componentes
 * 
 * @example
 * const { t, language, setLanguage } = useI18n();
 * return <h1>{t.dashboard.title}</h1>;
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error(
      'useI18n debe usarse dentro de I18nProvider. ' +
      'Asegúrate de que tu componente está envuelto correctamente con <I18nProvider>.'
    );
  }

  return context;
};

/**
 * Selector de idioma visual
 */
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const languages: Array<{ code: Language; label: string; flag: string }> = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={`language-btn ${language === lang.code ? 'active' : ''}`}
          onClick={() => setLanguage(lang.code)}
          title={lang.label}
        >
          <span className="flag">{lang.flag}</span>
          <span className="label">{lang.label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * Selector de rol (Admin/Worker/Manager/Internal)
 */
export const RoleSelector: React.FC = () => {
  const { currentRole, setUserRole } = useI18n();

  const roles: Array<{ code: UserRole; label: string; icon: string }> = [
    { code: 'admin', label: 'Admin (ES)', icon: '👔' },
    { code: 'manager', label: 'Manager (ES)', icon: '👨‍💼' },
    { code: 'worker', label: 'Worker (VI)', icon: '👷' },
    { code: 'internal', label: 'Internal (EN)', icon: '🤖' },
  ];

  return (
    <div className="role-selector">
      <label>Rol del Usuario:</label>
      {roles.map((role) => (
        <button
          key={role.code}
          className={`role-btn ${currentRole === role.code ? 'active' : ''}`}
          onClick={() => setUserRole(role.code)}
          title={role.label}
        >
          <span className="icon">{role.icon}</span>
          <span className="label">{role.label}</span>
        </button>
      ))}
    </div>
  );
};
