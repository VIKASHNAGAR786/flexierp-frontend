#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    ffi::OsStr,
    fs::OpenOptions,
    io::Write,
    iter::once,
    os::windows::{ffi::OsStrExt, process::CommandExt},
    path::PathBuf,
    process::{Child, Command},
    ptr,
    sync::Mutex,
    thread,
    time::Duration,
};

use tauri::{Manager, State, Wry};
use windows::core::PCWSTR;
use windows::Win32::Foundation::{ERROR_ALREADY_EXISTS, GetLastError, HWND};
use windows::Win32::System::Threading::{CreateMutexW, CREATE_NO_WINDOW};
use windows::Win32::UI::WindowsAndMessaging::{MessageBoxW, MB_ICONERROR, MB_OK};

use tauri_plugin_dialog;

fn show_error(title: &str, message: &str) {
    let title_w: Vec<u16> = OsStr::new(title).encode_wide().chain(Some(0)).collect();
    let msg_w: Vec<u16> = OsStr::new(message).encode_wide().chain(Some(0)).collect();
    unsafe {
        MessageBoxW(
            Some(HWND(ptr::null_mut())),
            PCWSTR(msg_w.as_ptr()),
            PCWSTR(title_w.as_ptr()),
            MB_OK | MB_ICONERROR,
        );
    }
}

fn log_error(message: &str) {
    use chrono::Local;
    let log_path = PathBuf::from("resources/logs/FlexiERP_Error.log"); // ✅ Move log to avoid dev rebuild loop
    if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
        let _ = writeln!(file, "[{}] {}", Local::now().format("%Y-%m-%d %H:%M:%S"), message);
    }
}

fn kill_if_running(process_name: &str) {
    let _ = Command::new("taskkill")
        .args(&["/IM", process_name, "/F", "/T"])
        .creation_flags(CREATE_NO_WINDOW.0)
        .spawn();
}

fn is_process_running(name: &str) -> bool {
    Command::new("tasklist")
        .args(&["/FI", &format!("IMAGENAME eq {}", name)])
        .creation_flags(CREATE_NO_WINDOW.0)
        .output()
        .map(|output| String::from_utf8_lossy(&output.stdout).contains(name))
        .unwrap_or(false)
}

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

struct BackendProcesses {
    flexierp: Option<Child>,
    run_service: Option<Child>,
}

fn resolve_backend_dir() -> Result<PathBuf, String> {
    if cfg!(debug_assertions) {
        let path = std::env::current_dir()
            .map_err(|e| format!("Failed to get current dir: {}", e))?
            .join("resources")
            .join("backend");
        Ok(path)
    } else {
        std::env::current_exe()
            .map_err(|e| format!("Exe path error: {}", e))?
            .parent()
            .map(|p| p.join("resources").join("backend"))
            .ok_or_else(|| "Failed to resolve backend directory path".to_string())
    }
}

fn start_backends(backend_dir: &PathBuf) -> Result<BackendProcesses, String> {
    if std::env::var("FLEXIERP_SKIP_BACKEND").is_ok() {
        log_error("Skipping backend launch due to FLEXIERP_SKIP_BACKEND");
        return Ok(BackendProcesses {
            flexierp: None,
            run_service: None,
        });
    }

    let flexierp_path = backend_dir.join("FLEXIERP.exe");
    let run_service_path = backend_dir.join("run_service.exe");

    if !flexierp_path.exists() {
        log_error(&format!("Missing FLEXIERP.exe at {:?}", flexierp_path));
        return Err(format!("FLEXIERP.exe not found at {:?}", flexierp_path));
    }
    if !run_service_path.exists() {
        log_error(&format!("Missing run_service.exe at {:?}", run_service_path));
        return Err(format!("run_service.exe not found at {:?}", run_service_path));
    }

    kill_if_running("FLEXIERP.exe");
    kill_if_running("run_service.exe");
    thread::sleep(Duration::from_millis(500));

    if is_process_running("run_service.exe") {
        log_error("run_service.exe still running after kill, aborting new spawn.");
        return Err("run_service.exe failed to terminate properly.".to_string());
    }

    let flexierp_child = Command::new(&flexierp_path)
        .current_dir(backend_dir)
        .creation_flags(CREATE_NO_WINDOW.0)
        .spawn()
        .map_err(|e| format!("Failed to start FLEXIERP backend: {}", e))?;
    log_error(&format!("Spawned FLEXIERP.exe (PID: {})", flexierp_child.id()));

    let run_service_child = if is_process_running("run_service.exe") {
        log_error("run_service.exe already running, skipping spawn.");
        None
    } else {
        let child = Command::new(&run_service_path)
            .current_dir(backend_dir)
            .creation_flags(CREATE_NO_WINDOW.0)
            .spawn()
            .map_err(|e| format!("Failed to start run_service: {}", e))?;
        log_error(&format!("Spawned run_service.exe (PID: {})", child.id()));
        Some(child)
    };

    Ok(BackendProcesses {
        flexierp: Some(flexierp_child),
        run_service: run_service_child,
    })
}

#[tauri::command]
fn restart_backends(state: State<Mutex<BackendProcesses>>) -> Result<(), String> {
    let backend_dir = resolve_backend_dir()?;
    let new_processes = start_backends(&backend_dir)?;
    if let Ok(mut state) = state.lock() {
        state.flexierp = new_processes.flexierp;
        state.run_service = new_processes.run_service;
    }
    Ok(())
}

fn main() {
    unsafe {
        let name: Vec<u16> =
            OsStr::new("Global\\FlexiERP_Instance").encode_wide().chain(once(0)).collect();
        let _handle = CreateMutexW(Some(ptr::null_mut()), false.into(), PCWSTR(name.as_ptr()));
        if GetLastError() == ERROR_ALREADY_EXISTS {
            show_error("Instance Error", "Another instance of FlexiERP is already running.");
            return;
        }
    }

    let backend_processes = Mutex::new(BackendProcesses {
        flexierp: None,
        run_service: None,
    });

    tauri::Builder::<Wry>::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![restart_backends])
        .setup(|app| {
            let backend_dir = resolve_backend_dir()?;
            match start_backends(&backend_dir) {
                Ok(processes) => {
                    if let Ok(mut state) = app.state::<Mutex<BackendProcesses>>().lock() {
                        state.flexierp = processes.flexierp;
                        state.run_service = processes.run_service;
                    }
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
                if let Ok(mut state) = window.app_handle().state::<Mutex<BackendProcesses>>().lock() {
                    let mut flexierp = state.flexierp.take();
                    let mut run_service = state.run_service.take();
                    drop(state);
                    thread::spawn(move || {
                        force_kill(&mut flexierp, "FLEXIERP.exe", "FLEXIERP backend");
                        force_kill(&mut run_service, "run_service.exe", "run_service");
                    });
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