import { ServiceProviderInterface } from "./ServiceProvider";
interface _App<T> {
    bind<K extends PropertyKey, V>(key: K, val: V, resolve?: boolean): asserts this is ApplicationContainer<Id<T & Record<K, V>>>;
    get(name: string | null, ...data: Array<any>): object;
    has(name: string): boolean;
    forget(name: string): ApplicationContainer;
    resolve<K extends PropertyKey>(name: K): asserts this is ApplicationContainer<Id<K>>;
    on(event: string | Array<string>, name: string | Array<string>, cb: Function): ApplicationContainer;
    on_bind(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_get(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_resolve(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_forget(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_replace(name: string | Array<string>, cb: Function): ApplicationContainer;
    provide(serviceProviderMethod: string): ApplicationContainer;
    provider<SPI extends ServiceProviderInterface>(serviceProvider: SPI): SPI;
    boot(): ApplicationContainer;
}
interface _Manipulators {
    [key: string]: any;
}
declare type Id<T> = T extends infer U ? {
    [K in keyof U]: U[K] extends (...args: any) => any ? ReturnType<U[K]> : U[K];
} : never;
export declare type ApplicationContainer<T = {}> = Readonly<T> & _App<T> & _Manipulators;
export interface EventAppInfo {
    name: string;
    event: string;
}
export declare const App: ApplicationContainer;
export {};
