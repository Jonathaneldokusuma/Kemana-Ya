// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import GalleryPhotoPicker from "./GalleryPhotoPicker";
import { pickGalleryPhoto } from "../gallery";
vi.mock("../gallery", () => ({ pickGalleryPhoto: vi.fn() }));
let root, container;
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal("React", React);
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  container = document.createElement("div"); document.body.append(container); root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove(); vi.clearAllMocks(); vi.unstubAllGlobals(); delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});
it("opens gallery only after consent, then returns the selected photo", async () => {
  const onPick = vi.fn(); const onError = vi.fn();
  pickGalleryPhoto.mockResolvedValue("data:image/jpeg;base64,photo");
  await act(async () => root.render(<GalleryPhotoPicker onPick={onPick} onError={onError} />));
  await act(async () => container.querySelector("button").click());
  expect(container.querySelector("dialog").open).toBe(true);
  expect(pickGalleryPhoto).not.toHaveBeenCalled();
  await act(async () => container.querySelector("dialog button").click());
  expect(pickGalleryPhoto).toHaveBeenCalledOnce();
  expect(onPick).toHaveBeenCalledWith("data:image/jpeg;base64,photo");
  expect(onError).not.toHaveBeenCalled();
});
it("keeps the previous photo when selection is cancelled", async () => {
  const onPick = vi.fn(); const onError = vi.fn();
  pickGalleryPhoto.mockRejectedValue(new Error("User cancelled"));
  await act(async () => root.render(<GalleryPhotoPicker hasPhoto onPick={onPick} onError={onError} />));
  await act(async () => container.querySelector("dialog button").click());
  expect(onPick).not.toHaveBeenCalled(); expect(onError).not.toHaveBeenCalled();
});
it("shows a helpful message if photo access is denied", async () => {
  const onError = vi.fn();
  pickGalleryPhoto.mockRejectedValue(new Error("Permission denied"));
  await act(async () => root.render(<GalleryPhotoPicker onPick={vi.fn()} onError={onError} />));
  await act(async () => container.querySelector("dialog button").click());
  expect(onError).toHaveBeenCalledWith(expect.stringContaining("Akses foto tidak diizinkan"));
});
