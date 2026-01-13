import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const requestSchema = z.object({
  text: z
    .string()
    .min(8, "元のテキストは8文字以上で入力してください。")
    .max(1200, "テキストが長すぎます。短くしてから再度お試しください。"),
  tone: z
    .enum(["friendly", "neutral", "negative"])
    .optional()
    .default("friendly"),
  locale: z
    .enum(["zh-TW", "ja-JP", "en-US"])
    .optional()
    .default("zh-TW"),
  extraInstructions: z
    .string()
    .max(400, "追加指示が長すぎます。短くしてから再度お試しください。")
    .optional(),
});

const toneMap: Record<string, string> = {
  friendly: "親しみやすく自然な語り口で、友人に共有するように表現してください。",
  neutral: "事実に基づいた中立的なトーンで、主観を抑えて客観的に記述してください。",
  negative: "不満や失望感を明確に表現し、商品の問題点や改善が必要な点を率直に、やや批判的なトーンで記述してください。礼儀は保ちつつも、不満の度合いを強めに表現してください。",
};

const localeMap: Record<string, string> = {
  "zh-TW": "繁體字で出力し、台湾向けECレビューに自然な文体で書いてください。",
  "ja-JP": "自然な日本語で出力し、日本のECレビューに馴染むトーンにしてください。",
  "en-US": "reply in fluent US English suitable for ecommerce reviews.",
};

function buildPrompt(params: z.infer<typeof requestSchema>): string {
  const { text, tone, locale, extraInstructions } = params;
  const instructions = [
    `以下のレビュー文を校正・リライトし、意味と要点を維持したまま可読性と信頼感を高めてください。`,
    `Tone: ${toneMap[tone ?? "friendly"]}`,
    locale ? localeMap[locale] : localeMap["zh-TW"],
    `原文にない事実や誇張表現は追加しないでください。`,
    `文字数は 120〜220 字（英語の場合はおおよそ 60〜120 語）を目安にし、具体的なディテールは残してください。`,
  ];

  if (extraInstructions) {
    instructions.push(`追加指示：${extraInstructions}`);
  }

  return [
    instructions.join("\n"),
    `---`,
    `原文："""${text}"""`,
    `---`,
    `リライト後のテキストのみ出力してください。`,
  ].join("\n");
}

export async function POST(req: Request) {
  let payload: z.infer<typeof requestSchema>;

  try {
    const json = await req.json();
    payload = requestSchema.parse(json);
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : "入力内容を解析できませんでした。";
    return NextResponse.json({ message }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ message: "OpenAI API キーが設定されていません。" }, { status: 500 });
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "あなたはEC運営チームのレビューリライト担当です。事実を変えずに可読性・信頼感・親しみやすさを高めてください。",
      prompt: buildPrompt(payload),
      maxOutputTokens: 400,
      temperature: 0.4,
    });

    return NextResponse.json({
      original: payload.text,
      revision: text.trim(),
      tone: payload.tone,
      locale: payload.locale,
    });
  } catch (error) {
    console.error("Comment polish error:", error);
    return NextResponse.json({ message: "リライト処理でエラーが発生しました。時間をおいて再度お試しください。" }, { status: 500 });
  }
}

