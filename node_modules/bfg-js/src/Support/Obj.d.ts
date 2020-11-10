interface anyItems {
    [key: string]: any;
}
export interface ObjInterface {
    flip<T>(trans: T): T;
    first_key(target: Array<any> | object): PropertyKey;
    last_key(target: Array<any> | object): PropertyKey;
    first(target: anyItems): any;
    last(target: anyItems): any;
    merge_recursive(target: anyItems, ...sources: Array<any>): object;
    isClass(data: any): boolean;
    isArray(obj: any): boolean;
    isEmptyObject(val: object | Array<any>): boolean;
    isObject(val: any): boolean;
    isArrayOrObject(val: any): boolean;
    dot(obj: anyItems, tgt?: anyItems, path?: Array<any>, useBrackets?: boolean, keepArray?: boolean, separator?: string): object;
}
export declare class Obj implements ObjInterface {
    /**
     * Flip object
     * @param trans
     */
    flip<T extends anyItems>(trans: T): T;
    /**
     * Get object or array a first key
     * @param target
     */
    first_key(target: Array<any> | object): string;
    /**
     * Get object or array a last key
     * @param target
     */
    last_key(target: Array<any> | object): string;
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
