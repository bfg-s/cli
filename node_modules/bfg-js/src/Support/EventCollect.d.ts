export interface EventInterface {
    [key: string]: Function | any;
    events: EventListInterface;
    fire(event: string, ...data: Array<any>): any;
    on(name: string, cb: Function): void;
    off(name: string, cb?: Function): boolean;
}
export interface EventListInterface {
    [key: string]: Array<Function>;
}
export declare class EventCollect implements EventInterface {
    static global: EventCollect;
    events: EventListInterface;
    constructor();
    fire(event: string, ...data: Array<any>): any;
    on(names: string | Array<string>, cb: Function | Array<Function>): void;
    off(name: string, cb?: Function): boolean;
    has(name: string): boolean;
}
