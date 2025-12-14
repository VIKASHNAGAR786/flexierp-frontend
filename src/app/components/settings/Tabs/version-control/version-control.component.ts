
import { Component } from '@angular/core';

@Component({
  selector: 'app-version-control',
  standalone: true,
  imports: [],
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
