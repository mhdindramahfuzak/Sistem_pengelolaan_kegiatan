<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * OPSI 1: Menampilkan SEMUA data tanpa pagination
     */
    public function index()
    {
        // Ambil semua user, urutkan dari yang terbaru
        $users = User::query()->latest()->get();

        // Kirim data ke halaman React 'User/Index'
        return Inertia::render('User/Index', [
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * OPSI 2: Menampilkan semua data dengan format yang konsisten
     */
    public function indexAlternative()
    {
        // Ambil semua user, urutkan dari yang terbaru
        $allUsers = User::query()->latest()->get();

        // Format data agar konsisten dengan frontend
        $users = [
            'data' => UserResource::collection($allUsers),
            'total' => $allUsers->count(),
        ];

        // Kirim data ke halaman React 'User/Index'
        return Inertia::render('User/Index', [
            'users' => $users,
        ]);
    }

    /**
     * OPSI 3: Menampilkan dengan pagination opsional (bisa diatur via parameter)
     */
    public function indexFlexible()
    {
        // Cek apakah ada parameter 'all' di URL
        $showAll = request()->get('all', false);
        
        if ($showAll) {
            // Tampilkan semua data
            $users = User::query()->latest()->get();
            return Inertia::render('User/Index', [
                'users' => UserResource::collection($users),
            ]);
        } else {
            // Tampilkan dengan pagination
            $users = User::query()->latest()->paginate(10);
            return Inertia::render('User/Index', [
                'users' => UserResource::collection($users),
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Menampilkan halaman form untuk menambah user baru
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Validasi data masuk (sudah dihandle oleh StoreUserRequest)
        $data = $request->validated();
        // Enkripsi password sebelum disimpan
        $data['password'] = Hash::make($data['password']);
        // Buat user baru
        User::create($data);

        // Arahkan kembali ke halaman index user dengan pesan sukses
        return to_route('user.index')->with('success', 'User berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Menampilkan halaman form edit dengan data user yang dipilih
        return Inertia::render('User/Edit', [
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        // Jika ada password baru, enkripsi. Jika tidak, jangan ubah password lama.
        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }
        // Update data user
        $user->update($data);

        // Arahkan kembali ke halaman index user dengan pesan sukses
        return to_route('user.index')->with('success', "User \"{$user->name}\" berhasil diubah.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name;
        // Hapus user
        $user->delete();

        // Arahkan kembali ke halaman index user dengan pesan sukses
        return to_route('user.index')->with('success', "User \"{$name}\" berhasil dihapus.");
    }
}