import { useState } from "react";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { mapUrl } from "../spotStorage";
import Icon from "./Icon";
import { heartOutline, mapOutline, shareOutline, trashOutline } from "../icons";
import SpotMapDialog from "./SpotMapDialog";

export default function SpotActions({ spot, saved, onSave, isOwner, onDelete, onUpdateLocation, busy }) {
  const [message, setMessage] = useState("");
  const [manualLink, setManualLink] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const share = async () => {
    setMessage("");
    const url = mapUrl(spot);
    try {
      if (navigator.share) await navigator.share({ title: spot.name, text: `${spot.name} · ${spot.location}`, url });
      else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${spot.name} · ${spot.location}\n${url}`);
        setMessage("Tautan lokasi disalin.");
      } else setManualLink(true);
    } catch (error) {
      if (error.name !== "AbortError") setManualLink(true);
    }
  };
  const openMaps = async () => {
    try {
      if (Capacitor.isNativePlatform()) await Browser.open({ url: mapUrl(spot) });
      else window.open(mapUrl(spot), "_blank", "noopener,noreferrer");
    } catch { setMessage("Tidak dapat membuka peta. Coba lagi."); }
  };
  return <div className="spot-actions-wrap">
    <div className="spot-actions">
      <button type="button" className={saved ? "saved" : ""} aria-pressed={saved} onClick={() => onSave(spot)}><Icon src={heartOutline} />{saved ? "Disimpan" : "Simpan"}</button>
      <button type="button" onClick={() => setShowMap(true)}><Icon src={mapOutline} />Peta</button>
      <button type="button" onClick={share}><Icon src={shareOutline} />Bagikan</button>
    </div>
    {isOwner && <div className="owner-actions">
      {confirmDelete ? <div className="delete-confirm" role="alert"><p>Hapus “{spot.name}” beserta ratingnya? Tindakan ini tidak dapat dibatalkan.</p><button type="button" disabled={busy} onClick={() => onDelete(spot)}>Ya, hapus</button><button type="button" disabled={busy} onClick={() => setConfirmDelete(false)}>Batal</button></div>
        : <button className="delete-spot" type="button" onClick={() => setConfirmDelete(true)}><Icon src={trashOutline} />Hapus spot saya</button>}
    </div>}
    {message && <small role="status">{message}</small>}
    {manualLink && <label className="share-link">Salin tautan lokasi<input readOnly value={mapUrl(spot)} onFocus={event => event.target.select()} /></label>}
    {showMap && <SpotMapDialog spot={spot} editable={isOwner} onSave={onUpdateLocation} onClose={() => setShowMap(false)} onOpenMaps={openMaps} />}
  </div>;
}
