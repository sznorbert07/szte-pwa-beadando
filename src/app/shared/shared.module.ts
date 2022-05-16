import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { BudgetService } from './services/budget.service';

@NgModule({
  declarations: [TransactionListComponent],
  imports: [CommonModule, MatListModule, MatIconModule],
  providers: [BudgetService],
  exports: [TransactionListComponent],
})
export class SharedModule {}
