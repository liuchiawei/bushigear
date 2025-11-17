// Stripe 工具関数
import Stripe from "stripe";

// Stripe インスタンスを初期化
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

// Checkout Session の検証と取得
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });
    return session;
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    throw error;
  }
}

// Checkout Session の状態を検証
export function isSessionCompleted(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === "paid" && session.status === "complete";
}

// 金額を Stripe 形式に変換（日本円は整数で扱う）
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount);
}
