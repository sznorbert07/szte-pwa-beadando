import { DataSource } from '@angular/cdk/table';
import { Component, OnDestroy } from '@angular/core';
import {
  combineLatest,
  concatMap,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  ReplaySubject,
  Subscription,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { Currency } from './shared/model/currency';
import { Transaction, TransactionType } from './shared/model/transaction';
import { BudgetService } from './shared/services/budget.service';
import { QuoteApiService } from './shared/services/quote-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public readonly totalIncome$: Observable<number>;
  public readonly totalExpense$: Observable<number>;
  public readonly totalBalance$: Observable<number>;

  public readonly transactions$: Observable<Transaction[]>;

  public readonly currencies = Object.values(Currency);

  public motd: string = '';

  public displayedColumns: string[] = [
    'currency',
    'totalIncome',
    'totalExpense',
    'totalBalance',
  ];

  public dataSource = new ExampleDataSource([]);

  private dataSourceSubscription: Subscription;

  constructor(
    private budgetService: BudgetService,
    private quoteApi: QuoteApiService
  ) {
    this.totalIncome$ = this.budgetService.totalIncome$;
    this.totalExpense$ = this.budgetService.totalExpense$;
    this.totalBalance$ = this.budgetService.totalBalance$;

    this.transactions$ = this.budgetService.transactions$;

    this.dataSourceSubscription = of(this.currencies)
      .pipe(
        concatMap((currencies) =>
          combineLatest(
            currencies.map((currency) =>
              this.getStatisticsForCurrency(currency)
            )
          )
        )
      )
      .subscribe((statistics) => this.dataSource.setData(statistics));

    this.quoteApi
      .getQuote()
      .pipe(
        tap(
          (quote) =>
            (this.motd = `"${
              quote.quote
            }" - ${quote.date.toLocaleDateString()}`)
        )
      )
      .subscribe();
  }

  public onTransactionSubmit(transaction: Transaction) {
    this.budgetService.addTransactionAsync(transaction);
  }

  public getTotalIncomeByCurrency(currency: Currency): Observable<number> {
    return this.transactions$.pipe(
      map((transactions) =>
        transactions
          .filter((transaction) => transaction.type === TransactionType.Income)
          .filter((transaction) => transaction.currency === currency)
          .reduce((acc, transaction) => acc + transaction.amount, 0)
      )
    );
  }

  public getTotalExpenseByCurrency(currency: Currency): Observable<number> {
    return this.transactions$.pipe(
      map((transactions) =>
        transactions
          .filter((transaction) => transaction.type === TransactionType.Expense)
          .filter((transaction) => transaction.currency === currency)
          .reduce((acc, transaction) => acc + transaction.amount, 0)
      )
    );
  }

  public getTotalBalanceByCurrency(currency: Currency): Observable<number> {
    return combineLatest([
      this.getTotalIncomeByCurrency(currency),
      this.getTotalExpenseByCurrency(currency),
    ]).pipe(map(([totalIncome, totalExpense]) => totalIncome - totalExpense));
  }

  private getStatisticsForCurrency(currency: Currency) {
    return combineLatest([
      this.getTotalIncomeByCurrency(currency),
      this.getTotalExpenseByCurrency(currency),
      this.getTotalBalanceByCurrency(currency),
    ]).pipe(
      map(([totalIncome, totalExpense, totalBalance]) => {
        return {
          currency,
          totalIncome,
          totalExpense,
          totalBalance,
        } as BudgetStatistics;
      })
    );
  }

  ngOnDestroy(): void {
    this.dataSourceSubscription.unsubscribe();
  }
}

export interface BudgetStatistics {
  currency: Currency;
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}

export class ExampleDataSource extends DataSource<BudgetStatistics> {
  private _dataStream = new ReplaySubject<BudgetStatistics[]>();

  constructor(initialData: BudgetStatistics[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<BudgetStatistics[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: BudgetStatistics[]) {
    this._dataStream.next(data);
  }
}
