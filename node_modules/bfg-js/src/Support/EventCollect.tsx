export interface EventInterface {
    [key: string]: Function|any
    events: EventListInterface
    fire (event: string, ...data: Array<any>): any
    on (name: string, cb: Function): void
    off (name: string, cb?: Function): boolean
}

export interface EventListInterface {
    [key: string]: Array<Function>
}

export class EventCollect implements EventInterface {

    static global: EventCollect;

    events: EventListInterface = {};

    constructor() {
        EventCollect.global = this;
        return new Proxy(((name: string, ...data: Array<any>) => {
            return EventCollect.global.fire(name, ...data);
        }) as any, {
            has (target: Function, p: string) {
                if (p === 'proxy') return true;
                return EventCollect.global.has(p);
            },
            get (target: Function, prop: string) {
                if (prop in EventCollect.global) {
                    return (EventCollect.global as any)[prop];
                }
                return (...data: Array<any>) => {
                    return EventCollect.global.fire(prop, ...data);
                };
            },
            set (target: Function, p: string, value: any, receiver: any) {
                return EventCollect.global.on(p, value);
            },
            deleteProperty (target: Function, p: string) {
                return EventCollect.global.off(p);
            }
        } as any);
    }

    fire (event: string, ...data: Array<any>) {
        if (event in this.events) {
            this.events[event].map((cb: Function) => {
                if (cb) {
                    let r = cb(...data);
                    if (typeof r !== 'undefined') data[0] = r;
                }
            });
        }
        return 0 in data ? data[0] : null;
    }

    on (names: string|Array<string>, cb: Function|Array<Function>) {

        if (!Array.isArray(names)) names = [names];

        names.map((name: string) => {

            if (!(name in this.events)) {

                this.events[name] = [];
            }

            if (typeof cb === 'function') {
                this.events[name].push(cb);
            }

            else if (Array.isArray(cb)) {
                cb.map((cbb: Function) => {
                    if (typeof cbb === 'function') {
                        this.events[name].push(cbb);
                    }
                });
            }
        });
    }

    off (name: string, cb?: Function) {
        if (name in this.events) {
            if (typeof cb === 'function') {
                let ret = false;
                this.events[name] = this.events[name].filter((func: Function) => {
                    let r = func !== cb; ret = true; return r;
                });
                return ret;
            } else {
                delete this.events[name];
                return true;
            }
        }

        return false;
    }

    has (name: string) {
        return name in this.events;
    }
}