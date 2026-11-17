const baseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");
// Session storage survives refresh, but is cleared when the browser session ends.
export const session = {
  get: () => sessionStorage.getItem("kemanaya_token"),
  set: (token) => sessionStorage.setItem("kemanaya_token", token),
  clear: () => sessionStorage.removeItem("kemanaya_token"),
};
export async function api(path, { method = "GET", body, signal } = {}) {
  const multipart = body instanceof FormData;
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      signal,
      headers: {
        Accept: "application/json",
        ...(body && !multipart ? { "Content-Type": "application/json" } : {}),
        ...(session.get() ? { Authorization: `Bearer ${session.get()}` } : {}),
      },
      ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("Tidak dapat menghubungi API. Pastikan backend berjalan.");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      session.clear();
      window.dispatchEvent(new Event("kemanaya:unauthorized"));
    }
    throw new Error(
      Object.values(payload.errors || {})
        .flat()
        .join(" ") ||
        payload.message ||
        "Permintaan gagal.",
    );
  }
  return payload.data;
}
