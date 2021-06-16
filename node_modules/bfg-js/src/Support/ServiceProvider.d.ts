import { ApplicationContainer } from "./Application";
export interface ServiceProviderInterface<T> {
    app: T;
    register?(): void;
    boot?(): void;
}
export interface ServiceProviderConstructor {
    new <T extends ApplicationContainer>(app?: T): ServiceProvider<T>;
}
export declare abstract class ServiceProvider<T extends ApplicationContainer> implements ServiceProviderInterface<T> {
    app: T;
    name?: string | Function;
    require?: Array<string>;
    constructor(app: T);
}
