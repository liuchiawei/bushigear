"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { PREFECTURES } from "@/constants/prefectures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "next-intl";
import { getLocalizedText, type Locale } from "@/lib/i18n";
import content from "@/data/content.json";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    gender: "",
    postalCode: "",
    prefecture: "",
    city: "",
    street: "",
    building: "",
    room: "",
    birthday: "",
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const copy = content.auth.register;
  const t = <K extends keyof typeof copy>(key: K) =>
    locale === "jp" ? (copy[key] as any).jp : getLocalizedText(copy[key] as any, locale);
  const genderOptions = copy.genderOptions;
  const genderLabel = (key: keyof typeof genderOptions) =>
    locale === "jp"
      ? genderOptions[key].jp
      : getLocalizedText(genderOptions[key], locale);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toHalfWidthDigits = (s: string) =>
    s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));

  const normalizePostal = (raw: string) => {
    const half = toHalfWidthDigits(raw).replace(/[^0-9]/g, "");
    return half;
  };

  const sanitize = (v: string) => {
    const t = v.trim();
    return t === "" ? null : t;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t("imageFileError"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(t("fileSizeError"));
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("uploadFailed"));
      }

      const data = await res.json();
      setAvatarUrl(data.url);
    } catch (err: any) {
      setError(err.message || t("uploadFailed"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.lastName.trim()) {
      setError(t("lastNameRequired"));
      return;
    }
    if (!form.firstName.trim()) {
      setError(t("firstNameRequired"));
      return;
    }
    if (!/^\d{3}-?\d{4}$/.test(form.postalCode)) {
      setError(t("postalCodeFormat"));
      return;
    }
    if (!form.prefecture) {
      setError(t("prefectureRequired"));
      return;
    }
    if (!form.city.trim()) {
      setError(t("cityRequired"));
      return;
    }
    if (!form.street.trim()) {
      setError(t("streetRequired"));
      return;
    }
    if (/[０-９]/.test(form.street)) {
      setError(t("streetNumberFormat"));
      return;
    }

    const payload = {
      lastName: sanitize(form.lastName) ?? undefined,
      firstName: sanitize(form.firstName) ?? undefined,
      email: form.email.trim(),
      password: form.password,
      image: avatarUrl || null,
      gender: sanitize(form.gender),
      birthday: form.birthday || null,
      postalCode: normalizePostal(form.postalCode),
      prefecture: sanitize(form.prefecture),
      city: sanitize(form.city),
      street: sanitize(form.street),
      building: sanitize(form.building || ""),
      room: sanitize(form.room || ""),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || t("registrationFailed"));
      }
    } catch {
      setError(content.auth.login.unexpectedError[locale === "jp" ? "jp" : locale]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch {
      setError(t("googleRegisterFailed"));
      setGoogleLoading(false);
    }
  };

  const dateInputLang =
    locale === "jp"
      ? "ja-JP"
      : locale === "zh_tw"
        ? "zh-TW"
        : locale === "zh_cn"
          ? "zh-CN"
          : "en-US";

  return (
    <main className="w-full max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{t("pageTitle")}</h1>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("profileImageLabel")}
          </label>
          {avatarUrl && (
            <div className="mb-2">
              <Image
                src={avatarUrl}
                alt="Avatar preview"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}
          <div className="relative">
            <label className="flex items-center gap-2 cursor-pointer w-full p-2 border rounded">
              <div className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                {content.auth.register.fileSelect[locale === "jp" ? "jp" : locale]}
              </div>
              <span className="text-sm text-muted-foreground truncate">
                {avatarUrl
                  ? avatarUrl.split("/").pop()
                  : content.auth.register.noFile[locale === "jp" ? "jp" : locale]}
              </span>
              <input
                title="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading || submitting || googleLoading}
                className="hidden"
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm">{t("uploading")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("lastNameLabel")}</label>
          <Input
            title="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("firstNameLabel")}</label>
          <Input
            title="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {content.auth.login.emailLabel[locale === "jp" ? "jp" : locale]}
          </label>
          <Input
            title="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {content.auth.login.passwordLabel[locale === "jp" ? "jp" : locale]}
          </label>
          <Input
            title="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("genderLabel")}</label>
          <select
            title="gender"
            name="gender"
            value={form.gender}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="w-full p-2 border rounded bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="">{t("selectPlaceholder")}</option>
            <option value="male">{genderLabel("male")}</option>
            <option value="female">{genderLabel("female")}</option>
            <option value="other">{genderLabel("other")}</option>
          </select>
        </div>
        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">{t("addressSection")}</h2>
          <label className="block text-sm font-medium mb-1">
            {t("postalCodeLabel")}
          </label>
          <Input
            name="postalCode"
            value={form.postalCode}
            onChange={onChange}
            inputMode="numeric"
            placeholder="123-4567"
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 都道府県（選單） */}
          <label className="block text-sm font-medium mb-1">{t("prefectureLabel")}</label>
          <select
            title="prefecture"
            name="prefecture"
            value={form.prefecture}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="w-full p-2 border rounded bg-background text-sm disabled:opacity-50 disabled:cursor-not-allowed mb-3"
          >
            <option value="">{t("selectPlaceholder")}</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* 市区町村 */}
          <label className="block text-sm font-medium mb-1">{t("cityLabel")}</label>
          <Input
            title="city"
            name="city"
            value={form.city}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 丁目・番地・号（数字は半角数字） */}
          <label className="block text-sm font-medium mb-1">
            {t("streetLabel")}
          </label>
          <Input
            title="street"
            name="street"
            value={form.street}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 建物名／会社名（任意） */}
          <label className="block text-sm font-medium mb-1">
            {t("buildingLabel")}
          </label>
          <Input
            title="building"
            name="building"
            value={form.building}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-3"
          />

          {/* 部屋番号（任意） */}
          <label className="block text-sm font-medium mb-1">
            {t("roomLabel")}
          </label>
          <Input
            title="room"
            name="room"
            value={form.room}
            onChange={onChange}
            disabled={submitting || googleLoading}
            className="mb-4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("birthdayLabel")}</label>
          <Input
            title="birthday"
            name="birthday"
            type="date"
            lang={dateInputLang}
            value={form.birthday}
            onChange={onChange}
            disabled={submitting || googleLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || googleLoading}
        >
          {submitting ? (
            <>
              <Spinner size="sm" variant="white" />
              {t("registering")}
            </>
          ) : (
            t("registerButton")
          )}
        </Button>
      </form>

      <hr className="my-6" />

      <Button
        onClick={handleGoogleSignIn}
        variant="destructive"
        className="w-full"
        disabled={submitting || googleLoading}
      >
        {googleLoading ? (
          <>
            <Spinner size="sm" />
            {t("googleRegistering")}
          </>
        ) : (
          t("googleRegister")
        )}
      </Button>

      <p className="mt-6 text-center text-sm">
        {t("alreadyHaveAccount")}{" "}
        <a href="/login" className="text-primary underline hover:no-underline">
          {content.auth.login.pageTitle[locale === "jp" ? "jp" : locale]}
        </a>
      </p>
    </main>
  );
}
