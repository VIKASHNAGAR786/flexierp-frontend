import { Component } from '@angular/core';
import { Tab } from '../../MODEL/MODEL';
import { CustomersStatementReportComponent } from './customers-statement-report/customers-statement-report.component';
import { CommonModule } from '@angular/common';
import { BalanceDueComponent } from './balance-due/balance-due.component';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  // 🔹 Tabs array (future-proof)
  tabs: Tab[] = [
    { id: 'statement', label: 'Party Statements', component: CustomersStatementReportComponent },
    { id: 'balance', label: 'Balance Due', component: BalanceDueComponent }
    // 🔹 Add more tabs here easily
  ];

  activeTab: string = 'statement';

  switchTab(tabKey: string) {
    this.activeTab = tabKey;
  }
}
