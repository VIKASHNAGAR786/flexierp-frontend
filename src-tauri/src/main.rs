#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    ffi::OsStr,
    fs::OpenOptions,
    io::Write,
    path::PathBuf,
    process::{Child, Command},
    sync::{Arc, Mutex},
};
use tauri::{Manager, State};
use windows_sys::Win32::{
    System::Threading::CREATE_NO_WINDOW,
    UI::WindowsAndMessaging::{MessageBoxW, MB_ICONERROR, MB_OK},
};
use std::os::windows::ffi::OsStrExt;
use std::os::windows::process::CommandExt;

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

/// Kill process by name
fn kill_if_running(process_name: &str) {
    let _ = Command::new("taskkill")
        .args(&["/IM", process_name, "/F", "/T"]) // /T = kill tree
        .creation_flags(CREATE_NO_WINDOW)
        .spawn();
}
/// Forcefully terminate a process
fn force_kill(child: &mut Option<Child>, process_name: &str, label: &str) {
    if let Some(proc) = child {
        if proc.kill().is_err() {
            kill_if_running(process_name);
        }
        let _ = proc.wait();
        log_error(&format!("{} terminated cleanly.", label));
    } else {
        kill_if_running(process_name);
        log_error(&format!("{} force-killed due to missing handle.", label));
    }
}

/// Store backend processes
struct BackendProcesses {
    flexierp: Option<Child>,
    run_service: Option<Child>,
}

/// Start backend EXEs
fn start_backends(backend_dir: &PathBuf) -> Result<BackendProcesses, String> {
    let flexierp_path = backend_dir.join("FLEXIERP.exe");
    let run_service_path = backend_dir.join("run_service.exe");

    if !flexierp_path.exists() {
        return Err(format!("FLEXIERP.exe not found at {:?}", flexierp_path));
    }
    if !run_service_path.exists() {
        return Err(format!("run_service.exe not found at {:?}", run_service_path));
    }

    kill_if_running("FLEXIERP.exe");
    kill_if_running("run_service.exe");

    let flexierp_child = Command::new(&flexierp_path)
        .current_dir(&backend_dir)
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| format!("Failed to start FLEXIERP backend: {}", e))?;

    let run_service_child = Command::new(&run_service_path)
        .current_dir(&backend_dir)
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| format!("Failed to start run_service: {}", e))?;

    Ok(BackendProcesses {
        flexierp: Some(flexierp_child),
        run_service: Some(run_service_child),
    })
}

/// Restart command for frontend
#[tauri::command]
fn restart_backends(state: State<Mutex<BackendProcesses>>) -> Result<(), String> {
    let exe_dir = std::env::current_exe().map_err(|e| format!("Exe path error: {}", e))?;
    let mut backend_dir = exe_dir.parent().unwrap().to_path_buf();
    backend_dir.push("resources");
    backend_dir.push("backend");

    let new_processes = start_backends(&backend_dir)?;
    let mut state = state.lock().unwrap();
    state.flexierp = new_processes.flexierp;
    state.run_service = new_processes.run_service;

    Ok(())
}

fn main() {
    let instance_mutex = Arc::new(Mutex::new(()));
    if instance_mutex.try_lock().is_err() {
        show_error("Instance Error", "Another instance of FlexiERP is already running.");
        return;
    }

    let backend_processes = Mutex::new(BackendProcesses {
        flexierp: None,
        run_service: None,
    });

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![restart_backends])
        .setup(|app| {
            let exe_dir = std::env::current_exe().map_err(|e| {
                let msg = format!("Failed to determine exe path: {}", e);
                show_error("Startup Error", &msg);
                log_error(&msg);
                e
            })?;
            let mut backend_dir = exe_dir.parent().unwrap().to_path_buf();
            backend_dir.push("resources");
            backend_dir.push("backend");

            match start_backends(&backend_dir) {
                Ok(processes) => {
                    let state_handle = app.state::<Mutex<BackendProcesses>>();
                    let mut state = state_handle.lock().unwrap();
                    state.flexierp = processes.flexierp;
                    state.run_service = processes.run_service;
                    Ok(())
                }
                Err(msg) => {
                    show_error("Startup Error", &msg);
                    log_error(&msg);
                    Err(std::io::Error::new(std::io::ErrorKind::Other, msg).into())
                }
            }
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let state_handle = window.app_handle().state::<Mutex<BackendProcesses>>();
                let mut state = state_handle.lock().unwrap();

                force_kill(&mut state.flexierp, "FLEXIERP.exe", "FLEXIERP backend");
                force_kill(&mut state.run_service, "run_service.exe", "run_service");
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