import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const ORS_API_KEY = "5b3ce3597851110001cf624893af3427104c442f9bb1320ff095ef84";

export default function SafeRouteMap() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState("foot-walking");
  const [route, setRoute] = useState([]);
  const [startCoord, setStartCoord] = useState(null);
  const [endCoord, setEndCoord] = useState(null);

  const getCoordinates = async (query) => {
    const res = await axios.get(`https://api.openrouteservice.org/geocode/search`, {
      params: {
        api_key: ORS_API_KEY,
        text: query,
        size: 1
      }
    });
    return res.data.features[0].geometry.coordinates.reverse();
  };

  const handleRoute = async () => {
    if (!start || !end) return;

    try {
      const coordStart = await getCoordinates(start);
      const coordEnd = await getCoordinates(end);
      setStartCoord(coordStart);
      setEndCoord(coordEnd);

      const res = await axios.post(
        `https://api.openrouteservice.org/v2/directions/${mode}/geojson`,
        {
          coordinates: [coordStart.slice().reverse(), coordEnd.slice().reverse()]
        },
        {
          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      const coords = res.data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
      setRoute(coords);
    } catch (error) {
      console.error("Errore nel calcolo del percorso:", error);
      alert("Errore durante il calcolo. Controlla gli indirizzi.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Percorso Sicuro</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Partenza (es. Via Roma, Milano)"
          value={start}
          onChange={e => setStart(e.target.value)}
          style={{ marginRight: 10, width: "40%" }}
        />
        <input
          type="text"
          placeholder="Destinazione (es. Duomo, Milano)"
          value={end}
          onChange={e => setEnd(e.target.value)}
          style={{ marginRight: 10, width: "40%" }}
        />
        <select value={mode} onChange={e => setMode(e.target.value)} style={{ marginRight: 10 }}>
          <option value="foot-walking">A piedi</option>
          <option value="cycling-regular">Bicicletta</option>
          <option value="driving-car">Auto</option>
        </select>
        <button onClick={handleRoute}>Calcola</button>
      </div>
      <MapContainer center={[45.5, 9.2]} zoom={13} style={{ height: "75vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startCoord && <Marker position={startCoord} />}
        {endCoord && <Marker position={endCoord} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}
