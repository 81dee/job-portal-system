import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { getStoredToken } from "../hooks/useAuth";

export default function Notifications({ showPanel = false }) {
  const [notifications, setNotifications] = useState([]);
  const prevCount = useRef(0);
  const token = getStoredToken();

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!token || !active) return;
      try {
        const res = await API.get("/notification/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        if (!active) return;
        if (data.length > prevCount.current && data[0]?.text) {
          toast.success(data[0].text);
        }
        prevCount.current = data.length;
        setNotifications(data);
      } catch (error) {
        console.log(error);
      }
    };
    void load();
    const interval = setInterval(load, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [token]);

  if (!showPanel) return null;

  return (
    <section className="notifications-panel" aria-label="Notifications">
      <h3>Recent notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <div key={n._id} className="notification-item">
            {n.text}
          </div>
        ))
      ) : (
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
          No notifications yet.
        </p>
      )}
    </section>
  );
}
