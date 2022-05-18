import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { BudgetService } from './services/budget.service';
import { AppDB } from './services/db';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuoteApiService } from './services/quote-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [TransactionListComponent, TransactionFormComponent],
  imports: [CommonModule, HttpClientModule, MatListModule, MatSelectModule, MatIconModule, ReactiveFormsModule, MatInputModule, MatRadioModule],
  providers: [HttpClient, QuoteApiService, AppDB, BudgetService],
  exports: [TransactionListComponent, TransactionFormComponent],
})
export class SharedModule {}
