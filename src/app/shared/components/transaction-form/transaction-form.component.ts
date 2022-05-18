import { getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currency } from '../../model/currency';
import { Transaction, TransactionType } from '../../model/transaction';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss'],
})
export class TransactionFormComponent {
  public transactionForm: FormGroup;
  public currencies: string[] = Object.values(Currency);

  @Output('onSubmit') onSubmitEvent: EventEmitter<Transaction> =
    new EventEmitter();

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      amount: ['', Validators.required],
      currency: [Currency.HUF, Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  public get currencySymbol(): string {
    return getCurrencySymbol(this.transactionForm.value.currency, 'narrow');
  }

  public onSubmit() {
    const transaction = {
      amount: this.transactionForm.value.amount,
      currency: this.transactionForm.value.currency,
      date: new Date(),
      description: this.transactionForm.value.description,
      type: this.transactionForm.value.type,
    } as Transaction;
    this.onSubmitEvent.emit(transaction);
  }
}
