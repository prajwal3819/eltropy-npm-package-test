# Windows Icon Setup

## Overview

The Windows build requires an `.ico` file for the application icon. This file needs to be created from the existing `eltropy.png` file.

## Quick Setup (Automated)

Run the GitHub Actions workflow to automatically convert the PNG to ICO:

1. Go to GitHub Actions
2. Select "Convert Icon to ICO" workflow
3. Click "Run workflow"
4. The workflow will create `eltropy.ico` and commit it to the repository

## Manual Setup (Local)

### Option 1: Using ImageMagick (Recommended)

**On macOS:**
```bash
brew install imagemagick
convert eltropy.png -define icon:auto-resize=256,128,64,48,32,16 eltropy.ico
```

**On Windows:**
1. Download ImageMagick from https://imagemagick.org/script/download.php
2. Install with "Install legacy utilities" option checked
3. Run in Command Prompt:
```cmd
magick convert eltropy.png -define icon:auto-resize=256,128,64,48,32,16 eltropy.ico
```

**On Linux:**
```bash
sudo apt-get install imagemagick
convert eltropy.png -define icon:auto-resize=256,128,64,48,32,16 eltropy.ico
```

### Option 2: Using Online Converter

1. Go to https://convertio.co/png-ico/ or https://www.icoconverter.com/
2. Upload `eltropy.png`
3. Select multiple sizes: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16
4. Download the generated `eltropy.ico`
5. Place it in the project root directory

### Option 3: Using GIMP

1. Open `eltropy.png` in GIMP
2. Go to Image → Scale Image
3. Create versions at: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16
4. Export as `.ico` file
5. In export dialog, select all sizes

## Files Required

The following files must exist in the project root:

1. **`eltropy.png`** - Source icon (already exists)
2. **`eltropy.ico`** - Windows icon file (needs to be created)
3. **`app.rc`** - Resource file (already created)

## How It Works

1. **`app.rc`** - Resource script that references the icon:
   ```
   IDI_ICON1 ICON DISCARDABLE "eltropy.ico"
   ```

2. **`CMakeLists.txt`** - Includes the resource file on Windows:
   ```cmake
   if(WIN32)
       list(APPEND PROJECT_SOURCES app.rc)
   endif()
   ```

3. **Build Process** - CMake compiles the resource file and embeds the icon in the `.exe`

## Verification

After building on Windows, you should see the Eltropy icon:
- In Windows Explorer when viewing the `.exe` file
- In the taskbar when the application is running
- In the title bar of the application window
- In the Windows Start menu (if installed)

## Troubleshooting

### Icon not showing after build

1. **Check if `eltropy.ico` exists:**
   ```bash
   ls -lh eltropy.ico
   ```

2. **Verify `app.rc` is included in build:**
   - Check CMakeLists.txt has the Windows resource section
   - Rebuild the project completely

3. **Clear Windows icon cache:**
   ```cmd
   ie4uinit.exe -show
   ```

4. **Check icon file is valid:**
   - Open `eltropy.ico` in an image viewer
   - Should show multiple sizes (16x16 to 256x256)

### Build errors related to icon

- **Error: "cannot open file 'eltropy.ico'"**
  - Make sure `eltropy.ico` is in the project root directory
  - Check the path in `app.rc` is correct

- **Error: "syntax error in resource file"**
  - Verify `app.rc` has correct syntax
  - Make sure file uses Windows line endings (CRLF)

## Icon Specifications

The `.ico` file should contain multiple resolutions:
- 256x256 (Windows 10/11 high DPI)
- 128x128 (Windows 10/11)
- 64x64 (Windows Explorer large icons)
- 48x48 (Windows Explorer medium icons)
- 32x32 (Windows Explorer small icons, taskbar)
- 16x16 (Windows Explorer list view, title bar)

## References

- [Microsoft Icon Guidelines](https://docs.microsoft.com/en-us/windows/win32/uxguide/vis-icons)
- [CMake Windows Resources](https://cmake.org/cmake/help/latest/prop_tgt/WIN32_EXECUTABLE.html)
- [ImageMagick ICO Format](https://imagemagick.org/script/formats.php#ICO)
