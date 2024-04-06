"use client";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import EventDialog from "./EventDialog";
import { useEffect } from "react";
import "@googlemaps/extended-component-library/place_picker.js";
import { PlacePicker } from "@googlemaps/extended-component-library/react";
import { Row } from "react-bootstrap";

// Have default "Home" position set by the user on their account

function GoogleMapsComponent() {
  const positions = [
    { lat: 53.54, lng: 10 },
    { lat: 54, lng: 10 },
    // Add more positions here as needed
  ];
  const [events, setEvents] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchMapEventData(); // Fetch event data to populate map when component mounts
  }, []);

  // Function to fetch event data from the backend API
  const fetchMapEventData = async () => {
    try {
      const response = await fetch("http://localhost:8000/eventcoords/");
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      const eventDataForMap = await response.json();
      const parsedEventData = JSON.parse(eventDataForMap); // Parse the JSON string
      setEvents(parsedEventData); // Set the events state with the parsed data
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
  };

  // Convert all event location into a position longitude and latitude using geocoder so that I can place them

  return (
    <APIProvider apiKey="AIzaSyAfwuhpEPloICBoNSQKGBBEYVJzAYqyzYU">
      <Row>
        <PlacePicker onPlaceChanged={handleLocationChange} />
      </Row>

      <div style={{ height: "100vh" }}>
        <Map
          defaultZoom={9}
          defaultCenter={selectedLocation || { lat: 53.54, lng: 10 }} // Use selectedLocation if available, otherwise fallback to default position
          mapId={"da1539bfad046c08"}
        >
          {events.map((event, index) => (
            <EventMarkers
              key={index}
              position={{
                lat: parseFloat(event.latitude),
                lng: parseFloat(event.longitude),
              }}
              event={event}
            />
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}

function EventMarkers({ position, event }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <AdvancedMarker position={position} onClick={() => setOpen(true)}>
        <Pin />
      </AdvancedMarker>

      {open && (
        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
          <h3>{event.input_name}</h3>
          <p>{event.input_description}</p>
          <EventDialog />
        </InfoWindow>
      )}
    </div>
  );
}

export default GoogleMapsComponent;
