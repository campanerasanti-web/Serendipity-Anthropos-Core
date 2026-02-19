
// Tipos de idioma y rol
export type Language = 'es' | 'en' | 'vi';
export type UserRole = 'admin' | 'user' | 'guest';

// Traducciones mínimas para evitar errores de import
export interface Translations {
	[key: string]: string | Translations;
}

export const translations: Record<Language, Translations> = {
	es: { saludo: 'Hola' },
	en: { saludo: 'Hello' },
	vi: { saludo: 'Xin chào' },
};

export const roleToLanguage: Record<UserRole, Language> = {
	admin: 'es',
	user: 'en',
	guest: 'vi',
};
