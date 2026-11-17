// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import ProfilePage from "./ProfilePage";
import { api } from "../api";

vi.mock("../api", () => ({ api: vi.fn() }));

let root;
let container;

// Bersihkan root dan mock setelah setiap pengujian selesai.
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  container?.remove();
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});

it("refreshes real account activity and pauses polling during profile editing", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal("React", React);
  vi.useFakeTimers();
  const user = {
    name: "New Explorer",
    email: "new@example.com",
    settings: {},
    stats: { places: 0, ratings: 0, badges: 0 },
    level: 1,
    badges: [],
    activities: [],
    challengeProgress: { completed: 0, target: 3, label: "Challenge" },
  };
  api.mockResolvedValue(user);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <ProfilePage user={user} onUpdate={vi.fn()} onLogout={vi.fn()} />,
    ),
  );
  expect(container.textContent).toContain("Lv. 1");
  expect(container.textContent).toContain("Belum ada aktivitas.");
  expect(container.textContent).toContain("Belum ada badge.");
  api.mockResolvedValue({
    ...user,
    stats: { places: 1, ratings: 0, badges: 1 },
    badges: [
      {
        key: "local-guide",
        label: "Local Guide",
        description: "Tempat pertama",
      },
    ],
    activities: [
      {
        id: "place-1",
        title: "Upload Tempat Baru",
        meta: "Bandung",
        occurredAt: "2026-10-17T00:00:00Z",
      },
    ],
  });
  await act(async () => vi.advanceTimersByTimeAsync(15000));
  expect(container.textContent).toContain("Upload Tempat Baru");
  expect(container.querySelector(".profile-stats strong").textContent).toBe(
    "1",
  );
  const edit = [...container.querySelectorAll("button")].find(
    (button) => button.textContent.trim() === "Edit",
  );
  await act(async () => edit.click());
  const calls = api.mock.calls.length;
  await act(async () => vi.advanceTimersByTimeAsync(30000));
  expect(api).toHaveBeenCalledTimes(calls);
  expect(container.querySelector("form")).not.toBeNull();
  const cancel = [...container.querySelectorAll("button")].find(
    (button) => button.textContent.trim() === "Cancel",
  );
  await act(async () => cancel.click());
  expect(api.mock.calls.length).toBe(calls + 1);
});
