export const locales = ["jp", "en", "zh_tw", "zh_cn"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "jp";

export function isLocale(value: string | null | undefined): value is Locale {
  return value !== undefined && value !== null && (locales as readonly string[]).includes(value);
}

export function getLocalizedText(
  translation: Partial<Record<Locale, string>>,
  locale: Locale
): string {
  const zhFallback =
    locale === "zh_tw"
      ? translation.zh_cn
      : locale === "zh_cn"
        ? translation.zh_tw
        : undefined;

  return (
    translation?.[locale] ??
    zhFallback ??
    translation?.[defaultLocale] ??
    translation?.en ??
    translation?.zh_tw ??
    translation?.zh_cn ??
    translation?.jp ??
    ""
  );
}

export const languageLabels: Record<Locale, string> = {
  jp: "日本語",
  en: "English",
  zh_tw: "繁體中文",
  zh_cn: "简体中文",
};

// Minimal traditional-to-simplified mapper for product copy
const zhMap: Record<string, string> = {
  // common commerce/gear terms
  "纖": "纤",
  "鬥": "斗",
  "戰": "战",
  "護": "护",
  "裝": "装",
  "劍": "剑",
  "織": "织",
  "繩": "绳",
  "帶": "带",
  "頭": "头",
  "體": "体",
  "龍": "龙",
  "鱗": "鳞",
  "氣": "气",
  "墊": "垫",
  "腳": "脚",
  "襪": "袜",
  "褲": "裤",
  "訓": "训",
  "練": "练",
  "優": "优",
  "質": "质",
  "經": "经",
  "歷": "历",
  "專": "专",
  "業": "业",
  "級": "级",
  "鋼": "钢",
  "盤": "盘",
  "靴": "靴",
  "馬": "马",
  "務": "务",
  "網": "网",
  "關": "关",
  "閉": "闭",
  "訊": "讯",
  "換": "换",
  "導": "导",
  "係": "系",
  "聯": "联",
  "賽": "赛",
  "續": "续",
  "動": "动",
  "態": "态",
};

export function toSimplified(text?: string): string {
  if (!text) return text ?? "";
  let result = "";
  for (const ch of text) {
    result += zhMap[ch] ?? ch;
  }
  return result;
}

export const languageFromNavigator = (): Locale => {
  const navLang =
    typeof navigator !== "undefined"
      ? navigator.language.toLowerCase()
      : "";

  if (navLang.startsWith("ja") || navLang === "jp") return "jp";
  if (navLang.startsWith("en")) return "en";
  if (navLang.startsWith("zh")) {
    if (navLang.includes("hant") || navLang.includes("tw") || navLang.includes("hk") || navLang.includes("mo")) {
      return "zh_tw";
    }
    return "zh_cn";
  }
  if (navLang.startsWith("cn")) return "zh_cn";
  return defaultLocale;
};

// 簡單な翻訳オブジェクトの型定義
export type SimpleTranslation = Partial<Record<Locale, string>>;

// ネストされた翻訳オブジェクトかどうかをチェックする型ガード
export function isSimpleTranslation(
  value: any
): value is SimpleTranslation {
  return (
    typeof value === "object" &&
    value !== null &&
    !("message" in value) &&
    !("cta" in value) &&
    !("title" in value && "lines" in value) &&
    !Array.isArray(value)
  );
}

// 安全に翻訳を取得するヘルパー関数
export function getTranslation(
  translation: SimpleTranslation,
  locale: Locale
): string {
  return locale === "jp" && translation.jp
    ? translation.jp
    : getLocalizedText(translation, locale);
}

// 翻訳オブジェクトから特定のキーの翻訳を取得するヘルパー関数
// ネストされた構造（empty, securePayment など）を除外する
export function createTranslationGetter<T extends Record<string, any>>(
  translations: T,
  locale: Locale
) {
  return <K extends keyof T>(key: K): string => {
    const value = translations[key];
    if (isSimpleTranslation(value)) {
      return getTranslation(value, locale);
    }
    // ネストされた構造の場合は空文字列を返す（直接アクセスが必要）
    return "";
  };
}
