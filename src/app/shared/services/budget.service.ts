import { Injectable } from '@angular/core';
import Dixie from 'dexie';
import { combineLatest, from, map, Observable } from 'rxjs';
import { Currency } from '../model/currency';
import { Transaction, TransactionType } from '../model/transaction';
import { AppDB } from './db';

@Injectable()
export class BudgetService {
  public readonly totalIncome$: Observable<number>;
  public readonly totalExpense$: Observable<number>;
  public readonly totalBalance$: Observable<number>;

  private readonly _transactions$!: Observable<Transaction[]>;

  constructor(private db: AppDB) {
    this._transactions$ = from(
      Dixie.liveQuery(() => db.transactions.toArray())
    );

    this.totalIncome$ = this._transactions$.pipe(
      map((transactions) =>
        transactions.reduce((acc, transaction) => {
          if (transaction.type === TransactionType.Income) {
            return acc + transaction.amount;
          } else {
            return acc;
          }
        }, 0)
      )
    );
    this.totalExpense$ = this._transactions$.pipe(
      map((transactions) =>
        transactions.reduce((acc, transaction) => {
          if (transaction.type === TransactionType.Expense) {
            return acc + transaction.amount;
          } else {
            return acc;
          }
        }, 0)
      )
    );
    this.totalBalance$ = combineLatest([
      this.totalIncome$,
      this.totalExpense$,
    ]).pipe(map(([totalIncome, totalExpense]) => totalIncome - totalExpense));
  }

  public get incomes$(): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) =>
        transactions.filter(
          (transaction) => transaction.type === TransactionType.Income
        )
      )
    );
  }

  public get expenses$(): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) =>
        transactions.filter(
          (transaction) => transaction.type === TransactionType.Expense
        )
      )
    );
  }

  public get transactions$(): Observable<Transaction[]> {
    return this._transactions$;
  }

  public async addTransactionAsync(transaction: Transaction): Promise<void> {
    await this.db.transactions.add(transaction);
  }

  public async addIncomeAsync(amount: number): Promise<void> {
    await this.addTransactionAsync({
      amount,
      date: new Date(),
      description: 'test',
      type: TransactionType.Income,
      currency: Currency.HUF,
    });
  }

  public async addExpenseAsync(amount: number): Promise<void> {
    this.addTransactionAsync({
      amount,
      date: new Date(),
      description: 'test',
      type: TransactionType.Expense,
      currency: Currency.HUF,
    });
  }

  printTest(): void {
    console.log('printTest');
  }
}
