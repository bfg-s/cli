import { ApplicationContainer } from "./Application";
interface anyItems {
    [key: string]: any;
}
export interface ObjInterface {
    app: ApplicationContainer;
    each(target: anyItems, callback: (item: any, key: string | Number) => any): anyItems;
    get_start_with(target: anyItems, start: string): anyItems;
    get_end_with(target: anyItems, start: string): anyItems;
    flip<T>(trans: T): T;
    first_key(target: Array<any> | object): PropertyKey;
    last_key(target: Array<any> | object): PropertyKey;
    first(target: anyItems): any;
    last(target: anyItems): any;
    merge_recursive(target: anyItems, ...sources: Array<any>): anyItems;
    isClass(data: any): boolean;
    isArray(obj: any): boolean;
    isEmptyObject(val: object | Array<any>): boolean;
    isObject(val: any): boolean;
    isArrayOrObject(val: any): boolean;
    dot(obj: anyItems, tgt?: anyItems, path?: Array<any>, useBrackets?: boolean, keepArray?: boolean, separator?: string): anyItems;
}
export declare class Obj implements ObjInterface {
    app: ApplicationContainer;
    /**
     * Obj constructor
     * @param app
     */
    constructor(app: ApplicationContainer);
    getElementAttrs(el: HTMLElement): anyItems;
    /**
     * Make observiable object
     * @param target
     * @param events
     * @param revocable
     */
    observer<T extends object>(target?: T, events?: ProxyHandler<T>, revocable?: boolean): {};
    has(str: string | number, obj: anyItems): any;
    /**
     * Get by dots
     * @param str
     * @param obj
     */
    get(str: string | number, obj: anyItems): any;
    /**
     * Set by dots
     * @param str
     * @param value
     * @param obj
     */
    set(str: string | number, value: any, obj: anyItems): void;
    /**
     * Each object or array
     * @param target
     * @param callback
     */
    each(target: anyItems, callback: (item: any, key: string | Number) => any): anyItems;
    /**
     * Get data with needle start
     * @param target
     * @param start
     */
    get_start_with(target: anyItems, start: string): any;
    /**
     * Get data with needle end
     * @param target
     * @param end
     */
    get_end_with(target: anyItems, end: string): any;
    /**
     * Flip object
     * @param trans
     */
    flip<T extends anyItems>(trans: T): T;
    /**
     * Get object or array a first key
     * @param target
     */
    first_key(target: Array<any> | object): PropertyKey;
    /**
     * Get object or array a last key
     * @param target
     */
    last_key(target: Array<any> | object): PropertyKey;
    /**
     * Get object or array a first value
     * @param target
     */
    first(target: anyItems): any;
    /**
     * Get object or array a last value
     * @param target
     */
    last(target: anyItems): any;
    /**
     * Merge recursive objects
     * @param target
     * @param sources
     */
    merge_recursive(target: anyItems, ...sources: Array<any>): object;
    /**
     * is Class
     * @param data
     */
    isClass(data: any): boolean;
    /**
     * Is Array
     * @param obj
     */
    isArray(obj: any): boolean;
    /**
     * Is empty object
     * @param val
     */
    isEmptyObject(val: object | Array<any>): boolean;
    /**
     * Is Object
     * @param val
     */
    isObject(val: any): boolean;
    /**
     * Is Array or Object
     * @param val
     */
    isArrayOrObject(val: any): boolean;
    /**
     * Make dot object
     * @param obj
     * @param tgt
     * @param path
     * @param useBrackets
     * @param keepArray
     * @param separator
     */
    dot(obj: anyItems, tgt?: anyItems, path?: Array<any>, useBrackets?: boolean, keepArray?: boolean, separator?: string): anyItems;
}
export {};
