import StatusMessage from "../components/StatusMessage";
import Icon from "../components/Icon";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { useState } from "react";
import {
  businessOutline,
  compassOutline,
  lockClosedOutline,
  mailOutline,
  personAddOutline,
  personOutline,
} from "../icons";
import Header from "../components/Header";
import logo from "../assets/logo.png";
import { api } from "../api";
export default function LoginPage({ onAuthenticated }) {
  // Login dan daftar akun kita gabung di halaman ini.
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    city: "",
    password: "",
  });
  const updateLogin = (key, value) =>
    setLoginForm((form) => ({
      ...form,
      [key]: value,
    }));
  const updateRegister = (key, value) =>
    setRegisterForm((form) => ({
      ...form,
      [key]: value,
    }));
  const authenticate = async (kind) => {
    // Jangan kirim request lagi kalau yang sebelumnya belum selesai.
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      onAuthenticated(
        await api(`/auth/${kind}`, {
          method: "POST",
          body: kind === "register" ? registerForm : loginForm,
        }),
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };
  const register = () => {
    // Cek data wajib dulu sebelum daftar akun.
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setMessage("Nama, email, dan password wajib diisi.");
      return;
    }
    authenticate("register");
  };
  return (
    <div className="page">
      <Header title="KemanaYa" showHelp />
      <div className="page-content login-page">
        <main className="login-shell">
          <section className="login-copy">
            <div className="brand-pill">
              <img src={logo} alt="KemanaYa logo" />
              <span>KemanaYa</span>
            </div>
            <p className="eyebrow">Social exploration app</p>
            <h1>Temukan spot seru yang benar-benar worth it.</h1>
            <p>
              Scroll tempat baru, rating foto dan lokasi, lalu bantu spot
              terbaik masuk Recomend.
            </p>
            <div className="metric-grid">
              <div>
                <strong>4.8</strong>
                <span>Avg worth score</span>
              </div>
              <div>
                <strong>120+</strong>
                <span>Spot komunitas</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>Recomend update</span>
              </div>
            </div>
          </section>

          <section className="auth-card">
            <div className="auth-tabs">
              <button
                className={mode === "login" ? "active" : ""}
                type="button"
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={mode === "register" ? "active" : ""}
                type="button"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>
            <h2>{mode === "login" ? "Masuk Explorer" : "Buat akun baru"}</h2>
            <p>
              {mode === "login"
                ? "Lanjutkan perjalanan KemanaYa"
                : "Gabung dan mulai rating spot favoritmu"}
            </p>

            {mode === "login" ? (
              <div className="form-grid">
                <FormField label="Email" icon={mailOutline}>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      updateLogin("email", event.target.value || "")
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Password" icon={lockClosedOutline}>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      updateLogin("password", event.target.value || "")
                    }
                    className="form-input"
                  />
                </FormField>
                <Button
                  disabled={busy}
                  onClick={() => authenticate("login")}
                  className="expand-block"
                  type="button"
                >
                  <Icon
                    src={compassOutline}
                  />
                  {busy ? "Memproses..." : "Masuk Dashboard"}
                </Button>
                <Button
                  onClick={() => {
                    setMessage("");
                    setMode("register");
                  }}
                  className="fill-clear expand-block"
                  type="button"
                >
                  Buat akun baru
                </Button>
              </div>
            ) : (
              <div className="form-grid">
                <FormField label="Nama" icon={personOutline}>
                  <input
                    value={registerForm.name}
                    onChange={(event) =>
                      updateRegister("name", event.target.value || "")
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Email" icon={mailOutline}>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) =>
                      updateRegister("email", event.target.value || "")
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Kota favorit" icon={businessOutline}>
                  <input
                    value={registerForm.city}
                    onChange={(event) =>
                      updateRegister("city", event.target.value || "")
                    }
                    className="form-input"
                  />
                </FormField>
                <FormField label="Password" icon={lockClosedOutline}>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(event) =>
                      updateRegister("password", event.target.value || "")
                    }
                    className="form-input"
                  />
                </FormField>
                <Button
                  disabled={busy}
                  onClick={register}
                  className="expand-block color-secondary"
                  type="button"
                >
                  <Icon
                    src={personAddOutline}
                  />
                  {busy ? "Memproses..." : "Register & Masuk"}
                </Button>
                <Button
                  onClick={() => setMode("login")}
                  className="fill-clear expand-block"
                  type="button"
                >
                  Sudah punya akun
                </Button>
              </div>
            )}
            {message && (
              <StatusMessage role="alert" className="color-danger">
                {message}
              </StatusMessage>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
