import { ServiceProvider } from "./ServiceProvider";
interface _App<T> {
    bind<K extends PropertyKey, V>(key: K, val: V, resolve?: boolean, compute?: boolean): asserts this is ApplicationContainer<Id<T & Record<K, V>>>;
    singleton(key: string, val: any): ApplicationContainer;
    compute(key: string, val: any): ApplicationContainer;
    library(library: Function): ApplicationContainer;
    get(name: string | null, ...data: Array<any>): object;
    has(name: string | PropertyKey): boolean;
    forget(name: string): ApplicationContainer;
    resolve<K extends PropertyKey>(name: K): asserts this is ApplicationContainer<Id<K>>;
    on(event: string | Array<string>, name: string | Array<string>, cb: Function): ApplicationContainer;
    on_bind(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_get(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_resolve(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_forget(name: string | Array<string>, cb: Function): ApplicationContainer;
    on_replace(name: string | Array<string>, cb: Function): ApplicationContainer;
    register_collection(serviceProviders: Array<ServiceProvider<ApplicationContainer>>): ApplicationContainer;
    register<SPI>(serviceProvider: SPI): SPI;
    provider<SPI extends ServiceProvider<ApplicationContainer>>(serviceProvider: SPI): SPI;
    execute(serviceProviderMethod: string): ApplicationContainer;
    boot(): ApplicationContainer;
}
interface _Manipulators {
    [key: string]: any;
}
declare type Id<T> = T extends infer U ? {
    [K in keyof U]: U[K];
} : never;
export interface AppInterface {
}
export declare type ApplicationContainer<T = {}> = Readonly<T> & _App<T> & _Manipulators & AppInterface;
export interface EventAppInfo {
    name: string;
    event: string;
}
declare const _default: ApplicationContainer<{}>;
export default _default;
