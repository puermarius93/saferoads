
import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Report() {
  const [form, setForm] = useState({ type: '', lat: '', lng: '', time: '', description: '' });

  function LocationPicker() {
    useMapEvents({
      click(e) {
        setForm({ ...form, lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
      }
    });
    return form.lat && form.lng ? (
      <Marker position={[form.lat, form.lng]} />
    ) : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/report', {
      type: form.type,
      location: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
      time: form.time,
      description: form.description
    });
    alert('Segnalazione inviata');
  };

  return (
    <>
      <MapContainer center={[45.5, 9.2]} zoom={13} style={{ height: '40vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker />
      </MapContainer>
      <form onSubmit={handleSubmit}>
        <h2>Segnala un rischio</h2>
        <input placeholder="Tipo (rapina, furto...)" onChange={e => setForm({ ...form, type: e.target.value })} required />
        <input placeholder="Ora (es. 23:30)" onChange={e => setForm({ ...form, time: e.target.value })} required />
        <input placeholder="Descrizione" onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Latitudine" value={form.lat} readOnly />
        <input placeholder="Longitudine" value={form.lng} readOnly />
        <button type="submit">Invia</button>
      </form>
    </>
  );
}
