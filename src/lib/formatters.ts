export type JPAddressLike = {
  postalCode?: string | null;
  prefecture?: string | null;
  city?: string | null;
  street?: string | null;
  building?: string | null;
  room?: string | null;
};

export const formatJPAddress = (u: JPAddressLike) => {
  const pc = u.postalCode ? `〒${String(u.postalCode).replace(/-/g, "")}` : "";
  const main = `${u.prefecture ?? ""}${u.city ?? ""}${u.street ?? ""}`.trim();
  const opt = [u.building, u.room].filter(Boolean).join(" ");
  return [pc, main, opt].filter(Boolean).join(" ");
};
