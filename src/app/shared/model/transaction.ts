import { Currency } from "./currency";

export enum TransactionType {
  Income = "Income",
  Expense = "Expense"
}

export interface Transaction {
  id: number;
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  currency: Currency;
}
