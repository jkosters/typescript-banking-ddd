import { Entity } from "../common/Entity";
import { Money } from "../value-objects/Money";
import { TransactionType } from "../value-objects/TransactionType";

export class Transaction extends Entity {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly type: TransactionType,
    private _amount: Money,
    public readonly occurredOn: Date = new Date()
  ) { super(); }

  get amount(): Money { return this._amount; }
}
