import { useEffect } from "react";
import { io } from "socket.io-client";
import L from "leaflet";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Update this if necessary

const MapComponent = ({ username }) => {
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    let map; // Declare map here

    // Check if the map is already initialized
    if (!L.DomUtil.get("map")._leaflet_id) {
      map = L.map("map").setView([51.505, -0.09], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    }

    const markers = {};

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Emit user's name and location to the server
          socket.emit("send-location", { name: username, latitude, longitude });

          // Center the map on the user's location
          map.setView([latitude, longitude], 4);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 3000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    socket.on("all-locations", (locations) => {
      Object.values(locations).forEach(({ id, name, latitude, longitude }) => {
        if (latitude && longitude && !markers[id]) {
          markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindTooltip(name, { permanent: true, direction: "top" })
            .openTooltip();
        }
      });
    });

    socket.on("receive-location", (data) => {
      const { id, name, latitude, longitude } = data;
      if (latitude && longitude) {
        if (markers[id]) {
          markers[id].setLatLng([latitude, longitude]);
        } else {
          markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindTooltip(name, { permanent: true, direction: "top" })
            .openTooltip();
        }
      }
    });

    socket.on("user-disconnected", (id) => {
      if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  return (
    <>
      <div className="w-100% h-100% " id="map"></div>
    </>
  );
};

export default MapComponent;
