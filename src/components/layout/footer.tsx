"use client";

import SNS from "../common/sns";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";
import content from "@/data/content.json";

export default function Footer() {
  const locale = useLocale() as Locale;

  const headings = content.footer.headings;
  const categories = content.footer.categories;
  const menu = content.footer.menu;
  const contact = content.footer.contact;
  const legal = content.footer.legal;

  const headingCategory =
    locale === "jp" ? headings.category.jp : getLocalizedText(headings.category, locale);
  const headingMenu =
    locale === "jp" ? headings.menu.jp : getLocalizedText(headings.menu, locale);
  const headingContact =
    locale === "jp" ? headings.contact.jp : getLocalizedText(headings.contact, locale);

  return (
    <footer className="flex flex-col gap-2 w-full h-full bg-black">
      <div className="w-full max-w-7xl h-full mx-auto p-6 flex justify-between text-gray-300">
        <Link href="/" className="w-full">
          <Image src="/logo/logo_dark.svg" alt="logo" width={450} height={300} />
        </Link>
        <div className="w-full flex flex-col md:flex-row justify-between gap-1">
          <div className="hidden md:block border-l-1 border-gray-800 pb-4 pl-4">
            <h1 className="text-xl font-bold mb-5 text-white">{headingCategory}</h1>
            {/* TODO: <Link> を使用して、各リンク先を設定 */}
            <ul className="text-sm">
              {categories.map((cat) => (
                <li key={cat.id} className="tracking-wide mb-3">
                  <a href="#">
                    {locale === "jp"
                      ? cat.name.jp
                      : getLocalizedText(cat.name, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block border-l-1 border-gray-800 pb-4 pl-4">
            <h1 className="text-xl font-bold mb-5 text-white">{headingMenu}</h1>
            <ul className="text-sm">
              {menu.map((item) => (
                <li key={item.id} className="tracking-wide mb-3">
                  <a href={item.href}>
                    {locale === "jp"
                      ? item.label.jp
                      : getLocalizedText(item.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l-1 border-gray-800 pb-4 pl-4">
            <h1 className="text-xl font-bold mb-5 text-white">{headingContact}</h1>
            <ul className="text-sm">
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">
                  {locale === "jp"
                    ? contact.addressLabel.jp
                    : getLocalizedText(contact.addressLabel, locale)}
                </h2>
                <p>
                  {locale === "jp"
                    ? contact.address.jp
                    : getLocalizedText(contact.address, locale)}
                </p>
              </li>
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">
                  {locale === "jp"
                    ? contact.phoneLabel.jp
                    : getLocalizedText(contact.phoneLabel, locale)}
                </h2>
                <p>{contact.phone}</p>
              </li>
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">
                  {locale === "jp"
                    ? contact.emailLabel.jp
                    : getLocalizedText(contact.emailLabel, locale)}
                </h2>
                <p>{contact.email}</p>
              </li>
              <li className="tracking-wide mb-3">
                <h2 className="font-bold">
                  {locale === "jp"
                    ? contact.businessHoursLabel.jp
                    : getLocalizedText(contact.businessHoursLabel, locale)}
                </h2>
                {(locale === "jp"
                  ? contact.businessHours.jp
                  : contact.businessHours[locale] ?? contact.businessHours.jp
                ).map((line: string, idx: number) => (
                  <p key={idx}>{line}</p>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl h-full mx-auto">
        <SNS className="text-white" />
      </div>
      <div className="w-full mx-auto mb-6">
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <Link href="/legal/tokusho" className="text-gray-300 hover:text-white underline">
            {getLocalizedText(legal.tokusho, locale)}
          </Link>
        </div>
        <h4 className="text-center font-bold text-white">{content.footer.brand}</h4>
        <h6 className="text-center text-xs text-white">{content.footer.copyright}</h6>
      </div>
    </footer>
  );
}
