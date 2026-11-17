// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { api, session } from "./api";

afterEach(() => {
  session.clear();
  vi.unstubAllGlobals();
});

it("sends JSON and bearer token and unwraps API data", async () => {
  session.set("test-token");
  const fetch = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ data: { id: 1 } }) });
  vi.stubGlobal("fetch", fetch);
  expect(
    await api("/places", { method: "POST", body: { name: "Kafe" } }),
  ).toEqual({ id: 1 });
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe(
    "Bearer test-token",
  );
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ name: "Kafe" });
});
it("shows backend field validation messages", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ errors: { name: ["Nama wajib diisi."] } }),
      }),
  );
  await expect(api("/places")).rejects.toThrow("Nama wajib diisi.");
});
it("clears expired session and signals the application", async () => {
  session.set("expired");
  const listener = vi.fn();
  window.addEventListener("kemanaya:unauthorized", listener, { once: true });
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: "Silakan masuk kembali." }),
      }),
  );
  await expect(api("/me")).rejects.toThrow("Silakan masuk kembali.");
  expect(session.get()).toBeNull();
  expect(listener).toHaveBeenCalledOnce();
});
it("reports network failures clearly", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
  );
  await expect(api("/places")).rejects.toThrow("Pastikan backend berjalan.");
});

it("uploads multipart without overriding the browser boundary", async () => {
  session.set("test-token");
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { id: 9 } }) });
  vi.stubGlobal("fetch", fetch);
  const form = new FormData();
  form.append("photo", new Blob(["photo"], { type: "image/jpeg" }), "spot.jpg");
  await api("/places", { method: "POST", body: form });
  expect(fetch.mock.calls[0][1].body).toBe(form);
  expect(fetch.mock.calls[0][1].headers["Content-Type"]).toBeUndefined();
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer test-token");
});
