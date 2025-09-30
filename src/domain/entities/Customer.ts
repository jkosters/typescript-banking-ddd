import { Entity } from "../common/Entity";
import { CustomerName } from "../value-objects/CustomerName";
import { Email } from "../value-objects/Email";

export class Customer extends Entity {
  private _isActive = true;

  constructor(public readonly id: string, private _name: CustomerName, private _email: Email) {
    super();
  }

  get name(): CustomerName { return this._name; }
  get email(): Email { return this._email; }
  isActive(): boolean { return this._isActive; }

  deactivate() { this._isActive = false; }
  changeEmail(newEmail: Email) { this._email = newEmail; }
  changeName(newName: CustomerName) { this._name = newName; }
}
