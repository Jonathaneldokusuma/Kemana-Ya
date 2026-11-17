// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import LocationMap from "./LocationMap";

let root, container;
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  container?.remove();
  vi.unstubAllGlobals();
  delete globalThis.IS_REACT_ACT_ENVIRONMENT;
});

it("creates a draggable pin, reports map taps and removes the pin when coordinates are cleared", async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  vi.stubGlobal("React", React);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  container = document.createElement('div'); document.body.append(container);
  root = createRoot(container);
  const onChange = vi.fn();
  await act(async () => root.render(<LocationMap editable value={{ latitude: -6.9, longitude: 107.6 }} onChange={onChange} />));
  expect(container.querySelector('.leaflet-marker-draggable')).not.toBeNull();
  await act(async () => container.querySelector('.location-map').dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 80, clientY: 80 })));
  expect(onChange).toHaveBeenCalled();
  expect(typeof onChange.mock.calls[0][0].latitude).toBe('number');
  await act(async () => root.render(<LocationMap editable value={{ latitude: null, longitude: null }} onChange={onChange} />));
  expect(container.querySelector('.leaflet-marker-icon')).toBeNull();
});
