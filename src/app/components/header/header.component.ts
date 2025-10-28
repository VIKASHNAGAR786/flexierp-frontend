import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { UserinfowithloginService } from '../../services/userinfowithlogin.service';
import { CommonService } from '../../services/common.service';
import { AlertService } from '../../services/alert.service';
import { TooltipDirective } from '../../shared/tooltip.directive';

// 🧩 Import Tauri file dialog safely
import { open } from '@tauri-apps/plugin-dialog';
import { BackupRequest } from '../../MODEL/MODEL';
import { getVersion } from '@tauri-apps/api/app';
import { NotesComponent } from "../COMMON/notes/notes.component";



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TooltipDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public username: string = 'Guest';
  public isDropdownOpen = false;
  isProduction = environment.production;

  constructor(
    private router: Router,
    private userInfo: UserinfowithloginService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private commonservice: CommonService,
    private alertservice: AlertService
  ) { }

  ngOnInit() {
    this.username = this.userInfo.getUserName() || 'Guest';
  }

  // ✅ Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }

  // ✅ Toggle dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // ✅ Navigate to Profile
  openProfile() {
    this.router.navigate(['/profileview']);
    this.isDropdownOpen = false;
  }

  // ✅ Navigate to Settings
  openSettings() {
    this.router.navigate(['/settings']);
    this.isDropdownOpen = false;
  }

  // ✅ Logout Logic
  onLogout() {
    this.commonservice.logout().subscribe({
      next: () => this.alertservice.showAlert('Server logout successful', 'success'),
      error: () => this.alertservice.showAlert('Server logout failed', 'error'),
      complete: () => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.clear();
        }
        this.userInfo.clear();
        this.router.navigate(['/auth/login']).then(() => window.location.reload());
      }
    });
  }

  // ✅ Backup Feature Logic
async onBackup() {
  try {
    const isTauri = await this.isTauriEnvironment();
    let folderPath: string | null = null;

    if (isTauri) {
      try {
        const { open } = await import('@tauri-apps/plugin-dialog');
        folderPath = (await open({
          directory: true,
          multiple: false,
          title: 'Select Backup Folder (Desktop App)',
        })) as string | null;

        if (!folderPath) {
          return;
        }

      } catch (tauriErr: any) {
        this.alertservice.showAlert(
          `⚠️ Error opening folder dialog: ${tauriErr.message || tauriErr}`,
          'error'
        );
        return;
      }
    } else {
      folderPath = prompt(
        'Enter the full folder path where you want to store the backup (e.g., C:\\Users\\VIKAS NAGAR\\Desktop\\flexibackup):',
        'C:\\Users\\VIKAS NAGAR\\Desktop\\flexibackup'
      );

      if (!folderPath) {
        this.alertservice.showAlert('⚠️ No folder selected.', 'warning');
        return;
      }
    }

    const backupRequest: BackupRequest = {
      backupFolderPath: folderPath,
    };


    this.commonservice.backup(backupRequest).subscribe({
      next: (res: any) => {
        this.alertservice.showAlert('✅ Backup successful!', 'success');
      },
      error: (err) => {
        this.alertservice.showAlert(
          `❌ Backup failed: ${err.message || 'Unknown error'}`,
          'error'
        );
      },
    });
  } catch (error: any) {
    this.alertservice.showAlert(
      `⚠️ Error while selecting folder: ${error?.message || 'Unknown error'}`,
      'error'
    );
  }
}


openNotes() {
  this.router.navigate(['/notes']);
}

  
async isTauriEnvironment(): Promise<boolean> {
  try {
    await getVersion(); // Works only if running in Tauri
    return true;
  } catch {
    return false;
  }
}


}

