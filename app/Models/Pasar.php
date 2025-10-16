<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pasar extends Model
{
    protected $table = 'pasar';

    protected $fillable = ['nama', 'alamat', 'latitude', 'longitude'];
}
