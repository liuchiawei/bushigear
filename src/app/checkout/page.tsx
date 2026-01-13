"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";
import content from "@/data/content.json";

export default function CheckoutPage() {
  const { cart } = useCart();
  const locale = useLocale() as Locale;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    address: "",
    paymentMethod: "credit_card",
  });

  const copy = content.checkout;
  const t = <K extends keyof typeof copy>(key: K) =>
    locale === "jp" ? copy[key].jp : getLocalizedText(copy[key], locale);
  const field = copy.fields;
  const fieldLabel = (k: keyof typeof field) =>
    locale === "jp" ? field[k].jp : getLocalizedText(field[k], locale);
  const paymentOption = (k: keyof typeof field.paymentOptions) =>
    locale === "jp"
      ? field.paymentOptions[k].jp
      : getLocalizedText(field.paymentOptions[k], locale);
  const securePaymentTitle =
    locale === "jp"
      ? copy.securePayment.title.jp
      : getLocalizedText(copy.securePayment.title, locale);
  const securePaymentLines = copy.securePayment.lines.map((line) =>
    locale === "jp" ? line.jp : getLocalizedText(line, locale)
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const user = data?.user ?? null;
          if (user) {
            setIsLoggedIn(true);
            setCustomer((prev) => ({
              ...prev,
              lastName: user.lastName ?? "",
              firstName: user.firstName ?? "",
              email: user.email ?? "",
              address: user.address ?? "",
            }));
          }
        }
      } catch {}
    })();
  }, []);

  const handleCustomerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // TODO: Database integration guide for checkout:
  // 1. Add user authentication check
  // 2. Create Order model in Prisma schema:
  //    - id, userId, total, status, createdAt, updatedAt
  //    - OrderItem model: orderId, productId, quantity, price
  // 3. Implement payment processing integration (Stripe, PayPal, etc.)
  // 4. Create server action for order creation
  // 5. Add email confirmation system
  // 6. Implement order tracking functionality

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      alert(copy.errors.cartEmpty[locale === "jp" ? "jp" : locale]);
      return;
    }
    setIsProcessing(true);
    try {
      if (
        !customer.lastName ||
        !customer.firstName ||
        !customer.email ||
        !customer.address
      ) {
        alert(copy.errors.required[locale === "jp" ? "jp" : locale]);
        setIsProcessing(false);
        return;
      }

      // Stripe Checkout Session を作成
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          customer: {
            lastName: customer.lastName,
            firstName: customer.firstName,
            email: customer.email,
            address: customer.address,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            copy.errors.session[locale === "jp" ? "jp" : locale]
        );
      }

      const data = await res.json();
      
      // Stripe Checkout ページにリダイレクト
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(copy.errors.noUrl[locale === "jp" ? "jp" : locale]);
      }
    } catch (e: any) {
      alert(e?.message ?? copy.errors.orderFailed[locale === "jp" ? "jp" : locale]);
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <main className="w-full min-h-screen py-16">
        <div className="w-full max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
          <div className="text-center py-16">
            <p className="text-lg text-gray-500 mb-6">
              {copy.empty.message[locale === "jp" ? "jp" : locale]}
            </p>
            <Link href="/products">
              <Button size="lg">
                {copy.empty.cta[locale === "jp" ? "jp" : locale]}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t("orderSummary")}</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <Image
                    src={item.product.image}
                    alt={item.product.name_jp}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {locale === "jp"
                        ? item.product.name_jp
                        : item.product.name_en || item.product.name_jp}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.product.brand}
                    </p>
                    <p className="text-sm">
                      {copy.quantity[locale === "jp" ? "jp" : locale]}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ¥{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">{t("total")}:</span>
                <span className="text-2xl font-bold text-green-600">
                  ¥{cart.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          {/* Checkout Form */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t("customerInfo")}</h2>
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">
                  💳 {securePaymentTitle}
                </h3>
                <p className="text-sm text-blue-700">
                  {securePaymentLines[0]}
                  <br />
                  {securePaymentLines[1]}
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  <a
                    href="/legal/tokusho"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {getLocalizedText(content.footer.legal.tokusho, locale)}
                  </a>
                  <br />
                  {securePaymentLines[2]}
                </p>
              </div>
              {/* editable form fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {fieldLabel("lastName")} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full p-3 border rounded-md"
                      placeholder="山田"
                      value={customer.lastName}
                      onChange={handleCustomerChange}
                      // disabled={isLoggedIn}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {fieldLabel("firstName")} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full p-3 border rounded-md"
                      placeholder="太郎"
                      value={customer.firstName}
                      onChange={handleCustomerChange}
                      // disabled={isLoggedIn}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {fieldLabel("email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 border rounded-md"
                    placeholder="example@email.com"
                    value={customer.email}
                    onChange={handleCustomerChange}
                    disabled={isLoggedIn}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {fieldLabel("address")} *
                  </label>
                  <textarea
                    name="address"
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    placeholder="〒123-4567\n東京都渋谷区..."
                    value={customer.address}
                    onChange={handleCustomerChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {fieldLabel("paymentMethod")} *
                  </label>
                  <select
                    title="paymentMethod"
                    name="paymentMethod"
                    className="w-full p-3 border rounded-md"
                    value={customer.paymentMethod}
                    onChange={handleCustomerChange}
                  >
                    <option value="credit_card">
                      {paymentOption("credit_card")}
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-4 pt-6">
                <Link href="/cart" className="flex-1">
                  <Button variant="outline" className="w-full" size="lg">
                    {t("backToCart")}
                  </Button>
                </Link>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? t("processing") : t("placeOrder")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
