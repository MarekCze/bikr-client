# Client Development Environment Setup (Windows)

This document outlines the specific setup required for developing the bikr-client Expo project on a Windows machine.

## Required Software Installations
1.  **Android Studio**: Version 2022.3 or newer.
    *   Ensure the following components are installed via the SDK Manager:
        *   Android SDK Platform 33
        *   Intel x86 Emulator Accelerator (HAXM installer) (for emulator performance)
        *   Google Play Services
2.  **Java Development Kit (JDK)**: Version 17 (or compatible version required by Android Studio).
3.  **Node.js**: LTS version recommended. Includes npm.
4.  **Git**: For version control.
5.  **VS Code**: Recommended editor with relevant extensions (e.g., ESLint, Prettier, Tamagui).

## Environment Variables
Configure the following system environment variables:

```bash
# Example paths, adjust to your installation locations
ANDROID_HOME=C:\Users\marek\AppData\Local\Android\Sdk
JAVA_HOME=C:\Program Files\Java\jdk-17
```

Add the following to your system's `Path` variable:
*   `%ANDROID_HOME%\platform-tools`
*   `%ANDROID_HOME%\emulator`
*   `%JAVA_HOME%\bin`
*   Node.js installation directory (usually added automatically by the installer)
*   Git installation directory (usually added automatically by the installer)

## PowerShell Configuration
Ensure scripts can be run by setting the execution policy:

```powershell
# Run this command in PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope LocalMachine

# Or, for the current user only (no admin rights needed):
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Project-Specific Commands (Run from `d:/Projects/bike/new/bikr-client`)

### Client (bikr-client)
```bash
# Install client dependencies
npm install

# Run TypeScript check
npm run typecheck

# Run linting
npm run lint

# Start the Expo development server for the client
# Use --clear to reset cache if needed
npx expo start --clear

# Start client specifically for Android emulator/device
npm run android
# or
npx expo run:android

# Start client specifically for iOS simulator/device (requires macOS or Expo EAS)
npm run ios
# or
npx expo run:ios

# Start client specifically for web
npm run web
# or
npx expo start --web

# Run client tests
npm test
```

## Local Testing Procedures
1.  Ensure the backend server (`bikr-server`) is running and accessible (check its README for setup).
2.  Verify the `.env` file in `bikr-client/` contains the correct Supabase URL/keys and the API server URL.
3.  Start the Client app: `npm run android` (or `ios`/`web`) from the `bikr-client` directory.
4.  Use an Android Emulator (created via Android Studio's AVD Manager) or a physical device connected via USB debugging. For iOS, use a Simulator (macOS only) or a physical device.

## Common Troubleshooting (Windows - Client Focus)
*   **Emulator Performance:** Ensure Intel HAXM is installed and enabled in BIOS/UEFI settings. Allocate sufficient RAM to the emulator instance.
*   **Port Conflicts:** If the Expo bundler port (default: 8081) or other required ports are in use, check for other running processes. Expo might automatically choose a different port.
*   **Dependency Issues:** Run `npm install` within the `bikr-client` directory. If issues persist, try removing `bikr-client/node_modules` and `bikr-client/package-lock.json`, then run `npm install` again.
*   **Environment Variables Not Recognized:** Restart PowerShell/CMD or the entire system after setting environment variables. Verify paths are correct using `echo %ANDROID_HOME%` or `Get-ChildItem Env:ANDROID_HOME`.
*   **Expo CLI Errors:** Ensure Expo CLI is installed globally (`npm install -g expo-cli`) or use `npx expo ...` within the `bikr-client` directory. Keep Expo CLI updated (`npm install -g expo-cli@latest`). Check for compatibility issues between Expo SDK version and Expo CLI version.
*   **Cannot Connect to Development Server:** Ensure the emulator/device is on the same network as the development machine. Check firewall settings. Try selecting "Tunnel" connection mode in the Expo Go app or terminal if network issues persist.
