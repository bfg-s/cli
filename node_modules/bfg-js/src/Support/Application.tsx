import {ServiceProvider, ServiceProviderInterface} from "./ServiceProvider";

interface _App<T> {
    bind<K extends PropertyKey, V>(key: K, val: V, resolve?: boolean): asserts this is ApplicationContainer<Id<T & Record<K, V>>>;
    get(name: string|null, ...data: Array<any>): object;
    has(name: string): boolean;
    forget(name: string): ApplicationContainer;
    resolve<K extends PropertyKey>(name: K): asserts this is ApplicationContainer<Id<K>>;
    on(event: string|Array<string>, name: string|Array<string>, cb: Function): ApplicationContainer;
    on_bind(name: string|Array<string>, cb: Function): ApplicationContainer;
    on_get(name: string|Array<string>, cb: Function): ApplicationContainer;
    on_resolve(name: string|Array<string>, cb: Function): ApplicationContainer;
    on_forget(name: string|Array<string>, cb: Function): ApplicationContainer;
    on_replace(name: string|Array<string>, cb: Function): ApplicationContainer;
    provide(serviceProviderMethod: string): ApplicationContainer;
    provider<SPI extends ServiceProviderInterface>(serviceProvider: SPI): SPI;
    boot(): ApplicationContainer;
}
interface _Manipulators {
    [key: string]: any;
}
interface appItem {
    data: any|null,
    resolve: any|null,
    resolved: boolean,
    etc?: appItem,
    on_bind?: Array<Function>,
    on_get?: Array<Function>,
    on_resolve?: Array<Function>,
    on_forget?: Array<Function>,
    on_replace?: Array<Function>,
}
interface appItemCollect {
    [key: string]: appItem;
}

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] extends (...args: any) => any ? ReturnType<U[K]> : U[K]} : never;

export declare type ApplicationContainer<T = {}> = Readonly<T> & _App<T> & _Manipulators;

export interface EventAppInfo {
    name: string,
    event: string
}

