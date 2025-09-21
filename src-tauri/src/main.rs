use std::process::{Command, Child, Stdio};
use std::sync::{Mutex, Arc};
use std::path::PathBuf;
use std::os::windows::process::CommandExt; // For CREATE_NO_WINDOW
use tauri::Manager;
use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;
use std::fs::{OpenOptions};
use std::io::Write;
use windows_sys::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONERROR, MB_OK};

/// Show Windows error popup
fn show_error(title: &str, message: &str) {
    let title_w: Vec<u16> = OsStr::new(title).encode_wide().chain(Some(0)).collect();
    let msg_w: Vec<u16> = OsStr::new(message).encode_wide().chain(Some(0)).collect();
    unsafe {
        MessageBoxW(std::ptr::null_mut(), msg_w.as_ptr(), title_w.as_ptr(), MB_OK | MB_ICONERROR);
    }
}

/// Log error to file
fn log_error(message: &str) {
    let log_path = PathBuf::from("FlexiERP_Error.log");
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
        let _ = writeln!(file, "{}", message);
    }
}

fn main() {
    // -----------------------------
    // SINGLE INSTANCE CHECK
    // -----------------------------
    let instance_mutex = Arc::new(Mutex::new(()));
    if instance_mutex.try_lock().is_err() {
        show_error("Instance Error", "Another instance of FlexiERP is already running.");
        return;
    }

    // -----------------------------
    // BACKEND PROCESS STATE
    // -----------------------------
    let backend: Mutex<Option<Child>> = Mutex::new(None);

    tauri::Builder::default()
        .setup(|app| {
            // Get the folder where frontend exe is located
            let mut exe_dir = std::env::current_exe().map_err(|e| {
                let msg = format!("Failed to determine frontend exe path: {}", e);
                show_error("Startup Error", &msg);
                log_error(&msg);
                e
            })?;
            exe_dir.pop(); // Remove frontend exe

            // Inside bundle → resources → backend folder
            let mut backend_dir = exe_dir.clone();
            backend_dir.push("backend"); // <- publish folder placed here

            let mut backend_path = backend_dir.clone();
            backend_path.push("FLEXIERP.exe");

            if !backend_path.exists() {
                let msg = format!("Backend exe not found at {:?}", backend_path);
                show_error("Startup Error", &msg);
                log_error(&msg);
                return Err(std::io::Error::new(std::io::ErrorKind::NotFound, "Backend exe missing").into());
            }

            // Start backend silently
            let child = Command::new(&backend_path)
                .current_dir(&backend_dir) // Important: so backend can access dlls/config
                .stdin(Stdio::null())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .creation_flags(0x08000000) // CREATE_NO_WINDOW
                .spawn()
                .map_err(|e| {
                    let msg = format!("Failed to start backend: {}", e);
                    show_error("Startup Error", &msg);
                    log_error(&msg);
                    e
                })?;

            *app.state::<Mutex<Option<Child>>>().lock().unwrap() = Some(child);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                if let Some(child) = window
                    .app_handle()
                    .state::<Mutex<Option<Child>>>()
                    .lock()
                    .unwrap()
                    .as_mut()
                {
                    let _ = child.kill();
                    log_error("Backend terminated because frontend closed.");
                }
            }
        })
        .manage(backend)
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            let msg = format!("Tauri runtime failed: {}", e);
            show_error("Application Error", &msg);
            log_error(&msg);
        });
}
