import Icon from "./components/Icon";
import { useEffect, useState } from "react";
import { api, session } from "./api";
import { addCircleOutline, compassOutline, personCircleOutline, heartOutline } from "./icons";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
export default function App() {
  // Cek dulu user lagi di halaman mana.
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Kalau sesi invalid, lempar balik ke login.
    const reset = () => {
      setUser(null);
      setPage("login");
    };
    window.addEventListener("kemanaya:unauthorized", reset);
    if (session.get())
      api("/me")
        .then((account) => {
          setUser(account);
          setPage("dashboard");
        })
        .catch(reset);
    return () => window.removeEventListener("kemanaya:unauthorized", reset);
  }, []);
  const onAuthenticated = (account) => {
    // Simpan token biar user nggak login ulang terus.
    session.set(account.token);
    setUser(account.user);
    setPage("dashboard");
  };
  const logout = async () => {
    // Logout dari backend, baru bersihin sesi lokal.
    await api("/auth/logout", {
      method: "POST",
    });
    session.clear();
    setUser(null);
    setPage("login");
  };
  if (page === "login") {
    return (
      <div className="app">
        <LoginPage onAuthenticated={onAuthenticated} />
      </div>
    );
  }
  return (
    <div className="app">
      {page === "profile" ? (
        <ProfilePage user={user} onUpdate={setUser} onLogout={logout} />
      ) : (
        <DashboardPage key={user?.id} user={user} page={page} setPage={setPage} />
      )}
      <nav className="app-tab-bar" aria-label="Navigasi utama">
        <button
          className={page === "dashboard" ? "active" : ""}
          type="button"
          onClick={() => setPage("dashboard")}
        >
          <Icon src={compassOutline} />
          <span>Jelajah</span>
        </button>
        <button
          className={page === "add" ? "active" : ""}
          type="button"
          onClick={() => setPage("add")}
        >
          <Icon src={addCircleOutline} />
          <span>Tambah</span>
        </button>
        <button className={page === "saved" ? "active" : ""} type="button" onClick={() => setPage("saved")}>
          <Icon src={heartOutline} />
          <span>Tersimpan</span>
        </button>
        <button
          className={page === "profile" ? "active" : ""}
          type="button"
          onClick={() => setPage("profile")}
        >
          <Icon
            src={personCircleOutline}
          />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
