export default class Eventing<T> {
  events: any = {};

  on = <K extends keyof T>(
    eventName: K,
    callback: (data: T[K]) => void
  ): void => {
    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  };

  trigger = <K extends keyof T>(eventName: K, data?: T[K]): void => {
    const handlers = this.events[eventName];

    if (!handlers || handlers.length === 0) {
      return;
    }

    handlers.forEach((callback) => {
      callback(data);
    });
  };
}
