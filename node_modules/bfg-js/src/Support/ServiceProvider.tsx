import {ApplicationContainer} from "./Application";

export interface ServiceProviderInterface {
    app: ApplicationContainer,
    register (): void,
    boot (): void
}

export abstract class ServiceProvider implements ServiceProviderInterface {

    abstract app: ApplicationContainer;

    abstract register (): void;

    abstract boot (): void;
}