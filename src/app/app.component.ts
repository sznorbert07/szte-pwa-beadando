import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from './shared/model/transaction';
import { BudgetService } from './shared/services/budget.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public readonly totalIncome$: Observable<number>;
  public readonly totalExpense$: Observable<number>;
  public readonly totalBalance$: Observable<number>;

  public readonly transactions$: Observable<Transaction[]>;

  constructor(private budgetService: BudgetService) {
    this.totalIncome$ = this.budgetService.totalIncome$;
    this.totalExpense$ = this.budgetService.totalExpense$;
    this.totalBalance$ = this.budgetService.totalBalance$;

    this.transactions$ = this.budgetService.transactions$;
  }
}
