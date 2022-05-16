import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '../../model/transaction';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  @Input('title') title: string = '';
  @Input('transactions') transactions: Transaction[] | null = [];

  constructor() {}

  ngOnInit(): void {}
}
