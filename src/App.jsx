import React, { useEffect, useRef, useState } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import bikeImg from './assets/caric.png';

import 'leaflet/dist/leaflet.css';
import './App.css'; // Add your basic styles here
import Routing from './RoutingMachine'; // Custom component for routing
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [45, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const bikeIcon = new L.Icon({
  iconUrl: bikeImg,
  iconSize: [70, 70],       // Adjust size if needed
  iconAnchor: [20, 40],     // Anchor should match iconSize / 2 for center bottom
  popupAnchor: [0, -40],
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



function App() {
  const trackingInterval = useRef(null);
  const [defaultCenter, setDefaultCenter] = useState([51.507351, -0.127758]);
  const [distance, setDistance] = useState();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [bool, setBool] = useState(false);
  const [center, setCenter] = useState(true);









  const handleSearch = async () => {
    const geocode = async (place) => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    };

    if (origin != "My current") {
      const fromCoords = await geocode(origin);
      setFrom(fromCoords);
    }

    
     if(origin!="My current"){
    const fromCoords = await geocode(origin);
    setFrom(fromCoords);
     }
     
    const toCoords = await geocode(destination);
    setTo(toCoords);
    setBool(true);


  };

  useEffect(() => {


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFrom({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setOrigin("My current");
          setDefaultCenter([position.coords.latitude, position.coords.longitude]);




        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location.');
        })
    }

  }, [])


      const geocode = async (place) => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    };
  const trackBikeLocation = async () => {

    const toCoords = await geocode(destination);
    setTo(toCoords);
    trackingInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setFrom({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setOrigin("My current");



          console.log("Bike location updated");
        },
        (error) => {
          console.error("Error getting location during tracking:", error);
        }
      );
    }, 15000);

  };

  const stopBikeLocation = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      trackingInterval.current = null;
      console.log("Bike location tracking stopped");
    }
  };


  
     
 
  return (
    <div style={{ overflow: "hidden" }}>
      <div className="search-bar">
        <input type="text" value={origin} placeholder="From" onChange={(e) => { setOrigin(e.target.value) }} />
        <input type="text" value={destination} placeholder="To" onChange={(e) => { setDestination(e.target.value) }} />
        <button onClick={handleSearch}>Show Route</button>

        <button onClick={trackBikeLocation}>Track Bike Location</button>
        <button onClick={stopBikeLocation}>stop Bike Location</button>
       
        <button onClick={trackBikeLocation}>Track Bike Location</button>
        <button onClick={stopBikeLocation}>stop Bike Location</button>
        <div>{distance}</div>
      </div>




      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100vh', width: '100%' }}


      >



      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100vh', width: '100%' }}
      
        
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {from && <Marker position={from} icon={bikeIcon} />}
        {to && <Marker position={to} icon={yellowIcon} />}
        {from && to && <Routing from={from} to={to} setDistance={setDistance} />}
      </MapContainer>
    </div>
  );
}

export default App;
