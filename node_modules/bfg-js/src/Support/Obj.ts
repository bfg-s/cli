import {ApplicationContainer} from "./Application";

interface anyItems {
    [key: string]: any;
}

export interface ObjInterface {
    app: ApplicationContainer
    each (target: anyItems, callback: (item: any, key: string|Number) => any): anyItems
    get_start_with (target: anyItems, start: string): anyItems
    get_end_with (target: anyItems, start: string): anyItems
    flip<T>(trans: T): T
    first_key (target: Array<any>|object): PropertyKey
    last_key (target: Array<any>|object): PropertyKey
    first (target: anyItems): any
    last (target: anyItems): any
    merge_recursive(target: anyItems, ...sources: Array<any>): anyItems
    isClass (data: any): boolean
    isArray (obj: any): boolean
    isEmptyObject (val: object|Array<any>): boolean
    isObject (val: any): boolean
    isArrayOrObject (val: any): boolean
    dot (obj: anyItems, tgt?: anyItems, path?: Array<any>, useBrackets?: boolean, keepArray?: boolean, separator?: string): anyItems
}

export class Obj implements ObjInterface {

    app: ApplicationContainer;

    /**
     * Obj constructor
     * @param app
     */
    constructor(app: ApplicationContainer) {
        this.app = app;
    }

    getElementAttrs (el: HTMLElement) {
        let result: anyItems = {};
        [].slice.call(el.attributes).map((attr: Attr) => {
            result[attr.name] = attr.value;
        });
        return result;
    }

    /**
     * Make observiable object
     * @param target
     * @param events
     * @param revocable
     */
    observer <T extends object>(target?: T, events?: ProxyHandler<T>, revocable: boolean = false) {
        return revocable ? new Proxy(target || {}, events || {}) :
            Proxy.revocable(target || {}, events || {});
    }

    has (str: string|number, obj: anyItems) {
        return String(str).split('.').reduce((o,i)=>o[i], obj);
    }

    /**
     * Get by dots
     * @param str
     * @param obj
     */
    get (str: string|number, obj: anyItems) {
        return String(str).split('.').reduce(function(obj: anyItems, i: string) {
            return obj[i];
        }, obj);
    }

    /**
     * Set by dots
     * @param str
     * @param value
     * @param obj
     */
    set (str: string|number, value: any, obj: anyItems) {
        let levels = String(str).split('.');
        let max_level = levels.length - 1;
        let target: any = obj;
        levels.some(function (level, i) {
            if (typeof level === 'undefined') {
                return true;
            }
            if (i === max_level) {
                target[level] = value;
            } else {
                let obj = target[level] || {};
                target[level] = obj;
                target = obj;
            }
        });
    }

    /**
     * Each object or array
     * @param target
     * @param callback
     */
    each(target: anyItems, callback: (item: any, key: string|Number) => any): anyItems {
        let resultTarget: anyItems = Array.isArray(target) ? [] : {};
        Object.keys(target).map((k: string) => resultTarget[k] = callback(target[k], k));
        return resultTarget;
    }

    /**
     * Get data with needle start
     * @param target
     * @param start
     */
    get_start_with (target: anyItems, start: string) {
        let result: any = null;
        start = start.replace(/\*/g, '00110011');
        Object.keys(target).map((b) => {

            if (!result && this.app.str.start_with(target[b].replace(/\*/g, '00110011'), start)) {
                result = target[b];
            }
        });
        return result;
    }

    /**
     * Get data with needle end
     * @param target
     * @param end
     */
    get_end_with (target: anyItems, end: string) {
        let result: any = null;
        Object.keys(target).map((b) => {
            if (!result && this.app.str.end_with(target[b], end)) {
                result = target[b];
            }
        });
        return result;
    }

    /**
     * Flip object
     * @param trans
     */
    flip<T extends anyItems>(trans: T) {
        let key, tmp_ar: T = {} as any;

        for ( key in trans )
        {
            if ( trans.hasOwnProperty( key ) )
            {
                (tmp_ar as any)[trans[key]] = key;
            }
        }

        return tmp_ar;
    }

    /**
     * Get object or array a first key
     * @param target
     */
    first_key (target: Array<any>|object): PropertyKey {

        let keys: Array<string> = Object.keys(target);
        return (0 in keys ? keys[0] : null) as PropertyKey;
    }

    /**
     * Get object or array a last key
     * @param target
     */
    last_key (target: Array<any>|object): PropertyKey {

        let keys: Array<string> = Object.keys(target);
        let last_index = keys.length - 1;
        return (last_index in keys ? keys[last_index] : null) as PropertyKey;
    }

    /**
     * Get object or array a first value
     * @param target
     */
    first (target: anyItems) {

        let key = this.first_key(target);

        return key ? target[key as string] : null;
    }

    /**
     * Get object or array a last value
     * @param target
     */
    last (target: anyItems) {

        let key = this.last_key(target);

        return key ? target[key as string] : null;
    }

    /**
     * Merge recursive objects
     * @param target
     * @param sources
     */
    merge_recursive(target: anyItems, ...sources: Array<any>) {
        if (!sources.length) return target;
        const source: anyItems = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) {
                        Object.assign(target, { [key]: {} });
                    }else{
                        target[key] = Object.assign({}, target[key])
                    }
                    this.merge_recursive(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        let lr: object = this.merge_recursive(target, ...sources);

        return lr;
    }

    /**
     * is Class
     * @param data
     */
    isClass (data: any) {
        let str = String(data);
        return (str === "[object Object]" &&
            typeof data === 'function') || /^class\s.*/.test(str.trim());
    }

    /**
     * Is Array
     * @param obj
     */
    isArray (obj: any) {
        return Array.isArray(obj);
    }

    /**
     * Is empty object
     * @param val
     */
    isEmptyObject(val: object|Array<any>) {
        return Object.keys(val).length === 0
    }

    /**
     * Is Object
     * @param val
     */
    isObject (val: any) {
        return Object.prototype.toString.call(val) === '[object Object]'
    }

    /**
     * Is Array or Object
     * @param val
     */
    isArrayOrObject (val: any) {
        return Object(val) === val
    }

    /**
     * Make dot object
     * @param obj
     * @param tgt
     * @param path
     * @param useBrackets
     * @param keepArray
     * @param separator
     */
    dot (
        obj: anyItems,
        tgt: anyItems = {},
        path: Array<any> = [],
        useBrackets: boolean = false,
        keepArray: boolean = false,
        separator: string = "."
    ) {

        Object.keys(obj).forEach(
            (key) => {

                let index = this.isArray && useBrackets ? '[' + key + ']' : key;

                if (
                    this.isArrayOrObject(obj[key]) &&
                    ((this.isObject(obj[key]) && !this.isEmptyObject(obj[key])) ||
                        (this.isArray(obj[key]) && !keepArray && obj[key].length !== 0))
                ) {
                    if (this.isArray && useBrackets) {

                        let previousKey = path[path.length - 1] || '';

                        return this.dot(
                            obj[key],
                            tgt,
                            path.slice(0, -1).concat(previousKey + index)
                        )
                    } else {

                        return this.dot(obj[key], tgt, path.concat(index))
                    }
                } else {

                    if (this.isArray && useBrackets) {

                        tgt[path.join(separator).concat('[' + key + ']')] = obj[key]

                    } else {

                        tgt[path.concat(index).join(separator)] = obj[key]
                    }
                }
            }
        );

        return tgt
    }
}