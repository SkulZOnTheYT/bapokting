import React, { useState, useMemo } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Modal from "@/components/modal";
import { MapContainer, TileLayer, Marker, useMapEvents, Tooltip } from "react-leaflet";
import L from "leaflet";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "leaflet/dist/leaflet.css";

interface Pasar {
  id: number;
  nama: string;
  alamat: string;
  latitude: string;
  longitude: string;
  created_at: string;
}

interface Props {
  pasars: Pasar[];
}

// Icon marker
const markerIcon = L.icon({
  iconUrl: "/images/marker.png",
  iconSize: [35, 35],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

function LocationPicker({
  setLocation,
}: {
  setLocation: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
}

export default function Index({ pasars }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPasar, setSelectedPasar] = useState<Pasar | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    nama: "",
    alamat: "",
    latitude: "",
    longitude: "",
  });

  const openCreateModal = () => {
    setEditMode(false);
    reset();
    setLocation(null);
    setIsOpen(true);
  };

  const openEditModal = (pasar: Pasar) => {
    setEditMode(true);
    setSelectedPasar(pasar);
    setData({
      nama: pasar.nama,
      alamat: pasar.alamat,
      latitude: pasar.latitude,
      longitude: pasar.longitude,
    });
    setLocation({
      lat: parseFloat(pasar.latitude),
      lng: parseFloat(pasar.longitude),
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    reset();
    setLocation(null);
  };

  // ✅ Filter dan pagination
  const filteredPasars = useMemo(() => {
    return pasars.filter(
      (p) =>
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.alamat.toLowerCase().includes(search.toLowerCase())
    );
  }, [pasars, search]);

  const totalPages = Math.ceil(filteredPasars.length / itemsPerPage);
  const currentData = filteredPasars.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const action = editMode ? "update" : "create";
    const method = editMode && selectedPasar ? put : post;
    const url = editMode ? route("pasar.update", selectedPasar!.id) : route("pasar.store");

    method(url, {
      onSuccess: () => {
        closeModal();
        Swal.fire({
          icon: "success",
          title: `Data berhasil ${action === "update" ? "diperbarui" : "ditambahkan"}!`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "Gagal menyimpan data!",
          timer: 2000,
          showConfirmButton: false,
        });
      },
    });
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Hapus data?",
      text: "Data ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        destroy(route("pasar.destroy", id), {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Data berhasil dihapus!",
              timer: 2000,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Data Pasar" />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h1 className="text-2xl font-bold">Daftar Pasar</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari pasar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full sm:w-60"
            />
            <button onClick={openCreateModal} className="btn btn-primary whitespace-nowrap">
              + Tambah Pasar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto shadow rounded-lg">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((pasar, i) => (
                  <tr key={pasar.id}>
                    <td>{(page - 1) * itemsPerPage + i + 1}</td>
                    <td>{pasar.nama}</td>
                    <td>{pasar.alamat}</td>
                    <td>{pasar.latitude}</td>
                    <td>{pasar.longitude}</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => openEditModal(pasar)}
                        className="btn btn-sm btn-outline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pasar.id)}
                        className="btn btn-sm btn-error text-white"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Belum ada data pasar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination (tampil hanya jika perlu) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`btn btn-sm ${page === num ? "btn-primary" : "btn-outline"}`}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL FORM */}
      <Modal
        show={isOpen}
        onClose={closeModal}
        title={editMode ? "Edit Pasar" : "Tambah Pasar"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="fieldset text-sm font-medium text-gray-700 ">
            <legend className="fieldset-legend">Nama Pasar</legend>
            <input
              type="text"
              value={data.nama}
              onChange={(e) => setData("nama", e.target.value)}
              placeholder="ketikan nama pasar"
              className="input w-full border border-gray-500"
              required
            />
          </fieldset>

          <fieldset className="fieldset text-sm font-medium text-gray-700">
            <legend className="fieldset-legend ">Alamat pasar</legend>
            <textarea
              value={data.alamat}
              onChange={(e) => setData("alamat", e.target.value)}
              className="textarea w-full border border-gray-500"
              placeholder="ketikan alamat pasar"
              required
            />
          </fieldset>

          {/* MAP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Lokasi
            </label>
            <div className="rounded-lg overflow-hidden border">
              <MapContainer
                center={[-5.11163293, 105.29537201]}
                zoom={13}
                className="h-72 w-full z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker
                  setLocation={(loc) => {
                    setLocation(loc);
                    setData("latitude", loc.lat.toString());
                    setData("longitude", loc.lng.toString());
                  }}
                />
                {location && (
                  <Marker position={location} icon={markerIcon}>
                    <Tooltip direction="top" offset={[0, -40]} opacity={1} permanent={false}>
                      {data.nama || "Lokasi baru"}
                    </Tooltip>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
            <button type="button" onClick={closeModal} className="btn btn-outline">
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}