import { Component } from '@angular/core';
import { Tab } from '../../MODEL/MODEL';
import { CustomersStatementReportComponent } from './customers-statement-report/customers-statement-report.component';
import { CommonModule } from '@angular/common';
import { BalanceDueComponent } from './balance-due/balance-due.component';
import { ChequeSummaryComponent } from './cheque-summary/cheque-summary.component';

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
    { id: 'balance', label: 'Balance Due', component: BalanceDueComponent },
    { id: 'cheque', label: 'Cheque Summary', component: ChequeSummaryComponent }
    // 🔹 Add more tabs here easily
  ];

  activeTab: string = 'statement';

  switchTab(tabKey: string) {
    this.activeTab = tabKey;
  }

      applyHover(event: MouseEvent) {
  const el = event.target as HTMLElement;
  if (!el) return;
  el.style.background = 'var(--tab-hover-bg)';  
}

removeHover(event: MouseEvent) {
  const el = event.target as HTMLElement;
  if (!el) return;
  el.style.background = 'transparent';
}

}
