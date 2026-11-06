import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export const ok = (data = {}, status = 200) => NextResponse.json(data, { status });

/** پوشش مشترک Route Handlerها برای تبدیل خطاها به پاسخ JSON فارسی */
export function handle(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof AppError) return NextResponse.json({ error: e.message }, { status: e.status });
      console.error(e);
      return NextResponse.json({ error: "خطای داخلی سرور رخ داد. لطفاً دوباره تلاش کنید." }, { status: 500 });
    }
  };
}

export async function readJson(req) {
  try {
    return await req.json();
  } catch {
    throw new AppError("درخواست نامعتبر است.");
  }
}
