package io.ionic.starter;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    private static final String PERMISSION_PREFS = "device_permissions";
    private static final String INTRO_SHOWN = "camera_audio_intro_shown";

    private final ActivityResultLauncher<String[]> permissionLauncher = registerForActivityResult(
        new ActivityResultContracts.RequestMultiplePermissions(),
        results -> {
            if (results.containsValue(false)) {
                new AlertDialog.Builder(this)
                    .setTitle("Izin belum lengkap")
                    .setMessage("Aplikasi tetap bisa digunakan. Izin kamera dan mikrofon dapat diaktifkan melalui Pengaturan > Izin aplikasi.")
                    .setPositiveButton("Buka pengaturan", (dialog, which) -> startActivity(
                        new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                            Uri.parse("package:" + getPackageName()))))
                    .setNegativeButton("Tutup", null)
                    .show();
            }
        }
    );

    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        if (savedInstanceState != null ||
            getSharedPreferences(PERMISSION_PREFS, MODE_PRIVATE).getBoolean(INTRO_SHOWN, false)) {
            return;
        }

        List<String> missingPermissions = new ArrayList<>();
        for (String permission : new String[] { Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO }) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                missingPermissions.add(permission);
            }
        }
        if (missingPermissions.isEmpty()) {
            return;
        }

        new AlertDialog.Builder(this)
            .setTitle("Izin kamera dan mikrofon")
            .setMessage("Izinkan KemanaYa mengakses kamera dan mikrofon? Memberikan izin tidak langsung menyalakan kamera atau merekam audio. Anda tetap bisa menggunakan aplikasi jika memilih nanti.")
            .setPositiveButton("Lanjutkan", (dialog, which) -> {
                markIntroShown();
                permissionLauncher.launch(missingPermissions.toArray(new String[0]));
            })
            .setNegativeButton("Nanti", (dialog, which) -> markIntroShown())
            .setCancelable(false)
            .show();
    }

    private void markIntroShown() {
        getSharedPreferences(PERMISSION_PREFS, MODE_PRIVATE)
            .edit().putBoolean(INTRO_SHOWN, true).apply();
    }
}
