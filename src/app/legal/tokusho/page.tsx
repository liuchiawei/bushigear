 "use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { getLocalizedText, toSimplified, type Locale } from "@/lib/i18n";

const sections = {
  title: {
    jp: "特定商取引法に基づく表記",
    en: "Legal Notice",
    zh_tw: "特定商取引法相關標示",
    zh_cn: "特定商取引法相关标示",
  },
  updated: {
    jp: "最終更新日: 2025年1月",
    en: "Last updated: Jan 2025",
    zh_tw: "最後更新：2025年1月",
    zh_cn: "最后更新：2025年1月",
  },
  blocks: [
    {
      heading: {
        jp: "販売業者名",
        en: "Seller",
        zh_tw: "販售業者名稱",
        zh_cn: "销售业者名称",
      },
      body: {
        jp: "ブシギア（BUSHIGEAR）",
        en: "BushiGear (BUSHIGEAR)",
        zh_tw: "武士Gear（BUSHIGEAR）",
        zh_cn: "武士Gear（BUSHIGEAR）",
      },
    },
    {
      heading: {
        jp: "運営責任者名",
        en: "Responsible person",
        zh_tw: "營運負責人",
        zh_cn: "营运负责人",
      },
      body: {
        jp: "代表責任者",
        en: "Representative in charge",
        zh_tw: "代表責任人",
        zh_cn: "代表责任人",
      },
    },
    {
      heading: {
        jp: "所在地",
        en: "Address",
        zh_tw: "所在地",
        zh_cn: "所在地",
      },
      body: {
        jp: "〒160-0023 東京都新宿区西新宿1-7-3",
        en: "1-7-3 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023 Japan",
        zh_tw: "〒160-0023 東京都新宿區西新宿1-7-3",
        zh_cn: "〒160-0023 东京都新宿区西新宿1-7-3",
      },
    },
    {
      heading: {
        jp: "連絡先",
        en: "Contact",
        zh_tw: "聯絡方式",
        zh_cn: "联系方式",
      },
      body: {
        jp: "電話: 070-777-8888（9:00-18:00 月〜金、土日祝休）\nメール: info@bushi-gear.com",
        en: "Phone: 070-777-8888 (9:00-18:00 Mon–Fri, closed weekends/holidays)\nEmail: info@bushi-gear.com",
        zh_tw: "電話：070-777-8888（9:00-18:00 週一至週五，週末及假日休息）\nEmail：info@bushi-gear.com",
        zh_cn: "电话：070-777-8888（9:00-18:00 周一至周五，周末及节假日休息）\nEmail：info@bushi-gear.com",
      },
    },
    {
      heading: {
        jp: "販売価格",
        en: "Price",
        zh_tw: "販售價格",
        zh_cn: "销售价格",
      },
      body: {
        jp: "各商品ページに記載の価格（消費税込み）",
        en: "As listed on each product page (tax included)",
        zh_tw: "以各商品頁標示為準（含稅）",
        zh_cn: "以各商品页标示为准（含税）",
      },
    },
    {
      heading: {
        jp: "商品代金以外の必要料金",
        en: "Additional fees",
        zh_tw: "商品代金以外的費用",
        zh_cn: "商品代价以外的费用",
      },
      body: {
        jp: "送料: 全国一律500円（5,000円以上で送料無料）\n手数料: クレジットカード決済手数料はお客様負担\n消費税: 商品価格に含む",
        en: "Shipping: 500 JPY flat (free over 5,000 JPY)\nFees: Card processing fee borne by customer\nTax: Included in price",
        zh_tw: "運費：全國一律500日圓（滿5,000日圓免運）\n手續費：信用卡手續費由顧客負擔\n消費稅：已含於商品價格",
        zh_cn: "运费：全国统一500日元（满5,000日元免运）\n手续费：信用卡手续费由顾客承担\n消费税：已含在商品价格内",
      },
    },
    {
      heading: {
        jp: "支払方法および支払時期",
        en: "Payment method & timing",
        zh_tw: "付款方式與時間",
        zh_cn: "付款方式与时间",
      },
      body: {
        jp: "クレジットカード決済（Visa、MasterCard、American Express、JCB）。ご注文時にお支払い確定。",
        en: "Credit cards (Visa, MasterCard, American Express, JCB). Charged at order time.",
        zh_tw: "信用卡（Visa、MasterCard、American Express、JCB）。下單時即完成扣款。",
        zh_cn: "信用卡（Visa、MasterCard、American Express、JCB）。下单时即完成扣款。",
      },
    },
    {
      heading: {
        jp: "商品の引渡時期",
        en: "Shipping time",
        zh_tw: "出貨時間",
        zh_cn: "出货时间",
      },
      body: {
        jp: "ご注文確認後、3営業日以内に発送（在庫状況により遅延時は事前連絡）。",
        en: "Ships within 3 business days after order confirmation (we will inform you if delays occur).",
        zh_tw: "訂單確認後 3 個工作日內出貨（若因庫存延遲，會事先通知）。",
        zh_cn: "订单确认后 3 个工作日内发货（若因库存延迟，将事先通知）。",
      },
    },
    {
      heading: {
        jp: "返品・キャンセルについて",
        en: "Returns & cancellations",
        zh_tw: "退換貨與取消",
        zh_cn: "退换货与取消",
      },
      body: {
        jp: "商品到着後7日以内、未使用・未開封に限り返品交換可。お客様都合の返品送料はお客様負担。不良・誤配送は当社負担。発送前ならキャンセル可。返金は確認後7営業日以内に指定口座へ。",
        en: "Within 7 days of delivery, unused/unopened items can be returned/exchanged. Return shipping for customer convenience is borne by customer; defects/misshipments are covered by us. Cancellations possible before shipment. Refunds issued within 7 business days after confirmation.",
        zh_tw: "收貨後 7 日內，未使用且未開封可退換。顧客因素退貨運費由顧客負擔；瑕疵或寄錯由本公司負擔。出貨前可取消。退款將於確認後 7 個工作日內匯入指定帳戶。",
        zh_cn: "收货后 7 日内，未使用且未开封可退换。因顾客原因退货运费由顾客承担；瑕疵或寄错由本公司承担。发货前可取消。退款将在确认后 7 个工作日内汇入指定账户。",
      },
    },
    {
      heading: {
        jp: "その他",
        en: "Others",
        zh_tw: "其他",
        zh_cn: "其他",
      },
      body: {
        jp: "本サイトは Stripe の安全な決済システムを利用し、カード情報は保存しません。不明点はお問い合わせください。",
        en: "We use Stripe for secure payments and do not store card data. Contact us if you have questions.",
        zh_tw: "本網站使用 Stripe 安全付款，不會儲存卡片資料。如有疑問請聯繫我們。",
        zh_cn: "本网站使用 Stripe 安全付款，不会保存卡片信息。如有疑问请联系我们。",
      },
    },
  ],
};

// 特定商取引法に基づく表記ページ
export default function TokushoPage() {
  const locale = useLocale() as Locale;
  const title = useMemo(
    () => getLocalizedText(sections.title as any, locale),
    [locale]
  );
  const updated = useMemo(
    () =>
      locale === "zh_cn"
        ? toSimplified(sections.updated.zh_tw)
        : getLocalizedText(sections.updated as any, locale),
    [locale]
  );

  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{title}</h1>

        <div className="bg-white border rounded-lg p-6 space-y-6">
          {sections.blocks.map((block, idx) => (
            <section key={idx}>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
                {getLocalizedText(block.heading as any, locale)}
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {locale === "zh_cn"
                  ? toSimplified(block.body.zh_tw)
                  : getLocalizedText(block.body as any, locale)}
              </p>
            </section>
          ))}

          <div className="pt-6 border-t mt-6">
            <p className="text-sm text-gray-500 text-center">{updated}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
