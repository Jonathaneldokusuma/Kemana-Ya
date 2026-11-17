import { useEffect, useState } from "react";
import FormField from "../components/FormField";
import Tag from "../components/Tag";
import Button from "../components/Button";
import Icon from "../components/Icon";
import StatusMessage from "../components/StatusMessage";
import {
  albumsOutline,
  arrowBackOutline,
  businessOutline,
  cameraOutline,
  createOutline,
  eyeOutline,
  mapOutline,
  notificationsOutline,
  pricetagOutline,
  ribbonOutline,
  sparklesOutline,
  starOutline,
  trophyOutline,
} from "../icons";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import { api } from "../api";

const badgeIcons = {
  "local-guide": mapOutline,
  "photo-scout": cameraOutline,
  "trusted-rater": starOutline,
};
const profileFields = [
  ["name", "Nama"],
  ["title", "Title"],
  ["city", "Kota favorit"],
  ["category", "Kategori favorit"],
  ["challenge", "Catatan challenge pribadi"],
];

export default function ProfilePage({ user, onUpdate, onLogout }) {
  // Semua data profil, badge, dan aktivitas user ada di sini.
  const [message, setMessage] = useState("");
  const [syncError, setSyncError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSettings, setIsSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user);
  const [draft, setDraft] = useState(user);
  const [settings, setSettings] = useState(user.settings || {});

  // Refresh pas masuk, tiap 15 detik, dan pas user balik ke tab ini.
  // Lagi edit? Pause dulu biar draft nggak ketimpa data lama.
  useEffect(() => {
    if (busy || isEditing) return;
    const controller = new AbortController();
    let pending = false;
    const refresh = async () => {
      if (pending || document.visibilityState === "hidden") return;
      pending = true;
      setRefreshing(true);
      try {
        const saved = await api("/me", { signal: controller.signal });
        if (controller.signal.aborted) return;
        setProfile(saved);
        setSettings(saved.settings || {});
        onUpdate(saved);
        setSyncError("");
      } catch (error) {
        if (!controller.signal.aborted) setSyncError(error.message);
      } finally {
        pending = false;
        if (!controller.signal.aborted) setRefreshing(false);
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 15000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [busy, isEditing, onUpdate]);

  const applyProfile = (saved) => {
    // Update semua data profil setelah save berhasil.
    setProfile(saved);
    setSettings(saved.settings || {});
    onUpdate(saved);
  };
  const saveSettings = async (key, checked) => {
    // Toggle berubah, langsung simpan ke backend.
    if (busy) return;
    setBusy(true);
    setRefreshing(false);
    setMessage("");
    try {
      applyProfile(
        await api("/me", {
          method: "PATCH",
          body: { settings: { [key]: checked } },
        }),
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    setBusy(true);
    try {
      await onLogout();
    } catch (error) {
      setMessage(error.message);
      setBusy(false);
    }
  };
  const openEdit = () => {
    setDraft(profile);
    setIsEditing(true);
    setRefreshing(false);
    setIsSettings(false);
    setMessage("");
  };
  const saveProfile = async (event) => {
    // Stop submit bawaan browser, lalu kirim field profilnya.
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    const body = Object.fromEntries(
      profileFields.map(([key]) => [key, draft[key] || ""]),
    );
    try {
      applyProfile(await api("/me", { method: "PATCH", body }));
      setIsEditing(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const stats = [
    {
      label: "Ditemukan",
      value: profile.stats?.places ?? 0,
      icon: sparklesOutline,
    },
    {
      label: "Dirating",
      value: profile.stats?.ratings ?? 0,
      icon: starOutline,
    },
    { label: "Badge", value: profile.stats?.badges ?? 0, icon: ribbonOutline },
  ];
  const preferences = [
    { icon: businessOutline, title: "Kota favorit", value: profile.city },
    {
      icon: pricetagOutline,
      title: "Kategori favorit",
      value: profile.category,
    },
    {
      icon: trophyOutline,
      title: "Catatan challenge pribadi",
      value: profile.challenge,
    },
  ];
  const progress = profile.challengeProgress;
  const badges = profile.badges || [];
  const activities = profile.activities || [];

  return (
    <div className="page">
      <Header
        title="Profile"
        onSettings={() => {
          setIsSettings(true);
          setIsEditing(false);
        }}
      />
      <div className="page-content profile-page">
        {isSettings ? (
          <main className="settings-shell">
            <button
              className="back-link"
              type="button"
              onClick={() => setIsSettings(false)}
            >
              <Icon src={arrowBackOutline} />
              Kembali ke profile
            </button>
            <section className="content-card">
              <p className="eyebrow">Settings</p>
              <h1>Pengaturan akun</h1>
              {(message || syncError) && (
                <StatusMessage className="color-danger">
                  {message || syncError}
                </StatusMessage>
              )}
              <p>Preferensi akun tersimpan otomatis.</p>
              <div className="settings-grid">
                {[
                  [
                    "pushRecomend",
                    notificationsOutline,
                    "Notifikasi Recomend",
                    "Simpan preferensi notifikasi. Pengiriman push belum tersedia.",
                  ],
                  [
                    "publicProfile",
                    eyeOutline,
                    "Profile publik",
                    "Simpan preferensi privasi. Halaman profil publik belum tersedia.",
                  ],
                  [
                    "compactFeed",
                    albumsOutline,
                    "Feed compact",
                    "Simpan preferensi tampilan. Mode compact belum tersedia.",
                  ],
                ].map(([key, icon, title, text]) => (
                  <div className="settings-card" key={key}>
                    <div>
                      <div className="settings-icon">
                        <Icon src={icon} />
                      </div>
                      <div>
                        <h2>{title}</h2>
                        <p>{text}</p>
                      </div>
                    </div>
                    <input
                      disabled={busy}
                      checked={!!settings[key]}
                      onChange={(event) =>
                        saveSettings(key, event.target.checked)
                      }
                      className="toggle"
                      type="checkbox"
                      role="switch"
                      aria-label={title}
                    />
                  </div>
                ))}
              </div>
              <Button disabled={busy} onClick={logout} className="fill-outline">
                Keluar akun
              </Button>
            </section>
          </main>
        ) : (
          <main className="profile-shell">
            {(message || syncError) && (
              <StatusMessage className="color-danger">
                {message || syncError}
              </StatusMessage>
            )}
            <section className="profile-hero">
              <div className="profile-head">
                <div>
                  <img src={logo} alt="KemanaYa logo" />
                  <span>Lv. {profile.level ?? 1}</span>
                </div>
                <div>
                  <p>Explorer Profile</p>
                  <h1>{profile.name}</h1>
                  <small>{profile.title || "Explorer baru"}</small>
                  <p className="profile-email">{profile.email}</p>
                </div>
              </div>
              <div className="progress-box">
                <div>
                  <span>
                    {progress?.label ||
                      "Rating foto dan tempat pada 3 spot dalam 7 hari terakhir"}
                  </span>
                  <span>
                    {progress?.completed ?? 0}/{progress?.target ?? 3} spot
                  </span>
                </div>
                <progress
                  className="challenge-progress"
                  aria-label="Progress challenge"
                  max={progress?.target ?? 3}
                  value={progress?.completed ?? 0}
                />
              </div>
              <div className="chip-row">
                {badges.map((badge) => (
                  <Tag key={badge.key} className="color-light">
                    <Icon src={badgeIcons[badge.key] || ribbonOutline} />
                    {badge.label}
                  </Tag>
                ))}
              </div>
            </section>
            <div className="profile-content">
              <p className="profile-sync">
                {isEditing
                  ? "Pembaruan otomatis dijeda selama mengedit."
                  : refreshing
                    ? "Memperbarui profil..."
                    : "Data akun diperbarui otomatis setiap 15 detik."}
              </p>
              <section className="stats-grid profile-stats">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <Icon src={stat.icon} />
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </section>
              <section className="content-card pref-card">
                <div className="card-head">
                  <div>
                    <p className="eyebrow">Preferensi</p>
                    <h2>Jelajah favorit</h2>
                  </div>
                  <Button
                    disabled={busy}
                    onClick={openEdit}
                    className="edit-action fill-outline size-small"
                  >
                    <Icon src={createOutline} />
                    Edit
                  </Button>
                </div>
                <div className="preference-list">
                  {preferences.map((item) => (
                    <div key={item.title} className="form-item">
                      <Icon src={item.icon} />
                      <div className="preference-copy">
                        <h2>{item.title}</h2>
                        <p>{item.value || "Belum diisi"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {isEditing && (
                <section className="content-card">
                  <p className="eyebrow">Edit Profile</p>
                  <h2>Edit profile</h2>
                  <form className="form-grid" onSubmit={saveProfile}>
                    {profileFields.map(([key, label]) => (
                      <FormField key={key} label={label}>
                        <input
                          required={key === "name"}
                          maxLength={key === "name" ? 100 : 255}
                          value={draft[key] || ""}
                          onChange={(event) =>
                            setDraft({ ...draft, [key]: event.target.value })
                          }
                          className="form-input"
                        />
                      </FormField>
                    ))}
                    <div className="two-actions">
                      <Button
                        disabled={busy}
                        onClick={() => setIsEditing(false)}
                        className="fill-outline expand-block"
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={busy}
                        type="submit"
                        className="expand-block color-secondary"
                      >
                        {busy ? "Menyimpan..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </section>
              )}
              <section className="profile-bottom">
                <div className="content-card">
                  <p className="eyebrow">Badge</p>
                  <h2>Achievement</h2>
                  {badges.length === 0 && (
                    <StatusMessage>
                      Belum ada badge. Bagikan tempat pertamamu untuk mendapat
                      Local Guide.
                    </StatusMessage>
                  )}
                  {badges.map((badge) => (
                    <div className="badge-row" key={badge.key}>
                      <div>
                        <Icon src={badgeIcons[badge.key] || ribbonOutline} />
                      </div>
                      <section>
                        <strong>{badge.label}</strong>
                        <p>{badge.description}</p>
                      </section>
                    </div>
                  ))}
                  <p className="badge-rules">
                    Photo Scout: rating foto 5 spot. Trusted Rater: rating foto
                    dan tempat 5 spot. Level bertambah setiap 5 kontribusi
                    berupa upload atau rating lengkap.
                  </p>
                </div>
                <div className="content-card">
                  <p className="eyebrow">Aktivitas</p>
                  <h2>Terbaru</h2>
                  {activities.length === 0 && (
                    <StatusMessage>
                      Belum ada aktivitas. Mulai dengan menambahkan atau memberi
                      rating tempat.
                    </StatusMessage>
                  )}
                  {activities.map((activity) => (
                    <div className="activity-row" key={activity.id}>
                      <h3>{activity.title}</h3>
                      <p>{activity.meta}</p>
                      <time dateTime={activity.occurredAt}>
                        {new Date(activity.occurredAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
