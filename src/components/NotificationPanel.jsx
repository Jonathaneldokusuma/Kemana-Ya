import Button from "./Button";
import StatusMessage from "./StatusMessage";

export default function NotificationPanel({ notifications, onClose }) {
  // Panel ini buat nampilin notifikasi terbaru.
  return (
    <section className="notification-panel" aria-label="Notifikasi">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Notifikasi</p>
          <h2>Aktivitas terbaru</h2>
        </div>
        <Button className="fill-clear size-small" onClick={onClose}>
          Tutup
        </Button>
      </div>
      <div className="notice-list">
        {notifications.length === 0 && (
          <StatusMessage>Belum ada notifikasi.</StatusMessage>
        )}
        {notifications.map((notification, index) => (
          <div className="notice-card" key={`${notification.title}-${index}`}>
            <div>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
            </div>
            <span>{notification.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
