import { ServiceProvider, ServiceProviderInterface } from "./ServiceProvider";
import { ApplicationContainer } from "./Application";
export interface KernelInterface extends ServiceProviderInterface {
    start: Number;
    dev: boolean;
    globalize(): void;
}
export declare class Kernel extends ServiceProvider implements KernelInterface {
    start: Number;
    dev: boolean;
    app: ApplicationContainer;
    constructor(start: Number, dev?: boolean);
    register(): void;
    boot(): void;
    globalize(): void;
    static version(): string;
    static sys(): "browser" | "node";
    static os(): string;
    static token(): string;
}
