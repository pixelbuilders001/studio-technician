"use client"
import { useLanguage } from '@/context/LanguageContext';
import { get } from 'lodash';

export const useTranslation = () => {
  const { language, translations } = useLanguage();

  const t = (key: string,
    // @ts-ignore
    ...args: any) => {
    const translation = get(translations[language], key) || get(translations['en'], key) || key;
    if (args.length > 0) {
        return translation.replace(/{(\d+)}/g, (match: any, number: any) => {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
        });
    }
    return translation;
  };

  return { t, language };
};
