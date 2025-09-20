use std::process::{Command, Child, Stdio};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
  let backend: Mutex<Option<Child>> = Mutex::new(None);

  tauri::Builder::default()
    .setup(|app| {
      // path to your backend exe
      let backend_path = r"C:\Users\VIKAS NAGAR\Desktop\AgriMandi-Frontend\FLEXIERP.exe";

      // run the backend exe
      let child = Command::new(backend_path)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start backend");

      *app.state::<Mutex<Option<Child>>>().lock().unwrap() = Some(child);
      Ok(())
    })
    .on_window_event(|event| {
      if let tauri::WindowEvent::CloseRequested { .. } = event.event() {
        if let Some(child) = event.window()
          .app_handle()
          .state::<Mutex<Option<Child>>>()
          .lock()
          .unwrap()
          .as_mut() 
        {
          let _ = child.kill();
        }
      }
    })
    .manage(backend)
    .run(tauri::generate_context!())
    .expect("error while running tauri app");
}
