import {ApplicationContainer} from "./Application";

export interface ServiceProviderInterface<T> {
    app: T
    register? (): void
    boot? (): void
}

export interface ServiceProviderConstructor {
    new <T extends ApplicationContainer>(app?: T): ServiceProvider<T>;
}

export abstract class ServiceProvider<T extends ApplicationContainer> implements ServiceProviderInterface<T> {

    name?: string|Function

    require?: Array<string>

    constructor(
        public app: T
    ) {
        if ('require' in this && typeof this.require === 'object') {
            for (let ext of this.require) {
                if (!app.has(`ext_${ext}`)) {
                    app.log.error(`Don't have a module [${ext}]`);
                    return {} as this;
                }
            }
            // let i: number;
            // for (i; i <= require.length; i++) {
            //     let ext = (require as anyObject)[i];
            //     if (!app.has(`ext_${ext}`)) {
            //         app.log.error(`Don't have a module [${ext}]`);
            //         return {} as this;
            //     }
            // }
        }
        if ('name' in this) {
            app.bind(`ext_${this.name}`, true)
        }
    }
}