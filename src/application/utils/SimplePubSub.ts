export enum PubSubEvent {
    HTTP_REQUEST_STARTED,
    HTTP_REQUEST_SUCCESS,
    HTTP_REQUEST_FAILED,
    HTTP_REQUEST_ENDED,
    UI_CONSOLE_ERROR,
    UI_CONSOLE_WARN,
    UI_CONSOLE_INFO,
    UI_CONSOLE_SUCCESS,
}

export default class SimplePubSub {
    static registry: { [k in PubSubEvent]?: ((event: any) => void)[] } = {};

    static subscribe(event: PubSubEvent, handler: (data: any) => void): void {
        if (!SimplePubSub.registry[event]) {
            SimplePubSub.registry[event] = [];
        }
        SimplePubSub.registry[event]!.push(handler);
    }

    static unsubscribe(event: PubSubEvent, handler: ((data: any) => void)): void {
        if (SimplePubSub.registry[event]) {
            SimplePubSub.registry[event]!.forEach((registeredHandler) => {
                if (registeredHandler === handler) {
                    delete SimplePubSub.registry[event];
                }
            });
        }
    }

    static publish(event: PubSubEvent, data: any = {}): void {
        if (SimplePubSub.registry[event]) {
            setTimeout(() => {
                SimplePubSub.registry[event]!.forEach((handler) => {
                    handler(data);
                });
            });
        }
    }
}
