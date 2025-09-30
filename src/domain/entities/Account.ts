import { Money } from "../value-objects/Money";
import { Entity } from "../common/Entity";
import { FundsDeposited } from "../events/FundsDeposited";
import { FundsWithdrawn } from "../events/FundsWithdrawn";

export class Account extends Entity {
  private transactions: Array<{ type: string; amount: Money; timestamp: Date }> = [];
  private _isActive = true;

  constructor(public readonly id: string, private _balance: Money) {
    super();
  }

  get balance(): Money { return this._balance; }
  isActive(): boolean { return this._isActive; }

  deposit(amount: Money) {
    this._balance = this._balance.add(amount);
    this.transactions.push({ type: "deposit", amount, timestamp: new Date() });
    this.addDomainEvent(new FundsDeposited(this.id, amount.amount, amount.currency));
  }

  withdraw(amount: Money) {
    if (!this._isActive) throw new Error("Account is inactive");
    this._balance = this._balance.subtract(amount);
    this.transactions.push({ type: "withdraw", amount, timestamp: new Date() });
    this.addDomainEvent(new FundsWithdrawn(this.id, amount.amount, amount.currency));
  }

  deactivate() { this._isActive = false; }
}
