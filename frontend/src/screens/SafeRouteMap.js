import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const ORS_API_KEY = "5b3ce3597851110001cf624893af3427104c442f9bb1320ff095ef84";

function ClickHandler({ setCoords }) {
  useMapEvents({
    click(e) {
      setCoords([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

export default function SafeRouteMap() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState(null);

  const fetchRoute = async () => {
    if (!start || !end) return;

    try {
      const res = await axios.post(
        `https://api.openrouteservice.org/v2/directions/foot-walking/geojson`,
        {
          coordinates: [start.reverse(), end.reverse()],
        },
        {
          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      setRoute(res.data.features[0].geometry.coordinates.map(c => [c[1], c[0]]));
    } catch (error) {
      console.error("Errore nel calcolo del percorso:", error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [start, end]);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Percorso Sicuro</h2>
      <MapContainer center={[45.5, 9.2]} zoom={13} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler setCoords={coord => !start ? setStart(coord) : setEnd(coord)} />
        {start && <Marker position={start} />}
        {end && <Marker position={end} />}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <p>Clicca due punti sulla mappa: il primo è la partenza, il secondo l'arrivo.</p>
        <button onClick={() => { setStart(null); setEnd(null); setRoute(null); }}>
          Resetta
        </button>
      </div>
    </div>
  );
}
