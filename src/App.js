import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import { es } from "date-fns/esm/locale";
import mapStyles from "./mapStyles";
const libraries = ["places"];

function App() {

  const mapContainerStyle = {
    width: '100vw',
    height: '100vh',
  };
  const center = {
    lat: -36.140890,
    lng: -71.826810,
  }
  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const onMapClick = useCallback((event) => {
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }]);
  }, []);
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, [])

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <div>
      <h1>Pumas {" "}
        <span role="img" aria-label="campamento">🏕</span><span role="img" aria-label="puma">🐈</span>
      </h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}>
          {markers.map(marker => (
            <Marker
              key={marker.time.toISOString()}
              position={{lat: marker.lat, lng: marker.lng}}
              icon={{
                url: "/puma.svg",
                scaledSize: new window.google.maps.Size(50,50),
                origin: new window.google.maps.Point(0,0),
                anchor: new window.google.maps.Point(25,25),
              }}
              onClick={() => {
                setSelected(marker);
              }} />)
          )}
          {selected ? (<InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
            <div>
              <h2>Puma encontrado!</h2>
              <p>Encontrado a las {formatRelative(selected.time, new Date(), {locale: es})}</p>
            </div>
          </InfoWindow>) : null}
      </GoogleMap>
    </div>
  );
}

export default App;
