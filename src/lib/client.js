/** فراخوانی API از سمت مرورگر؛ همیشه { ok, data, error } برمی‌گرداند. */
export async function api(url, { method = "GET", body } = {}) {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, data, error: data.error || "خطایی رخ داد. لطفاً دوباره تلاش کنید." };
    return { ok: true, data, error: null };
  } catch {
    return { ok: false, data: {}, error: "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید." };
  }
}
