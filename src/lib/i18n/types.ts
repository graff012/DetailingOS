export type SupportedLanguage = 'en' | 'ru' | 'uz';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'uz', label: 'Uzbek', nativeName: "O'zbekcha", flag: '🇺🇿' },
];
