import SelectedSpotCard from "../components/SelectedSpotCard";
import SpotCard from "../components/SpotCard";
import RecommendationCard from "../components/RecommendationCard";
import Tag from "../components/Tag";
import Icon from "../components/Icon";
import FormField from "../components/FormField";
import Button from "../components/Button";
import StatusMessage from "../components/StatusMessage";
import NotificationPanel from "../components/NotificationPanel";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  arrowBackOutline,
  businessOutline,
  cloudUploadOutline,
  createOutline,
  imageOutline,
  locationOutline,
  pricetagOutline,
  refreshOutline,
  arrowUpRightOutline,
  closeOutline,
} from "../icons";
import Header from "../components/Header";
import RatingPicker from "../components/RatingPicker";
import ScoreGrid from "../components/ScoreGrid";
import { categories } from "../data/spots";
import { api } from "../api";
import { readLocal, writeLocal, hasCoordinates } from "../spotStorage";
import SpotActions from "../components/SpotActions";
import LocationMap from "../components/LocationMap";
import GalleryPhotoPicker from "../components/GalleryPhotoPicker";
import { isGalleryPhoto, photoFormData } from "../gallery";
const emptySpot = {
  name: "",
  location: "",
  category: categories[0],
  description: "",
  image: "",
  latitude: null,
  longitude: null,
};
export default function DashboardPage({ page, setPage, user }) {
  const userId = user?.id || user?.email || "guest";
  const [savedSpots, setSavedSpots] = useState(() => readLocal(userId, "saved", []).filter(s => s?.id));
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState("");
  // Semua urusan spot, rating, dan tambah spot ada di sini.
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [detailSpot, setDetailSpot] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      title: "Selamat datang",
      message: "Mulai rating spot untuk bantu tempat worth it masuk Recomend.",
      time: "Baru saja",
      read: false,
    },
  ]);
  const [newSpot, setNewSpot] = useState(() => ({ ...emptySpot, ...readLocal(userId, "draft", {}) }));
  useEffect(() => {
    if (!writeLocal(userId, "draft", newSpot)) setNotice("Draf tidak dapat disimpan di perangkat ini.");
  }, [newSpot, userId]);
  useEffect(() => {
    setDetailSpot(null);
    setQuery("");
    setActiveCategory("all");
    setError("");
    window.scrollTo(0, 0);
  }, [page]);
  const toggleSave = (spot) => {
    const exists = savedSpots.some(item => item.id === spot.id);
    const next = exists ? savedSpots.filter(item => item.id !== spot.id) : [spot, ...savedSpots];
    if (writeLocal(userId, "saved", next)) {
      setSavedSpots(next);
      setNotice(exists ? "Spot dihapus dari koleksi." : "Spot disimpan di perangkat ini.");
    } else setNotice("Penyimpanan perangkat penuh atau tidak tersedia.");
  };
  const [visitMessage, setVisitMessage] = useState("");
  const [worthNotified, setWorthNotified] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const ownsSpot = spot => Boolean(user?.id) && String(spot.ownerId) === String(user.id);
  const deleteSpot = async spot => {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try {
      await api(`/places/${spot.id}`, { method: "DELETE" });
      const next = spots.filter(item => item.id !== spot.id);
      setSpots(next);
      writeLocal(userId, "feed", next);
      const saved = savedSpots.filter(item => item.id !== spot.id);
      setSavedSpots(saved); writeLocal(userId, "saved", saved);
      if (detailSpot?.id === spot.id) setDetailSpot(null);
      if (selectedSpot?.id === spot.id) setSelectedSpot(next[0] || null);
      setNotice("Spot berhasil dihapus.");
    } catch (error) { setError(error.message); }
    finally { pending.current = false; setBusy(false); }
  };
  const updateLocation = async (spot, coordinates) => {
    const updated = await api(`/places/${spot.id}/location`, { method: "PATCH", body: coordinates });
    setSpots(items => items.map(item => item.id === updated.id ? updated : item));
    if (detailSpot?.id === updated.id) setDetailSpot(updated);
    const saved = savedSpots.map(item => item.id === updated.id ? updated : item);
    setSavedSpots(saved); writeLocal(userId, "saved", saved);
    setNotice("Titik lokasi berhasil disimpan.");
  };
  const loadSpots = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/places");
      setSpots(data);
      writeLocal(userId, "feed", data);
      setOffline(false);
      setSelectedSpot(data[0] || null);
    } catch (error) {
      const cached = readLocal(userId, "feed", []);
      if (cached.length) {
        setSpots(cached);
        setOffline(true);
      } else setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSpots();
  }, []);
  const worthScore = (spot) =>
    Number(((spot.photoScore + spot.placeScore) / 2).toFixed(1));
  const isWorth = (spot) => worthScore(spot) >= 4.5;
  const frontPageSpots = useMemo(
    () => spots.filter(isWorth).sort((a, b) => worthScore(b) - worthScore(a)),
    [spots],
  );
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  useEffect(() => {
    if (spots.length && !offline) writeLocal(userId, "feed", spots);
  }, [spots, offline, userId]);
  const [previewFailed, setPreviewFailed] = useState(false);
  const visibleSpots = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = page === "saved" ? savedSpots.map(saved => spots.find(spot => spot.id === saved.id) || saved) : spots;
    const list = source.filter(
      (spot) =>
        (activeCategory === "all" || spot.category === activeCategory) &&
        (!q ||
          [spot.name, spot.location, spot.description, ...(spot.tags || [])]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
    if (sortBy === "score")
      return [...list].sort((a, b) => worthScore(b) - worthScore(a));
    if (sortBy === "name")
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [spots, savedSpots, page, query, activeCategory, sortBy]);
  const avgScore = spots.length
    ? (spots.reduce((sum, s) => sum + worthScore(s), 0) / spots.length).toFixed(1)
    : "-";
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const title =
    page === "add" ? "Tambah spot" : detailSpot ? "Detail spot" : page === "saved" ? "Koleksimu" : "KemanaYa";
  const addNotification = (titleText, message) => {
    setNotifications((items) => [
      {
        title: titleText,
        message,
        time: "Baru saja",
        read: false,
      },
      ...items,
    ]);
  };
  const toggleNotifications = () => {
    setShowNotifications((visible) => !visible);
    setNotifications((items) =>
      items.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };
  const openRatingPage = async (spot) => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const fresh = await api(`/places/${spot.id}`);
      setSelectedSpot(fresh);
      setDetailSpot(fresh);
      setVisitMessage("");
    } catch (error) {
      if (offline || !navigator.onLine) {
        setDetailSpot(spot);
        setNotice("Detail tersimpan. Hubungkan internet untuk mengirim rating.");
      } else setError(error.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  const publishSpot = async () => {
    if (pending.current) return;
    if (
      ![
        newSpot.name,
        newSpot.location,
        newSpot.description,
      ].every((value) => value.trim())
    ) {
      setError("Nama, lokasi, dan deskripsi wajib diisi.");
      return;
    }
    if (!isGalleryPhoto(newSpot.image)) {
      setError("Pilih foto spot dari galeri terlebih dahulu.");
      return;
    }
    if ((newSpot.latitude !== null && newSpot.latitude !== "" || newSpot.longitude !== null && newSpot.longitude !== "") && !hasCoordinates(newSpot)) {
      setError("Isi latitude (-90 sampai 90) dan longitude (-180 sampai 180) yang valid.");
      return;
    }
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const spot = await api("/places", {
        method: "POST",
        body: await photoFormData(newSpot),
      });
      setSpots((items) => [spot, ...items]);
      setSelectedSpot(spot);
      setDetailSpot(null);
      addNotification(
        "Spot berhasil dipublish",
        `${spot.name} masuk feed dan siap dirating.`,
      );
      setNewSpot(emptySpot);
      setPage("dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  const rateSpot = async (spot, key, score) => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const updated = await api(`/places/${spot.id}/rating`, {
        method: "PUT",
        body: {
          [key]: score,
        },
      });
      setSpots((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelectedSpot(updated);
      setDetailSpot(updated);
      setVisitMessage(
        isWorth(updated)
          ? `${updated.name} worth it dan masuk Recomend.`
          : `${updated.name} belum masuk Recomend.`,
      );
      if (
        !isWorth(spot) &&
        isWorth(updated) &&
        !worthNotified.has(updated.id)
      ) {
        addNotification(
          "Spot masuk Recomend",
          `${updated.name} sekarang worth it dengan skor ${updated.rating}.`,
        );
        setWorthNotified((items) => new Set(items).add(updated.id));
      }
    } catch (error) {
      setError(error.message);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  return (
    <div className="page">
      <Header
        title={title}
        onAdd={() => setPage("add")}
        onNotifications={toggleNotifications}
        unreadNotifications={unreadNotifications}
      />
      <div className="page-content dashboard-page">
        {showNotifications && (
          <NotificationPanel
            notifications={notifications}
            onClose={toggleNotifications}
          />
        )}

        <main className="page-shell" aria-busy={loading || busy}>
          {notice && <div className="inline-notice" role="status"><span>{notice}</span><button type="button" aria-label="Tutup pesan" onClick={() => setNotice("")}><Icon src={closeOutline} /></button></div>}
          {offline && <div className="offline-banner" role="status">Menampilkan data tersimpan. <button type="button" onClick={loadSpots}>Coba online</button></div>}
          {loading && (
            <div className="skeleton-grid" aria-label="Memuat spot">
              {[0, 1, 2].map((i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line short" />
                </div>
              ))}
            </div>
          )}
          {busy && (
            <div className="busy-toast" role="status">
              <span className="spinner" /> Memproses...
            </div>
          )}
          {error && (
            <div role="alert">
              <StatusMessage className="color-danger">{error}</StatusMessage>
              <Button onClick={loadSpots} className="fill-clear" type="button">
                Muat ulang feed
              </Button>
            </div>
          )}
          {!loading && !error && spots.length === 0 && (
            <StatusMessage>
              Belum ada spot. Tambahkan tempat pertamamu.
            </StatusMessage>
          )}
          {page === "add" && (
            <section className="add-shell">
              <p className="eyebrow">Upload Spot Baru</p>
              <h1>Kenalkan tempat yang kamu temukan.</h1>
              <p className="draft-note">Draf tersimpan otomatis di perangkat ini.</p>
              <div className="form-card">
                <FormField label="Nama tempat" icon={businessOutline}>
                  <input
                    value={newSpot.name}
                    onChange={(event) =>
                      setNewSpot({
                        ...newSpot,
                        name: event.target.value || "",
                      })
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Lokasi" icon={locationOutline}>
                  <input
                    value={newSpot.location}
                    onChange={(event) =>
                      setNewSpot({
                        ...newSpot,
                        location: event.target.value || "",
                      })
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Kategori" icon={pricetagOutline}>
                  <select
                    value={newSpot.category}
                    onChange={(event) =>
                      setNewSpot({
                        ...newSpot,
                        category: event.target.value,
                      })
                    }
                    className="form-input"
                  >
                    {categories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </FormField>
                <h2 className="map-field-title">Tandai lokasi di peta</h2>
                <LocationMap value={newSpot} editable onChange={point => setNewSpot(current => ({ ...current, latitude: point.latitude, longitude: point.longitude }))} />
                <GalleryPhotoPicker hasPhoto={isGalleryPhoto(newSpot.image)} disabled={busy} onPick={image => { setPreviewFailed(false); setError(""); setNewSpot(current => ({ ...current, image })); }} onError={setError} />
                <div className="image-preview">
                  {isGalleryPhoto(newSpot.image) && !previewFailed ? (
                    <img
                      src={newSpot.image}
                      alt="Preview foto spot"
                      onError={() => setPreviewFailed(true)}
                    />
                  ) : (
                    <span>
                      {previewFailed
                        ? "Foto tidak bisa dimuat. Pilih ulang dari galeri."
                        : "Preview foto muncul di sini."}
                    </span>
                  )}
                  <div className="preview-caption">
                    <strong>{newSpot.name || "Nama tempat"}</strong>
                    <small>{newSpot.location || "Lokasi"}</small>
                  </div>
                </div>
                <FormField label="Deskripsi" icon={createOutline}>
                  <textarea
                    value={newSpot.description}
                    onChange={(event) =>
                      setNewSpot({
                        ...newSpot,
                        description: event.target.value || "",
                      })
                    }
                    className="form-input"
                  />
                </FormField>
                <Button
                  disabled={busy}
                  onClick={publishSpot}
                  className="expand-block color-secondary"
                  type="button"
                >
                  <Icon
                    src={cloudUploadOutline}
                  />
                  Publish
                </Button>
              </div>
            </section>
          )}

          {detailSpot && page !== "add" && (
            <section className="rating-shell">
              <button
                className="back-link"
                type="button"
                onClick={() => setDetailSpot(null)}
              >
                <Icon
                  src={arrowBackOutline}
                />
                Kembali ke feed
              </button>
              <div className="rating-card">
                <div className="rating-photo">
                  <img src={detailSpot.image} alt={detailSpot.name} />
                  <div>
                    <h1>{detailSpot.name}</h1>
                    <p>{detailSpot.location}</p>
                  </div>
                </div>
                <div className="rating-info">
                  <p className="eyebrow">Rate this place</p>
                  <h2>{isWorth(detailSpot) ? "Worth it" : "Belum Recomend"}</h2>
                  <p>{detailSpot.description}</p>
                  <ScoreGrid spot={detailSpot} worthScore={worthScore} />
                  <SpotActions spot={detailSpot} saved={savedSpots.some(s => s.id === detailSpot.id)} onSave={toggleSave} isOwner={ownsSpot(detailSpot)} onDelete={deleteSpot} onUpdateLocation={updateLocation} busy={busy} />
                  <RatingPicker
                    disabled={busy}
                    label="Rating foto"
                    value={detailSpot.photoScore}
                    onPick={(score) =>
                      rateSpot(detailSpot, "photoScore", score)
                    }
                  />
                  <RatingPicker
                    disabled={busy}
                    label="Rating tempat"
                    value={detailSpot.placeScore}
                    onPick={(score) =>
                      rateSpot(detailSpot, "placeScore", score)
                    }
                  />
                  <div className="chip-row">
                    {detailSpot.tags.map((tag) => (
                      <Tag key={tag} className="color-success">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  {visitMessage && (
                    <StatusMessage className="color-success">
                      {visitMessage}
                    </StatusMessage>
                  )}
                </div>
              </div>
            </section>
          )}

          {(page === "dashboard" || page === "saved") && !detailSpot && (
            <div className="dashboard-grid">
              <section className="side-card recommendations-panel">
                <p className="eyebrow">Recomend</p>
                <h1>Tempat rekomendasi</h1>
                <div className="front-list">
                  {!loading && frontPageSpots.length === 0 && (
                    <StatusMessage>
                      Belum ada spot dengan worth score minimal 4.5.
                    </StatusMessage>
                  )}
                  {frontPageSpots.map((spot) => (
                    <RecommendationCard
                      key={spot.id}
                      spot={spot}
                      score={worthScore(spot)}
                      onOpen={openRatingPage}
                    />
                  ))}
                </div>
              </section>
              <section className="explore-section">
                <div className="explore-hero">
                  <p className="eyebrow">{page === "saved" ? "Koleksi pribadi" : "Keluar sebentar, temukan cerita"}</p>
                  <h1 className="feed-heading">{page === "saved" ? "Rencana jalan berikutnya." : `Mau ke mana${user?.name ? ", " + user.name.split(" ")[0] : ""}?`}</h1>
                  <p>{page === "saved" ? "Tempat pilihanmu, siap dijelajahi. Disimpan di perangkat ini." : "Temukan tempat baru dari cerita komunitas."}</p>
                  <div className="hero-actions">
                    <button type="button" disabled={!visibleSpots.length || busy} onClick={() => openRatingPage(visibleSpots[Math.floor(Math.random() * visibleSpots.length)])}>Beri aku ide <Icon src={arrowUpRightOutline} /></button>
                    <button type="button" onClick={loadSpots} disabled={loading}><Icon src={refreshOutline} /> Perbarui</button>
                  </div>
                </div>
                <div className="stat-strip">
                  <div>
                    <strong>{spots.length}</strong>
                    <span>Total spot</span>
                  </div>
                  <div>
                    <strong>{frontPageSpots.length}</strong>
                    <span>Recomend</span>
                  </div>
                  <div>
                    <strong>{avgScore}</strong>
                    <span>Rata-rata skor</span>
                  </div>
                </div>
                <div className="filter-bar">
                  <div className="search-box">
                    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="search"
                      placeholder="Cari nama, lokasi, atau tag..."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      aria-label="Cari spot"
                    />
                  </div>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    aria-label="Urutkan"
                  >
                    <option value="latest">Terbaru</option>
                    <option value="score">Skor tertinggi</option>
                    <option value="name">Nama A-Z</option>
                  </select>
                </div>
                <div className="category-chips" role="tablist">
                  {["all", ...categories].map((category) => (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === category}
                      className={activeCategory === category ? "active" : ""}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category === "all" ? "Semua" : category.split(",")[0]}
                    </button>
                  ))}
                </div>
                <div className="feed-summary"><h2>{page === "saved" ? "Spot tersimpan" : "Pilihan untuk dijelajahi"}</h2><span>{visibleSpots.length} spot</span></div>
                <div className="feed-scroll">
                  {!loading && visibleSpots.length === 0 && (
                    <div className="empty-state">
                      <span className="empty-symbol" aria-hidden="true">{page === "saved" ? "♡" : "⌕"}</span>
                      <h2>{page === "saved" && !savedSpots.length ? "Mulai koleksimu" : "Belum ada yang cocok"}</h2>
                      <p>{page === "saved" && !savedSpots.length ? "Ketuk Simpan pada tempat yang ingin kamu kunjungi." : "Coba kata kunci atau kategori lain."}</p>
                      <Button
                        className="fill-outline size-small"
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setActiveCategory("all");
                          if (page === "saved" && !savedSpots.length) setPage("dashboard");
                        }}
                      >
                        {page === "saved" && !savedSpots.length ? "Jelajahi spot" : "Reset filter"}
                      </Button>
                    </div>
                  )}
                  {visibleSpots.map((spot) => (
                    <SpotCard
                      key={spot.id}
                      spot={spot}
                      worthScore={worthScore}
                      isWorth={isWorth}
                      onOpen={openRatingPage}
                      saved={savedSpots.some(s => s.id === spot.id)}
                      onSave={toggleSave}
                      isOwner={ownsSpot(spot)}
                      onDelete={deleteSpot}
                      onUpdateLocation={updateLocation}
                      busy={busy}
                    />
                  ))}
                </div>
              </section>
              {selectedSpot && <SelectedSpotCard spot={selectedSpot} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
