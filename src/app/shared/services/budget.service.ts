import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import { Currency } from '../model/currency';
import { Transaction, TransactionType } from '../model/transaction';

@Injectable()
export class BudgetService {
  private _totalIncome: number;
  private _totalExpense: number;
  private _totalBalance: number;

  private _transactions: Transaction[] = [];
  private readonly _transactions$: BehaviorSubject<Transaction[]>;

  public readonly totalIncome: Observable<number>;
  public readonly totalExpense: Observable<number>;
  public readonly totalBalance: Observable<number>;

  constructor() {
    this._totalIncome = 0;
    this._totalExpense = 0;
    this._totalBalance = 0;

    this._transactions$ = new BehaviorSubject<Transaction[]>(
      this._transactions
    );

    this.totalIncome = this._transactions$.pipe(
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
    this.totalExpense = this._transactions$.pipe(
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
    this.totalBalance = combineLatest([
      this.totalIncome,
      this.totalExpense,
    ]).pipe(map(([totalIncome, totalExpense]) => totalIncome - totalExpense));

    this.addIncome(100);
    this.addExpense(50);
    this.addIncome(200);
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
    return this._transactions$.asObservable();
  }

  public addTransaction(transaction: Transaction): void {
    this._transactions.push(transaction);
    this._transactions$.next(this._transactions);
  }

  public addIncome(amount: number): void {
    this.addTransaction({
      id: 0,
      amount,
      date: new Date(),
      description: 'test',
      type: TransactionType.Income,
      currency: Currency.HUF
    });
  }

  public addExpense(amount: number): void {
    this.addTransaction({
      id: 0,
      amount,
      date: new Date(),
      description: 'test',
      type: TransactionType.Expense,
      currency: Currency.HUF
    });
  }

  printTest(): void {
    console.log('printTest');
  }
}
