import { Currency } from './currency';

export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export interface Transaction {
  id?: number;
  amount: number;
  currency: Currency;
  date: Date;
  description: string;
  type: TransactionType;
}
