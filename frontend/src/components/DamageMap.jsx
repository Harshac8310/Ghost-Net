
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import "./DamageMap.css";

const DEFAULT_CENTER = [12.9716, 77.5946];

function getMarkerColor(status = "") {
  const value = status.toLowerCase();

  if (value.includes("dismiss")) return "#b99aff";
  if (value.includes("inspect")) return "#ff789b";
  if (value.includes("resolv") || value.includes("verif")) return "#b7a0ff";

  return "#45d5ff";
}

function MapClickHandler({ enabled, onLocationSelect }) {
  useMapEvents({
    click(event) {
      if (!enabled || typeof onLocationSelect !== "function") return;

      onLocationSelect({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

export default function DamageMap({
  reports = [],
  selectable = false,
  selectedPosition = null,
  onLocationSelect,
  height = 360,
}) {
  const validReports = reports.filter(
    (report) =>
      report.latitude !== null &&
      report.latitude !== undefined &&
      report.longitude !== null &&
      report.longitude !== undefined &&
      Number.isFinite(Number(report.latitude)) &&
      Number.isFinite(Number(report.longitude)) &&
      Number(report.latitude) >= -90 &&
      Number(report.latitude) <= 90 &&
      Number(report.longitude) >= -180 &&
      Number(report.longitude) <= 180
  );

  const center = selectedPosition
    ? [selectedPosition.latitude, selectedPosition.longitude]
    : DEFAULT_CENTER;

  return (
    <div
      className={`damage-map-shell ${selectable ? "map-selectable" : ""}`}
      style={{ height: `${height}px` }}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="damage-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler
          enabled={selectable}
          onLocationSelect={onLocationSelect}
        />

        {validReports.map((report) => {
          const latitude = Number(report.latitude);
          const longitude = Number(report.longitude);
          const color = getMarkerColor(report.status);

          return (
            <CircleMarker
              key={report.id}
              center={[latitude, longitude]}
              radius={8}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div className="damage-map-popup">
                  <strong>{report.id || "Road report"}</strong>

                  <p>{report.location || "Road location"}</p>

                  <span>{report.damage || "Analysis unavailable"}</span>

                  <p className="map-popup-status">
                    Status: {report.status || "Pending review"}
                  </p>

                  {report.isDemo && (
                    <small>DEMO COORDINATES — NOT A VERIFIED INCIDENT</small>
                  )}

                  <small>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </small>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {selectedPosition && (
          <CircleMarker
            center={[
              selectedPosition.latitude,
              selectedPosition.longitude,
            ]}
            radius={10}
            pathOptions={{
              color: "#b99aff",
              fillColor: "#45d5ff",
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>
              <div className="damage-map-popup">
                <strong>Selected road location</strong>
                <p>
                  Latitude: {selectedPosition.latitude.toFixed(6)}
                </p>
                <p>
                  Longitude: {selectedPosition.longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="damage-map-legend">
        <span><i className="legend-blue" /> Reports</span>
        {selectable && <span><i className="legend-purple" /> Selected point</span>}
        <span className="map-coordinate-label">
          {validReports.length} mapped report{validReports.length === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
