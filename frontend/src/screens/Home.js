
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import L from 'leaflet';

export default function Home() {
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/map/risks')
      .then(res => setRisks(res.data))
      .catch(err => console.error(err));
  }, []);

  const getColor = (count) => {
    if (count > 10) return 'darkred';
    if (count > 6) return 'red';
    if (count > 3) return 'orange';
    if (count > 1) return 'yellow';
    return 'green';
  };

  const getIcon = (color) => {
    return L.divIcon({
      className: 'custom-icon',
      html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;"></div>`,
    });
  };

  // Raggruppa per coordinate
  const grouped = risks.reduce((acc, item) => {
    const key = `${item.location.lat},${item.location.lng}`;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div>
      <MapContainer center={[45.5, 9.2]} zoom={13} style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {Object.entries(grouped).map(([key, items], i) => {
            const [lat, lng] = key.split(',').map(Number);
            const color = getColor(items.length);
            return (
              <Marker key={i} position={[lat, lng]} icon={getIcon(color)}>
                <Popup>
                  <strong>{items.length} segnalazioni</strong><br />
                  {items.map((r, i) => (
                    <div key={i}>
                      <b>{r.type}</b> ({r.time})<br />
                      <em>{r.description}</em><hr />
                    </div>
                  ))}
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
      <Link to="/report"><button style={{ marginTop: 10 }}>Segnala Rischio</button></Link>
      <Link to="/privacy"><button style={{ marginTop: 10 }}>Privacy</button></Link>
    </div>
  );
}
