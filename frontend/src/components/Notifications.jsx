import { useEffect, useState } from "react";

import API from "../services/api";

import toast from "react-hot-toast";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {

    try {

      const res = await API.get(

        "/notification/my",

        {
          headers: {

            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = Array.isArray(res.data)

        ? res.data

        : [];

      // CHECK NEW NOTIFICATIONS
      if (

        data.length > notifications.length
      ) {

        const latest = data[0];

        toast.success(

          latest.text
        );
      }

      setNotifications(data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchNotifications();

    // LIVE REFRESH EVERY 5 SEC
    const interval = setInterval(

      fetchNotifications,

      5000
    );

    return () => clearInterval(interval);

  }, [notifications.length]);

  return null;
}