import { Camera, MediaTypeSelection } from "@capacitor/camera";

export const MAX_PHOTO_BYTES = 512 * 1024;

export async function preparePhoto(webPath) {
  const image = new Image();
  image.src = webPath;
  await image.decode();
  const ratio = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Foto tidak dapat diproses di perangkat ini.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.82, 0.7, 0.55, 0.4]) {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
    if (blob && blob.size <= MAX_PHOTO_BYTES) {
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Foto tidak dapat dibaca."));
        reader.readAsDataURL(blob);
      });
    }
  }
  throw new Error("Foto masih terlalu besar. Pilih foto lain yang lebih kecil.");
}

export async function pickGalleryPhoto() {
  const selected = await Camera.chooseFromGallery({
    mediaType: MediaTypeSelection.Photo,
    allowMultipleSelection: false,
    includeMetadata: false,
    targetWidth: 1280,
    targetHeight: 1280,
    quality: 85,
  });
  const photo = selected.results?.[0];
  if (!photo?.webPath) return null;
  return preparePhoto(photo.webPath);
}

export function isGalleryPhoto(value) {
  return typeof value === "string" && value.startsWith("data:image/jpeg;base64,");
}

export async function photoFormData(spot) {
  const form = new FormData();
  for (const field of ["name", "location", "category", "description", "latitude", "longitude"]) {
    if (spot[field] !== null && spot[field] !== undefined && spot[field] !== "") form.append(field, String(spot[field]));
  }
  const photo = await (await fetch(spot.image)).blob();
  if (photo.size > MAX_PHOTO_BYTES) throw new Error("Foto terlalu besar. Pilih ulang foto dari galeri.");
  form.append("photo", photo, "spot.jpg");
  return form;
}
