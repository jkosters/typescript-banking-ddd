import { Money } from "../value-objects/Money";
import { Entity } from "../common/Entity";
import { FundsDeposited } from "../events/FundsDeposited";
import { FundsWithdrawn } from "../events/FundsWithdrawn";
import { Transaction } from "./Transaction";
import { v4 as uuidv4 } from 'uuid';
import { TransactionCreated } from "@domain/events/TransactionCreated";

export class Account extends Entity {
  private transactions: Transaction[] = [];
  private _isActive = true;

  constructor(public readonly id: string, private _balance: Money, transactions?: Transaction[]) {
    super();
    if (transactions) this.transactions = transactions.slice();
  }

  get balance(): Money { return this._balance; }
  isActive(): boolean { return this._isActive; }

  deposit(amount: Money) {
    this._balance = this._balance.add(amount);
  const tx = new Transaction(uuidv4(), this.id, 'deposit', amount, new Date());
  this.transactions.push(tx);
  this.addDomainEvent(new FundsDeposited(this.id, amount.amount, amount.currency));
  this.addDomainEvent(new TransactionCreated(tx.id, tx.accountId, tx.type, tx.amount.amount, tx.amount.currency));
  return tx.id;
  }

  withdraw(amount: Money) {
    if (!this._isActive) throw new Error("Account is inactive");
    this._balance = this._balance.subtract(amount);
  const tx = new Transaction(uuidv4(), this.id, 'withdraw', amount, new Date());
  this.transactions.push(tx);
  this.addDomainEvent(new FundsWithdrawn(this.id, amount.amount, amount.currency));
  this.addDomainEvent(new TransactionCreated(tx.id, tx.accountId, tx.type, tx.amount.amount, tx.amount.currency));
  return tx.id;
  }

  deactivate() { this._isActive = false; }

  // expose transactions for read only usage by repository/service
  getTransactions(): ReadonlyArray<Transaction> { return this.transactions.slice(); }
}
