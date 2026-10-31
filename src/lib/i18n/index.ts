import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageOption } from './types';
import { translations } from './translations';

export * from './types';
export * from './translations';

export function getTranslations(lang: SupportedLanguage = 'en') {
  return translations[lang] || translations.en;
}
