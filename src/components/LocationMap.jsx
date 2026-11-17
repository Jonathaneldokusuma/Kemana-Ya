import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { hasCoordinates } from "../spotStorage";

export default function LocationMap({ value, onChange, editable = false }) {
  const container = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const change = useRef(onChange);
  change.current = onChange;
  const [tileError, setTileError] = useState(false);
  const valid = hasCoordinates(value);
  useEffect(() => {
    const view = L.map(container.current, { scrollWheelZoom: false }).setView(
      hasCoordinates(value) ? [Number(value.latitude), Number(value.longitude)] : [-6.2, 106.8167],
      hasCoordinates(value) ? 15 : 5,
    );
    map.current = view;
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).on("tileerror", () => setTileError(true)).addTo(view);
    if (editable) view.on("click", event => change.current?.({ latitude: Number(event.latlng.lat.toFixed(7)), longitude: Number(event.latlng.wrap().lng.toFixed(7)) }));
    const observer = new ResizeObserver(() => view.invalidateSize());
    observer.observe(container.current);
    return () => { observer.disconnect(); view.remove(); map.current = null; marker.current = null; };
  }, [editable]);
  useEffect(() => {
    if (!map.current) return;
    if (!valid) { marker.current?.remove(); marker.current = null; return; }
    const position = [Number(value.latitude), Number(value.longitude)];
    if (marker.current) marker.current.setLatLng(position);
    else {
      marker.current = L.marker(position, {
        draggable: editable,
        title: editable ? "Geser pin untuk mengubah titik" : "Lokasi spot",
        icon: L.divIcon({ className: "location-pin", html: '<span></span>', iconSize: [28, 36], iconAnchor: [14, 36] }),
      }).addTo(map.current);
      if (editable) marker.current.on("dragend", () => {
        const position = marker.current.getLatLng().wrap();
        change.current?.({ latitude: Number(position.lat.toFixed(7)), longitude: Number(position.lng.toFixed(7)) });
      });
    }
    map.current.panTo(position);
  }, [value.latitude, value.longitude, valid, editable]);
  return <div className="location-map-wrap">
    <div className="location-map" ref={container} role="region" aria-label={editable ? "Pilih titik lokasi pada peta" : "Peta lokasi spot"} />
    {tileError && <p className="note color-danger">Peta belum termuat. Periksa internet; koordinat masih dapat diisi manual.</p>}
    {editable && <p className="note">Ketuk peta atau geser pin. Bisa juga isi koordinat di bawah.</p>}
    {editable && <div className="coordinate-fields">
      <label>Latitude<input type="number" step="any" min="-90" max="90" value={value.latitude ?? ""} onChange={e => change.current?.({ ...value, latitude: e.target.value })} /></label>
      <label>Longitude<input type="number" step="any" min="-180" max="180" value={value.longitude ?? ""} onChange={e => change.current?.({ ...value, longitude: e.target.value })} /></label>
    </div>}
  </div>;
}
