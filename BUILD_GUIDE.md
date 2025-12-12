# Build Guide - DuitKu App

## Development Build

Aplikasi sudah berjalan di development mode dengan:
```bash
npm run android
```

## Production Build untuk Play Store

### 1. Persiapan

#### Update app.json
Pastikan konfigurasi sudah benar:
```json
{
  "expo": {
    "name": "DuitKu",
    "slug": "duitku",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.duitku",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#000000"
      }
    }
  }
}
```

### 2. Build APK (untuk testing)

```bash
# Install EAS CLI jika belum
npm install -g eas-cli

# Login ke Expo account
eas login

# Configure project
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### 3. Build AAB (untuk Play Store)

```bash
# Build production AAB
eas build --platform android --profile production
```

### 4. Download & Upload ke Play Store

1. Setelah build selesai, download file AAB dari Expo dashboard
2. Buka [Google Play Console](https://play.google.com/console)
3. Buat aplikasi baru atau pilih aplikasi existing
4. Upload AAB ke "Production" atau "Internal testing"
5. Isi semua informasi yang diperlukan (screenshots, description, dll)
6. Submit untuk review

### 5. Alternative: Build Lokal

Jika ingin build tanpa EAS:

```bash
# Install dependencies
npm install

# Build APK lokal
npx expo run:android --variant release

# File APK akan ada di:
# android/app/build/outputs/apk/release/app-release.apk
```

### 6. Generate Signing Key

Untuk production build, butuh signing key:

```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore duitku-release.keystore -alias duitku -keyalg RSA -keysize 2048 -validity 10000

# Simpan password dengan aman!
```

Update `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## Testing Production Build

```bash
# Install APK di device
adb install app-release.apk

# Atau drag & drop APK ke emulator
```

## Checklist Sebelum Publish

- [ ] Update versi di app.json
- [ ] Test semua fitur
- [ ] Pastikan API endpoint production sudah benar
- [ ] Siapkan icon & splash screen
- [ ] Siapkan screenshots untuk Play Store
- [ ] Tulis deskripsi aplikasi
- [ ] Set privacy policy URL
- [ ] Test di berbagai device Android

## Resources

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Console](https://play.google.com/console)
- [EAS Build](https://expo.dev/eas)
