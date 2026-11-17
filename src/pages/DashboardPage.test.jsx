// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import DashboardPage from "./DashboardPage";
import { api } from "../api";
import { readLocal, writeLocal } from "../spotStorage";

vi.mock("../api", () => ({ api: vi.fn() }));
vi.mock("../components/LocationMap", () => ({ default: () => <div>Location map</div> }));
vi.mock("../gallery", async (importOriginal) => ({
  ...await importOriginal(),
  photoFormData: vi.fn(async () => new FormData()),
}));
const spot = { id: 7, name: "Taman Kota", location: "Bandung", image: "https://example.com/a.jpg", category: "Outdoor", description: "Tempat santai", tags: [], photoScore: 4, placeScore: 4 };
let root, container;
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal("React", React);
  const storage = new Map();
  vi.stubGlobal("localStorage", {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    clear: () => storage.clear(),
  });
  window.scrollTo = vi.fn();
  localStorage.clear();
  api.mockResolvedValue([spot]);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  container?.remove();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});
const render = (page = "dashboard", userId = 1) => act(async () => root.render(<DashboardPage key={userId} user={{ id: userId, name: "Explorer" }} page={page} setPage={vi.fn()} />));

it("persists saved spots across navigation, removes them, and isolates accounts", async () => {
  await render();
  const save = container.querySelector('.spot-actions button');
  await act(async () => save.click());
  expect(readLocal(1, "saved", [])[0].id).toBe(7);
  await render("saved");
  expect(container.querySelectorAll('.spot-card')).toHaveLength(1);
  await render("saved", 2);
  expect(container.querySelectorAll('.spot-card')).toHaveLength(0);
  await render("saved", 1);
  await act(async () => container.querySelector('.spot-actions button').click());
  expect(container.textContent).toContain("Mulai koleksimu");
  expect(readLocal(1, "saved", [])).toEqual([]);
});

it("restores a local draft and retains it when publishing fails", async () => {
  const draft = { ...spot, name: "Draf saya", image: "data:image/jpeg;base64,aGVsbG8=" };
  writeLocal(1, "draft", draft);
  await render("add");
  expect(container.querySelector('.form-input').value).toBe("Draf saya");
  api.mockRejectedValue(new Error("Tidak terhubung"));
  const publish = [...container.querySelectorAll('button')].find(b => b.textContent.includes("Publish"));
  await act(async () => publish.click());
  expect(readLocal(1, "draft", {}).name).toBe("Draf saya");
  expect(container.textContent).toContain("Tidak terhubung");
});

it("shows cached feed when the API is unreachable", async () => {
  writeLocal(1, "feed", [spot]);
  api.mockRejectedValue(new Error("Offline"));
  await render();
  expect(container.textContent).toContain("Menampilkan data tersimpan");
  expect(container.querySelector('.spot-card').textContent).toContain("Taman Kota");
});

it("shows delete only for owner, keeps spot on failure and removes it after success", async () => {
  api.mockResolvedValue([{ ...spot, ownerId: 1 }]);
  await render();
  const button = text => [...container.querySelectorAll('button')].find(b => b.textContent.includes(text));
  await act(async () => button('Hapus spot saya').click());
  expect(api).not.toHaveBeenCalledWith('/places/7', { method: 'DELETE' });
  api.mockRejectedValueOnce(new Error('Gagal menghapus'));
  await act(async () => button('Ya, hapus').click());
  expect(container.querySelector('.spot-card')).not.toBeNull();
  api.mockResolvedValueOnce({ id: 7 });
  await act(async () => button('Ya, hapus').click());
  expect(api).toHaveBeenCalledWith('/places/7', { method: 'DELETE' });
  expect(container.querySelector('.spot-card')).toBeNull();
  expect(readLocal(1, 'feed', [])).toEqual([]);
});

it("hides delete action from other accounts", async () => {
  api.mockResolvedValue([{ ...spot, ownerId: 2 }]);
  await render();
  expect(container.querySelector('.delete-spot')).toBeNull();
});
