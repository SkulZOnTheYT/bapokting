import React, { useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "/images/marker.png",
  iconSize: [35, 35],
  iconAnchor: [17, 34],
  popupAnchor: [0, -28],
});

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  React.useEffect(() => {
    if (!positions.length) return;
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [positions, map]);
  return null;
}

export default function MapPage() {
  const { props } = usePage();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pasars = (props.pasars || []) as {
    id: number;
    nama: string;
    alamat: string;
    latitude: string | number;
    longitude: string | number;
    gambar?: string;
    url_harga?: string;
  }[];

  const defaultCenter: [number, number] = [-5.11163293, 105.29537201];
  const zoom = 13;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPasar, setSelectedPasar] = useState<any | null>(null);

  const positions = useMemo(() => {
    return pasars
      .map((p) => {
        const lat = parseFloat(String(p.latitude || ""));
        const lng = parseFloat(String(p.longitude || ""));
        if (isNaN(lat) || isNaN(lng)) return null;
        return [lat, lng] as [number, number];
      })
      .filter(Boolean) as [number, number][];
  }, [pasars]);

  return (
    <div className="p-6 relative">
      <Head title="Peta Pasar" />
      <h1 className="text-2xl font-bold mb-4">🗺️ Peta Seluruh Pasar — Kota Metro</h1>

      <div className="rounded-lg overflow-hidden border relative" style={{ height: "85vh" }}>
        {/* MAP */}
        <MapContainer center={defaultCenter} zoom={zoom} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
          />
          {positions.length > 0 && <FitBounds positions={positions} />}

          {pasars.map((p) => {
            const lat = parseFloat(String(p.latitude || ""));
            const lng = parseFloat(String(p.longitude || ""));
            if (isNaN(lat) || isNaN(lng)) return null;
            return (
              <Marker key={p.id} position={[lat, lng]} icon={markerIcon}>
                <Popup>
                  <div className="text-sm">
                    {p.gambar && (
                      <img
                        src={p.gambar}
                        alt={p.nama}
                        className="rounded-lg w-full h-24 object-cover mb-2"
                      />
                    )}
                    <h3 className="font-semibold mb-1">{p.nama}</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      📍 {p.alamat || "Alamat tidak tersedia"}
                    </p>
                    {p.url_harga && (
                      <a
                        href={p.url_harga}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline"
                      >
                        🔗 Cek harga pasar
                      </a>
                    )}
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -30]} opacity={1}>
                  {p.nama}
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>

        {selectedPasar && (
            <div className="absolute bottom-5 right-5 z-[1000]">
                <div className="bg-base-100 rounded-box shadow-xl border w-64 p-3">
                {selectedPasar.gambar && (
                    <img
                    src={`${selectedPasar.gambar}`}
                    alt={selectedPasar.nama}
                    className="rounded-lg w-full h-32 object-cover mb-2"
                    />
                )}
                <h3 className="font-semibold text-sm mb-1">{selectedPasar.nama}</h3>
                <p className="text-xs text-gray-500 mb-2">
                    📍 {selectedPasar.alamat || "Alamat tidak tersedia"}
                </p>
                {selectedPasar.url_harga && (
                    <a
                    href={selectedPasar.url_harga}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                    >
                    🔗 Cek harga pasar
                    </a>
                )}
                <div className="flex justify-end mt-2">
                    <button
                    className="btn btn-xs"
                    onClick={() => setSelectedPasar(null)}
                    >
                    Tutup
                    </button>
                </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}