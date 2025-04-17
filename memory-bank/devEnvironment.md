# Development Environment Setup (Windows)

This document outlines the specific setup required for developing the bikR project on a Windows machine.

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

## Project-Specific Commands (Run from `d:/Projects/bikeapp`)

### General
```bash
# Install all workspace dependencies
npm install

# Run TypeScript check across all workspaces
npm run typecheck --workspaces --if-present

# Run linting across all workspaces
npm run lint --workspaces --if-present
```

### Frontend (bikR)
```bash
# Navigate to frontend directory (optional, commands can be run from root)
cd bikR

# Start the Expo development server
# Use --clear to reset cache if needed
expo start

# Start specifically for Android emulator/device
npm run android

# Start specifically for iOS simulator/device (requires macOS or Expo EAS)
npm run ios

# Start specifically for web
npm run web

# Run frontend tests
npm test
```

### API (api)
```bash
# Navigate to API directory (optional, commands can be run from root)
cd api

# Start the Fastify development server (with hot-reloading)
npm run dev

# Build the API for production
npm run build

# Start the production server
npm start

# Run API tests
npm test
```

### Shared (shared)
```bash
# Navigate to shared directory (optional, commands can be run from root)
cd shared

# Build the shared package (if needed, usually just type checking)
npm run build
```

## Local Testing Procedures
1.  Ensure Supabase services (local or cloud) are running and accessible.
2.  Verify `.env` files in `api/` and `bikR/` contain the correct Supabase URL and keys.
3.  Start the API server: `npm run dev --workspace=api` (from the root directory).
4.  Start the Frontend app: `npm run android` (or `ios`/`web`) `--workspace=bikR` (from the root directory).
5.  Use an Android Emulator (created via Android Studio's AVD Manager) or a physical device connected via USB debugging.

## Common Troubleshooting (Windows)
*   **Emulator Performance:** Ensure Intel HAXM is installed and enabled in BIOS/UEFI settings. Allocate sufficient RAM to the emulator instance.
*   **Port Conflicts:** If the API (default: 3000) or Expo (default: 8081) ports are in use, check for other running processes or configure different ports.
*   **Dependency Issues:** Run `npm install` in the root directory. If issues persist, try removing `node_modules` folders in all workspaces and the root `package-lock.json`, then run `npm install` again.
*   **Environment Variables Not Recognized:** Restart PowerShell/CMD or the entire system after setting environment variables. Verify paths are correct using `echo %ANDROID_HOME%` or `Get-ChildItem Env:ANDROID_HOME`.
*   **Expo CLI Errors:** Ensure Expo CLI is installed globally (`npm install -g expo-cli`) or use `npx expo ...`. Keep Expo CLI updated.
