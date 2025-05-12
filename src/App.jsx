import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './App.css'; // Add your basic styles here
import Routing from './RoutingMachine'; // Custom component for routing
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const defaultCenter = [28.6139, 77.2090]; // New Delhi

function App() {
  const [distance,setDistance]=useState();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [origin,setOrigin] = useState("");  
  const [destination,setDestination] = useState("");
  const [bool,setBool]=useState(true);

  const handleSearch = async () => {
    const geocode = async (place) => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    };
     if(bool){
    const fromCoords = await geocode(origin);
    setFrom(fromCoords);
     }
    const toCoords = await geocode(destination);
    setTo(toCoords);
    setBool(true);

          
  };
  
          
     
  const handleUseMyLocation = () => {
        
    setBool(false);
    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setFrom({
                  lat: position.coords.latitude,
                 lng: position.coords.longitude,
               });
              alert("GKT");
              setOrigin("My current");
            },
              (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location.');
              }
          );
          } else {
            alert('Geolocation is not supported by your browser.');
          }
         
          
       }
  return (
    <div style={{ overflow:"hidden" }}>
      <div className="search-bar">
        <input type="text" value={origin} placeholder="From" onChange={(e)=>{setOrigin(e.target.value)}} />
        <input type="text" value={destination} placeholder="To" onChange={(e)=>{setDestination(e.target.value)}} />
        <button onClick={handleSearch}>Show Route</button>
        <button onClick={handleUseMyLocation}>use my current location</button>
        <div>{distance}</div>
      </div>

      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {from && <Marker position={from} icon={redIcon} />}
        {to && <Marker position={to} icon={yellowIcon} />}
        {from && to && <Routing from={from} to={to} setDistance={setDistance}/>}
      </MapContainer>
    </div>
  );
}

export default App;








