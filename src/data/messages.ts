import content from "@/data/content.json";
import { defaultLocale, Locale, locales } from "@/lib/i18n";

type TooltipKey = keyof typeof content.nav.tooltips;

const getTooltip = (key: TooltipKey, locale: Locale) => {
  const tooltip = content.nav.tooltips[key];
  return tooltip?.[locale] ?? tooltip?.[defaultLocale] ?? "";
};

const messages: Record<Locale, any> = locales.reduce(
  (acc, locale) => ({
    ...acc,
    [locale]: {
      nav: {
        tooltips: {
          login: getTooltip("login", locale),
          favorites: getTooltip("favorites", locale),
          language: getTooltip("language", locale),
        },
      },
    },
  }),
  {} as Record<Locale, any>
);

export default messages;
