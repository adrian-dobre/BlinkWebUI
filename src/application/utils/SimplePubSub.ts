/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export enum PubSubEvent {
    HTTP_REQUEST_STARTED,
    HTTP_REQUEST_SUCCESS,
    HTTP_REQUEST_FAILED,
    HTTP_REQUEST_ENDED,
    HTTP_REQUEST_UNAUTHORIZED,
    UI_CONSOLE_ERROR,
    UI_CONSOLE_WARN,
    UI_CONSOLE_INFO,
    UI_CONSOLE_SUCCESS,
}

export default class SimplePubSub {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static registry: { [k in PubSubEvent]?: ((event: any) => void)[] } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static subscribe(event: PubSubEvent, handler: (data: any) => void): void {
        if (!SimplePubSub.registry[event]) {
            SimplePubSub.registry[event] = [];
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        SimplePubSub.registry[event]!.push(handler);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static unsubscribe(event: PubSubEvent, handler: ((data: any) => void)): void {
        if (SimplePubSub.registry[event]) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            SimplePubSub.registry[event]!.forEach((registeredHandler) => {
                if (registeredHandler === handler) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    delete SimplePubSub.registry[event]![registeredHandler as keyof object];
                }
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static publish(event: PubSubEvent, data: any = {}): void {
        if (SimplePubSub.registry[event]) {
            setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                SimplePubSub.registry[event]!.forEach((handler) => {
                    handler(data);
                });
            });
        }
    }
}
