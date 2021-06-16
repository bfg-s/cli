import { ServiceProvider } from "./ServiceProvider";
import { ApplicationContainer } from "./Application";
export interface KernelInterface {
    globalize(): void;
}
export declare class Kernel extends ServiceProvider<ApplicationContainer> implements KernelInterface {
    register(): void;
    boot(): void;
    globalize(): void;
    static version(): string;
    static sys(): "browser" | "node";
    static os(): string;
}
