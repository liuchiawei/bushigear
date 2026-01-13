"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import messages from "@/data/messages";
import {
  defaultLocale,
  isLocale,
  languageFromNavigator,
  Locale,
} from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => undefined,
});

export default function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("locale") : null;
    if (isLocale(stored)) {
      setLocaleState(stored);
      return;
    }
    setLocaleState(languageFromNavigator());
  }, []);

  const handleLocaleChange = (nextLocale: Locale) => {
    if (!nextLocale) return;
    window.localStorage.setItem("locale", nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    setLocaleState(nextLocale);
  };

  const messageBundle: AbstractIntlMessages = useMemo(
    () => messages[locale] ?? messages[defaultLocale],
    [locale]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      const lang =
        locale === "zh_tw"
          ? "zh-TW"
          : locale === "zh_cn"
            ? "zh-CN"
            : locale === "en"
              ? "en-US"
              : "ja-JP";
      document.documentElement.lang = lang;
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleLocaleChange }}>
      <NextIntlClientProvider locale={locale} messages={messageBundle}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export const useLocaleContext = () => useContext(LocaleContext);
