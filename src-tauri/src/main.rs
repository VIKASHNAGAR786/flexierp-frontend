use std::process::{Command, Child};
use std::sync::{Mutex, Arc};
use std::path::PathBuf;
use std::fs::OpenOptions;
use std::io::Write;
use std::ffi::OsStr;
use std::os::windows::ffi::OsStrExt;
use std::os::windows::process::CommandExt; // ✅ Fixes creation_flags error
use tauri::Manager;
use windows_sys::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONERROR, MB_OK};
use windows_sys::Win32::System::Threading::CREATE_NO_WINDOW;

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

/// Store both backend processes
struct BackendProcesses {
    flexierp: Option<Child>,
    run_service: Option<Child>,
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
    // BACKEND PROCESSES STATE
    // -----------------------------
    let backend_processes = Mutex::new(BackendProcesses {
        flexierp: None,
        run_service: None,
    });

    tauri::Builder::default()
        .setup(|app| {
            // Determine exe folder
            let mut exe_dir = std::env::current_exe().map_err(|e| {
                let msg = format!("Failed to determine exe path: {}", e);
                show_error("Startup Error", &msg);
                log_error(&msg);
                e
            })?;
            exe_dir.pop(); // remove exe name

            // Backend directory inside resources
            let mut backend_dir = exe_dir.clone();
            backend_dir.push("resources");
            backend_dir.push("backend");

            // Paths to both EXEs
            let mut flexierp_path = backend_dir.clone();
            flexierp_path.push("FLEXIERP.exe");

            let mut run_service_path = backend_dir.clone();
            run_service_path.push("run_service.exe");

            // Validate existence
            if !flexierp_path.exists() {
                let msg = format!("FLEXIERP.exe not found at {:?}", flexierp_path);
                show_error("Startup Error", &msg);
                log_error(&msg);
                return Err(std::io::Error::new(std::io::ErrorKind::NotFound, "Missing FLEXIERP.exe").into());
            }
            if !run_service_path.exists() {
                let msg = format!("run_service.exe not found at {:?}", run_service_path);
                show_error("Startup Error", &msg);
                log_error(&msg);
                return Err(std::io::Error::new(std::io::ErrorKind::NotFound, "Missing run_service.exe").into());
            }

            // Start FLEXIERP backend (no console)
            let flexierp_child = Command::new(&flexierp_path)
                .current_dir(&backend_dir)
                .creation_flags(CREATE_NO_WINDOW)
                .spawn()
                .map_err(|e| {
                    let msg = format!("Failed to start FLEXIERP backend: {}", e);
                    show_error("Startup Error", &msg);
                    log_error(&msg);
                    e
                })?;

            // Start run_service backend (no console)
            let run_service_child = Command::new(&run_service_path)
                .current_dir(&backend_dir)
                .creation_flags(CREATE_NO_WINDOW)
                .spawn()
                .map_err(|e| {
                    let msg = format!("Failed to start run_service: {}", e);
                    show_error("Startup Error", &msg);
                    log_error(&msg);
                    e
                })?;

            // ✅ Lifetime-safe state access
            let state_handle = app.state::<Mutex<BackendProcesses>>();
            let mut state = state_handle.lock().unwrap();
            state.flexierp = Some(flexierp_child);
            state.run_service = Some(run_service_child);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let state_handle = window.app_handle().state::<Mutex<BackendProcesses>>();
                let mut state = state_handle.lock().unwrap();

                if let Some(child) = state.flexierp.as_mut() {
                    let _ = child.kill();
                    log_error("FLEXIERP backend terminated because frontend closed.");
                }
                if let Some(child) = state.run_service.as_mut() {
                    let _ = child.kill();
                    log_error("run_service terminated because frontend closed.");
                }
            }
        })
        .manage(backend_processes)
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            let msg = format!("Tauri runtime failed: {}", e);
            show_error("Application Error", &msg);
            log_error(&msg);
        });
}