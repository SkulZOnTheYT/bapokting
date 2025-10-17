<?php

namespace App\Http\Controllers;

use App\Models\Pasar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PasarController extends Controller
{
    public function index()
    {
        $pasars = Pasar::all();
        return Inertia::render('dashboard/pasar', [
            'pasars' => $pasars,
        ]);
    }

    public function peta()
    {
        // ambil semua pasar, pilih field yang diperlukan
        $pasars = Pasar::select('id', 'nama', 'alamat', 'latitude', 'longitude', 'gambar', 'url_harga')->get();

        // Pastikan semua latitude/longitude ada dan dalam format string/float
        $pasar = $pasars->map(function($p) {
            return [
                'id' => $p->id,
                'nama' => $p->nama,
                'alamat' => $p->alamat,
                'latitude' => $p->latitude,
                'longitude' => $p->longitude,
                'gambar' => $p->gambar,
                'url_harga' => $p->url_harga,
            ];
        });

        return Inertia::render('pasar', [
            'pasars' => $pasar,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'url_harga' => 'nullable|url',
        ]);

        $pasar = new Pasar();
        $pasar->nama = $request->nama;
        $pasar->alamat = $request->alamat;
        $pasar->latitude = $request->latitude;
        $pasar->longitude = $request->longitude;
        $pasar->url_harga = $request->url_harga;

        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = $file->getClientOriginalName();
            $file->move(public_path('images/pasar'), $filename);

            // simpan path relatif (biar mudah dipanggil di React)
            $pasar->gambar = "images/pasar/" . $filename;
        }

        $pasar->save();

        return redirect()->back()->with('success', 'Pasar berhasil ditambahkan!');
    }

    public function update(Request $request, Pasar $pasar)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'url_harga' => 'nullable|url',
        ]);

        $pasar->nama = $request->nama;
        $pasar->alamat = $request->alamat;
        $pasar->latitude = $request->latitude;
        $pasar->longitude = $request->longitude;
        $pasar->url_harga = $request->url_harga;

        if ($request->hasFile('gambar')) {
            $file = $request->file('icon');
            $filename = $file->getClientOriginalName();
            $file->move(public_path('images/pasar'), $filename);
            $pasar->gambar = "images/pasar/" . $filename;
        }

        $pasar->save();

        return redirect()->back()->with('success', 'Pasar berhasil diperbarui!');
    }

    public function destroy(Pasar $pasar)
    {
        if ($pasar->gambar && file_exists(public_path($pasar->gambar))) {
            unlink(public_path($pasar->gambar));
        }

        $pasar->delete();

        return redirect()->back()->with('success', 'Pasar berhasil dihapus!');
    }
}