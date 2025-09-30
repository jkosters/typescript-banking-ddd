export class CustomerName {
  constructor(public readonly firstName: string, public readonly lastName: string) {
    if (!firstName || !firstName.trim()) throw new Error('First name is required');
    if (!lastName || !lastName.trim()) throw new Error('Last name is required');
  }

  get full(): string {
    return `${this.firstName.trim()} ${this.lastName.trim()}`;
  }
}
