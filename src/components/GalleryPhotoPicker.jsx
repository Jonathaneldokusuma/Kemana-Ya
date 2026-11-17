import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { imageOutline } from "../icons";
import { pickGalleryPhoto } from "../gallery";

export default function GalleryPhotoPicker({ hasPhoto, disabled, onPick, onError }) {
  const dialog = useRef(null);
  const [picking, setPicking] = useState(false);
  useEffect(() => () => dialog.current?.close(), []);
  const choose = async () => {
    dialog.current.close();
    setPicking(true);
    try {
      const photo = await pickGalleryPhoto();
      if (photo) onPick(photo);
    } catch (error) {
      if (!/cancel|canceled|cancelled|dibatalkan/i.test(error.message || "")) {
        onError(/denied|permission/i.test(error.message || "") ? "Akses foto tidak diizinkan. Pilih foto kembali melalui galeri atau periksa izin aplikasi di Pengaturan." : "Foto tidak dapat dibuka. Coba pilih foto lain.");
      }
    } finally { setPicking(false); }
  };
  return <div className="gallery-picker">
    <button type="button" className="button fill-outline expand-block" disabled={disabled || picking} onClick={() => dialog.current.showModal()}><Icon src={imageOutline} />{picking ? "Memproses foto..." : hasPhoto ? "Ganti foto dari galeri" : "Pilih foto dari galeri"}</button>
    <p className="note">Pilih satu foto. Foto akan diperkecil otomatis dan diunggah saat Publish.</p>
    <dialog ref={dialog} className="gallery-consent" aria-labelledby="gallery-permission-title">
      <Icon src={imageOutline} />
      <h2 id="gallery-permission-title">Izinkan akses foto dari galeri?</h2>
      <p>KemanaYa hanya mengakses foto yang kamu pilih untuk spot ini. Foto diunggah dan dapat dilihat pengguna lain setelah kamu menekan Publish.</p>
      <button type="button" className="button expand-block" onClick={choose}>Izinkan & pilih foto</button>
      <button type="button" className="button fill-clear expand-block" onClick={() => dialog.current.close()}>Nanti</button>
    </dialog>
  </div>;
}
