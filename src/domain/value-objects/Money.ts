export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    if (amount < 0) throw new Error("Amount must be non-negative");
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Invalid currency code");
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error("Currency mismatch");
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) throw new Error("Currency mismatch");
    if (this.amount < other.amount) throw new Error("Insufficient funds");
    return new Money(this.amount - other.amount, this.currency);
  }
}
