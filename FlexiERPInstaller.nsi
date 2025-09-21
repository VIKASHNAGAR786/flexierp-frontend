;--------------------------------
; FlexiERP Advanced Installer
;--------------------------------

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"

Name "FlexiERP"
OutFile "FlexiERP_Setup.exe"
InstallDir "$PROGRAMFILES\FlexiERP"
ShowInstDetails show
RequestExecutionLevel admin  ; Require admin for Program Files

!define APP_VERSION "1.0.0"
!define APP_EXE "flexierp-frontend_0.1.0_x64_en-US.msi"
!define BACKEND_EXE "FLEXIERP.exe"
!define CONFIG_FILE "appsettings.json"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

;--------------------------------
; Install Section
;--------------------------------
Section "Install"

  ; Check if already installed
  IfFileExists "$INSTDIR\${APP_EXE}" 0 +2
    MessageBox MB_ICONEXCLAMATION|MB_OK "FlexiERP is already installed. Installation will be replaced."

  ; Create installation directory
  CreateDirectory "$INSTDIR"

  ; Set output path
  SetOutPath "$INSTDIR"

  ; Copy backend exe and config
  File "Backend Production\${BACKEND_EXE}"
  File "Backend Production\${CONFIG_FILE}"

  ; Copy frontend exe
  File "src-tauri\target\release\bundle\msi\${APP_EXE}"

  ; Ask to create desktop shortcut
  MessageBox MB_YESNO|MB_ICONQUESTION "Do you want to create a desktop shortcut?" IDYES +2
    CreateShortCut "$DESKTOP\FlexiERP.lnk" "$INSTDIR\${APP_EXE}"

  ; Create Start Menu folder & shortcut
  CreateDirectory "$SMPROGRAMS\FlexiERP"
  CreateShortCut "$SMPROGRAMS\FlexiERP\FlexiERP.lnk" "$INSTDIR\${APP_EXE}"

  ; Write version info to registry
  WriteRegStr HKLM "Software\FlexiERP" "Install_Dir" "$INSTDIR"
  WriteRegStr HKLM "Software\FlexiERP" "Version" "${APP_VERSION}"

  ; ✅ Auto-launch frontend silently
  Exec '"$INSTDIR\${APP_EXE}"'

SectionEnd

;--------------------------------
; Uninstall Section
;--------------------------------
Section "Uninstall"

  ; Remove files
  Delete "$INSTDIR\${APP_EXE}"
  Delete "$INSTDIR\${BACKEND_EXE}"
  Delete "$INSTDIR\${CONFIG_FILE}"

  ; Remove shortcuts
  Delete "$DESKTOP\FlexiERP.lnk"
  Delete "$SMPROGRAMS\FlexiERP\FlexiERP.lnk"

  ; Remove Start Menu folder
  RMDir "$SMPROGRAMS\FlexiERP"

  ; Remove installation directory
  RMDir "$INSTDIR"

  ; Remove registry entries
  DeleteRegKey HKLM "Software\FlexiERP"

SectionEnd

;--------------------------------
; Optional: Silent install
;--------------------------------
Function .onInit
  ; Detect /S for silent install
  IfSilent +2
    MessageBox MB_ICONINFORMATION|MB_OK "Installing FlexiERP..."
FunctionEnd
