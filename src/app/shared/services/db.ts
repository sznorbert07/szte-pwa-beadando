import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Currency } from '../model/currency';
import { Transaction, TransactionType } from '../model/transaction';

@Injectable()
export class AppDB extends Dexie {
  public transactions!: Dexie.Table<Transaction, number>;

  constructor() {
    super('AppDB');
    this.version(1).stores({
      transactions: '++id, date, description, amount, type, currency',
    });

    this.on('populate', () => this.populate());
  }

  private async populate() {
    await this.transactions.add({
      amount: 1500,
      date: new Date(),
      description: 'Sörre',
      currency: Currency.HUF,
      type: TransactionType.Income,
    });
  }
}
