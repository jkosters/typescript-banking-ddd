import { DomainEvent } from "@domain/events/DomainEvent";

export type EventHandler<E = DomainEvent> = {
  handle: (event: E) => Promise<void> | void;
};

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  register(eventName: string, handler: EventHandler) {
    if (!this.handlers.has(eventName)) this.handlers.set(eventName, []);
    this.handlers.get(eventName)!.push(handler);
  }

  async publish(event: DomainEvent) {
    const name = event.constructor.name;
    const handlers = this.handlers.get(name) || [];
    for (const h of handlers) {
      await h.handle(event);
    }
  }
}
