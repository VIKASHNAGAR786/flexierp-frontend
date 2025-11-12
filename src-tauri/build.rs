use std::process::Command;
use std::env;

fn main() {
    // Keep Tauri’s default build behavior
    tauri_build::build();

    // Run your custom WiX build after Tauri finishes bundling
    println!("🧩 Running custom WiX build...");

    // Resolve WiX path
    let wix_path = format!(
        "{}\\AppData\\Local\\tauri\\WixTools314",
        env::var("USERPROFILE").unwrap()
    );

    // Define paths relative to src-tauri
    let wxs = "wix\\flexierp.wxs";
    let wixobj = "wix\\flexierp.wixobj";
    let msi = "wix\\flexierp-debug.msi";
    let wxl = "wix\\tauri.wxl";

    // Run candle.exe
    let candle_status = Command::new(format!("{}\\candle.exe", wix_path))
        .args(&[
            wxs,
            "-out", wixobj,
            "-dWin64=yes",
            "-dProductName=FlexiERP",
            "-dVersion=1.0.0",
            "-v"
        ])
        .status()
        .expect("❌ Failed to run candle.exe");

    if !candle_status.success() {
        panic!("❌ Candle failed — check your .wxs syntax.");
    }

    // Run light.exe
    let light_status = Command::new(format!("{}\\light.exe", wix_path))
        .args(&[
            wixobj,
            "-out", msi,
            "-ext", "WixUIExtension",
            "-cultures:en-us",
            "-loc", wxl,
            "-sice:ICE38",
            "-sice:ICE64",
            "-sice:ICE60",
            "-sice:ICE61",
            "-sice:ICE40",
        ])
        .status()
        .expect("❌ Failed to run light.exe");

    if !light_status.success() {
        panic!("❌ Light failed — check component references or ICE suppressions.");
    }

    println!("✅ WiX build succeeded! Output file: {}", msi);
}
