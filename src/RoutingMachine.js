import 'leaflet-routing-machine';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function RoutingMachine({ from, to, setDistance }) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null,
      show: false,
    }).addTo(map);

    routingControl.on('routesfound', function (e) {
      const route = e.routes[0];
      if (route && route.summary) {
        const distanceMeters = route.summary.totalDistance;
        const distanceKm = (distanceMeters / 1000).toFixed(2);
        setDistance(`${distanceKm} km`);
      } else {
        setDistance('No route found');
      }
    });

    routingControl.on('routingerror', function () {
      setDistance('Error calculating route');
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [from, to, map, setDistance]);

  return null;
}

export default RoutingMachine;



