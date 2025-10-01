import { Component } from '@angular/core';
import { Tab } from '../../MODEL/MODEL';
import { CustomersStatementReportComponent } from './customers-statement-report/customers-statement-report.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  // 🔹 Tabs array (future-proof)
  tabs: Tab[] = [
    { id: 'statement', label: 'Party Statements', component: CustomersStatementReportComponent }
    // 🔹 Add more tabs here easily
  ];

  activeTab: string = 'statement';

  switchTab(tabKey: string) {
    this.activeTab = tabKey;
  }
}
