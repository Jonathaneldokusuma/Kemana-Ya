import Icon from "./Icon";
import Button from "./Button";
import {
  addCircleOutline,
  helpCircleOutline,
  notificationsOutline,
  settingsOutline,
} from "../icons";
import logo from "../assets/logo.png";
export default function Header({
  title,
  onAdd,
  onNotifications,
  unreadNotifications = 0,
  showHelp,
  onSettings,
}) {
  // Header buat nampilin logo, judul, dan tombol aksi.
  return (
    <header className="site-header">
      <div className="toolbar">
        <div className="header-title">
          <div className="brand-title">
            <img src={logo} alt="KemanaYa logo" />
            <span>{title}</span>
          </div>
        </div>
        <div className="header-actions">
          {showHelp && (
            <Button
              aria-label="Bantuan"
              className="text-slate fill-clear"
              type="button"
            >
              <Icon
                src={helpCircleOutline}
              />
            </Button>
          )}
          {onAdd && (
            <Button
              aria-label="Tambah Spot"
              onClick={onAdd}
              className="text-slate fill-clear"
              type="button"
            >
              <Icon
                src={addCircleOutline}
              />
            </Button>
          )}
          {onNotifications && (
            <Button
              aria-label="Notifikasi"
              onClick={onNotifications}
              className="notif-button text-slate fill-clear"
              type="button"
            >
              <Icon
                src={notificationsOutline}
              />
              {unreadNotifications > 0 && (
                <span className="notification-badge">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          )}
          {onSettings && (
            <Button
              aria-label="Pengaturan"
              onClick={onSettings}
              className="text-slate fill-clear"
              type="button"
            >
              <Icon
                src={settingsOutline}
              />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
