<?php

namespace App\Http\Controllers;

use App\Models\Pasar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PasarController extends Controller
{
    public function index()
    {
        $pasar = Pasar::orderBy('created_at', 'desc')->get();
        return Inertia::render('dashboard/pasar', [
            'pasars' => $pasar,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        Pasar::create($request->all());
        return back()->with('success', 'Pasar berhasil ditambahkan');
    }

    public function update(Request $request, Pasar $pasar)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        $pasar->update($request->all());
        return back()->with('success', 'Pasar berhasil diperbarui');
    }

    public function destroy(Pasar $pasar)
    {
        $pasar->delete();
        return back()->with('success', 'Pasar berhasil dihapus');
    }
}