import { useEffect, useRef, useState } from "react";
import LocationMap from "./LocationMap";
import Icon from "./Icon";
import { closeOutline, arrowUpRightOutline } from "../icons";
import { hasCoordinates } from "../spotStorage";

export default function SpotMapDialog({ spot, editable, onSave, onClose, onOpenMaps }) {
  const dialog = useRef(null);
  const [point, setPoint] = useState({ latitude: spot.latitude, longitude: spot.longitude });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { dialog.current.showModal(); }, []);
  const save = async () => {
    if (saving || !hasCoordinates(point)) return;
    setSaving(true); setError("");
    try {
      await onSave(spot, { latitude: Number(point.latitude), longitude: Number(point.longitude) });
      onClose();
    } catch (error) { setError(error.message); }
    finally { setSaving(false); }
  };
  return <dialog className="map-dialog" ref={dialog} onCancel={event => { event.preventDefault(); if (!saving) onClose(); }} aria-labelledby="map-dialog-title">
    <div className="map-dialog-heading"><div><p className="eyebrow">{editable ? "Tandai lokasi" : "Lokasi spot"}</p><h2 id="map-dialog-title">{spot.name}</h2></div><button type="button" aria-label="Tutup peta" disabled={saving} onClick={onClose}><Icon src={closeOutline} /></button></div>
    <p>{spot.location}</p>
    {editable || hasCoordinates(spot) ? <LocationMap value={point} editable={editable} onChange={setPoint} /> : <p className="note">Pemilik belum menandai titik lokasi. Gunakan pencarian Google Maps di bawah.</p>}
    {error && <p role="alert" className="note color-danger">{error}</p>}
    {editable && <button type="button" className="button expand-block" disabled={saving || !hasCoordinates(point)} onClick={save}>{saving ? "Menyimpan..." : "Simpan titik lokasi"}</button>}
    <button type="button" className="button fill-outline expand-block" onClick={onOpenMaps}><Icon src={arrowUpRightOutline} />Buka Google Maps</button>
  </dialog>;
}
