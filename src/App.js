import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css"
import { formatRelative } from "date-fns";
import { es } from "date-fns/esm/locale";
import mapStyles from "./mapStyles";


const libraries = ["places"];
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

function App() {

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
  }, []);

  const panTo = useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng});
    mapRef.current.setZoom(14);
  },[]);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps...";

  return (
    <div>
      <Search panTo={panTo} />
      <Locate panTo={panTo} />
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

function Locate({panTo}) {
  return (
    <button className="locate" onClick={() => {
      navigator.geolocation.getCurrentPosition((position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
       },error => console.error);
    }}>
      <img src="compass.svg" alt="compass - locate me"/>
    </button>
  );
}

function Search({panTo}) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => -36.140890, lng: () => -71.826810 },
      radius: 200 * 1000
    }
  })

  return (
    <div className="search">
      <Combobox onSelect={ async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
          const results = await getGeocode({address});
          const { lat, lng } = await getLatLng(results[0]);
          panTo({lat, lng});
        } catch (error) {
          console.log("Error: ", error);
        }
      }}>
      <ComboboxInput value={value} onChange={(e) => {
        setValue(e.target.value);
      }}
      disabled={!ready}
      placeholder="Ingresa una dirección" />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

export default App;