function makeApp(): ApplicationContainer {
    const items: appItemCollect = {};
    const isClass: Function = (data: any) => {
        return String(data) === "[object Object]" &&
            typeof data === 'function';
    };
    const providers: Array<ServiceProviderInterface> = [];
    const eventFn: Function = <N extends string, E extends string,T>(name: N, event: E, data: T): T => {

        let event_fool: string = `on_${event}`;

        let event_info: EventAppInfo = {name, event};

        if (name in items && event_fool in (items[name] as any)) {
            (items[name] as any)[event_fool].map((cb: Function) => {
                let result: any = cb(data, proxxy, event_info);
                if (typeof result !== 'undefined') { data = result; }
            });
        }

        if ('*' in items && event_fool in (items['*'] as any)) {
            (items['*'] as any)[event_fool].map((cb: Function) => {
                let result: any = cb(data, proxxy, event_info);
                if (typeof result !== 'undefined') { data = result; }
            });
        }

        return data;
    };
    const getter = (prop: string, ...data: Array<any>) => {
        let r: any = null;
        if (prop in items) {
            let i = items[prop];
            if (!('data' in i)) return null;
            if (i.resolve && !i.resolved) {
                if (typeof i.resolve === 'function') items[prop].data = (i.resolve)(proxxy, ...data);
                else items[prop].data = i.resolve;
                r = items[prop].data = eventFn(prop, 'resolve', items[prop].data);
            } else {
                r = items[prop].data;
                if (typeof r === 'function' && !('proxy' in r)) {
                    try {
                        r = r(proxxy, ...data);
                    } catch (e) {
                        r.proxy = true;
                    }
                }
            }
            items[prop].resolved = true;
            r = eventFn(prop, 'get', r);
        }
        return r;
    };
    const manipulators: Function = (target: any, proxxy: ApplicationContainer) => {
        return {
            bind (name: string, data: any, resolve: boolean = false) {
                let dataItem: appItem = {data: resolve ? null : data, resolve: resolve ? data : false, resolved: false};
                if ((name in items)) {

                    if (!('data' in items[name])) {
                        items[name] = {...dataItem, ...items[name]};
                    } else {
                        dataItem.etc = items[name];
                        items[name] = eventFn(name, 'replace', dataItem);
                        delete dataItem.etc;
                    }
                }
                else { items[name] = eventFn(name, 'bind', dataItem); }
                return proxxy;
            },
            get (name: string|null = null, ...data: Array<any>) {
                return name ? getter(name, ...data) : items;
            },
            has (name: string) {
                return name in items;
            },
            forget (name: string) {
                if (name in items) {
                    eventFn(name, 'forget', items[name].data);
                    delete items[name];
                    return true;
                }
                return proxxy;
            },
            resolve (name: string, ...data: Array<any>) {
                if (name in items) {
                    items[name].resolved = false;
                    return getter(name, ...data);
                }
                throw new Error(`Item [${name}] not found!`);
            },
            on (event: string|Array<string>, name: string|Array<string>, cb: Function) {
                if (event === '*') event = ['bind','get','resolve','forget','replace'];
                if (typeof name === 'string') name = [name];
                if (typeof event === 'string') event = [event];
                event.forEach((e: string) => {
                    (name as Array<string>).forEach((n: string) => {
                        e = `on_${e}`;
                        if (n in items) {
                            if (!(e in items[n])) (items[n] as any)[e] = [];
                        } else {
                            (items[n] as any) = {};
                            (items[n] as any)[e] = [];
                        }
                        (items[n] as any)[e].push(cb);
                    });
                });
                return proxxy;
            },
            on_bind (name: string, cb: Function) {
                return this.on('bind', name, cb);
            },
            on_get (name: string, cb: Function) {
                return this.on('get', name, cb);
            },
            on_resolve (name: string, cb: Function) {
                return this.on('resolve', name, cb);
            },
            on_forget (name: string, cb: Function) {
                return this.on('forget', name, cb);
            },
            on_replace (name: string, cb: Function) {
                return this.on('replace', name, cb);
            },
            provider (serviceProvider: ServiceProviderInterface) {
                serviceProvider.app = proxxy;
                if ('boot' in serviceProvider) {
                    providers.push(serviceProvider);
                }
                if ('register' in serviceProvider) {
                    serviceProvider.register();
                }
                return serviceProvider;
            },
            boot () {
                return this.provide('boot');
            },
            provide(serviceProviderMethod: string) {
                providers.forEach((serviceProvider: ServiceProviderInterface) => {
                    if (
                        serviceProviderMethod in serviceProvider &&
                        typeof (serviceProvider as any)[serviceProviderMethod] === 'function'
                    ) {
                        (serviceProvider as any)[serviceProviderMethod](proxxy);
                    }
                });
                return proxxy;
            }
        }
    };

    const prox: Function = (name: string|null = null, ...data: Array<any>) => {
        if (!name) return items;
        else return getter(name, ...data);
    };

    // @ts-ignore
    const proxxy: ApplicationContainer = new Proxy(prox as {}, {
        get(target, prop: string) {
            let mutators = manipulators(target, proxxy);
            if (prop in mutators) {
                return mutators[prop];
            }
            return getter(prop);
        },
        set(target: ApplicationContainer, p: string, value: any, receiver: any) {
            if (proxxy.has(p) && items[p].data === value) { return false; }
            manipulators(target, proxxy).bind(p, value);
            return true;
        }
    });

    return proxxy;
}

// (function() {
//     let proxyInstances: any = new WeakSet()
//     let originalProxy: any = Proxy
//     Proxy = new Proxy(Proxy, {
//         construct(target, args: any) {
//             let newProxy = new originalProxy(...args)
//             proxyInstances.add(newProxy)
//             return newProxy
//         },
//         get: function(obj, prop) {
//             if (prop == Symbol.hasInstance) {
//                 return function(instance: any) {
//                     return proxyInstances.has(instance)
//                 }
//             }
//             // @ts-ignore
//             return Reflect.get(...arguments)
//         }
//     })
// })()

export const App: ApplicationContainer = makeApp();