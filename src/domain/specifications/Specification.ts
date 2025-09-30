export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(private one: Specification<T>, private other: Specification<T>) { super(); }
  isSatisfiedBy(candidate: T) { return this.one.isSatisfiedBy(candidate) && this.other.isSatisfiedBy(candidate); }
}

class OrSpecification<T> extends Specification<T> {
  constructor(private one: Specification<T>, private other: Specification<T>) { super(); }
  isSatisfiedBy(candidate: T) { return this.one.isSatisfiedBy(candidate) || this.other.isSatisfiedBy(candidate); }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private spec: Specification<T>) { super(); }
  isSatisfiedBy(candidate: T) { return !this.spec.isSatisfiedBy(candidate); }
}
