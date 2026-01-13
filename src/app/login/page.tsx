"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "next-intl";
import {
  getLocalizedText,
  type Locale,
  createTranslationGetter,
  getTranslation,
} from "@/lib/i18n";
import content from "@/data/content.json";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const locale = useLocale() as Locale;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const copy = content.auth.login;
  const t = createTranslationGetter(copy, locale);

  if (status === "loading") {
    return (
      <main className="w-full max-w-md mx-auto p-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Spinner size="sm" />
          <span className="text-sm text-muted-foreground">{t("loading")}</span>
        </div>
      </main>
    );
  }

  if (session) {
    const welcomeText = getTranslation(copy.welcome, locale).replace(
      "{email}",
      session.user?.email ?? ""
    );

    return (
      <main className="w-full max-w-md mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("loggedInTitle")}</h1>
        <p className="mb-4">{welcomeText}</p>
        <Button
          onClick={() => signOut()}
          variant="destructive"
          className="w-full"
        >
          {t("logout")}
        </Button>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(t("loginFailed"));
      } else {
        router.push("/");
      }
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google");
    } catch {
      setError(t("googleLoginFailed"));
      setGoogleLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{t("pageTitle")}</h1>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">{t("emailLabel")}</label>
          <Input
            title="email"
            type="email"
            value={email}
            className="border-border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || googleLoading}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            {t("passwordLabel")}
          </label>
          <Input
            title="password"
            type="password"
            value={password}
            className="border-border rounded-md"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || googleLoading}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading || googleLoading}
        >
          {loading ? (
            <>
              <Spinner size="sm" variant="white" />
              {t("loggingIn")}
            </>
          ) : (
            t("loginButton")
          )}
        </Button>
      </form>

      <hr className="my-6" />

      <Button
        onClick={handleGoogleSignIn}
        variant="destructive"
        className="w-full"
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <>
            <Spinner size="sm" />
            {t("googleLoggingIn")}
          </>
        ) : (
          t("googleLogin")
        )}
      </Button>

      <p className="mt-4 text-center text-sm">
        {t("newHerePrefix")}{" "}
        <a
          href="/register"
          className="text-primary underline hover:no-underline"
        >
          {t("registerHere")}
        </a>
      </p>
    </main>
  );
}
