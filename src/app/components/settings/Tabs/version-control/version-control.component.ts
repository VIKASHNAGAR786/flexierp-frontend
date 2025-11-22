import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-version-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './version-control.component.html',
  styleUrls: ['./version-control.component.css']
})
export class VersionControlComponent {

  currentVersion = "1.0.0";

  updateMessage: string = "";

  // Fake version history (later you can load from API)
  versionHistory = [
    {
      version: "1.0.0",
      date: "2025-01-15",
      changes: [
        "Initial release",
        "Dashboard and login added",
        "Billing module added"
      ]
    },
    {
      version: "1.1.0",
      date: "2025-02-10",
      changes: [
        "Improved UI",
        "Added theme switcher",
        "Minor performance upgrades"
      ]
    },
    {
      version: "1.2.0",
      date: "2025-03-20",
      changes: [
        "Fixed bugs in billing",
        "New reporting module",
        "Faster loading time"
      ]
    }
  ];

  // Dummy update check
  checkForUpdates() {
    const latestVersion = "1.2.0";

    if (this.currentVersion === latestVersion) {
      this.updateMessage = "You are already using the latest version.";
    } else {
      this.updateMessage = `New version ${latestVersion} is available!`;
    }
  }
}
