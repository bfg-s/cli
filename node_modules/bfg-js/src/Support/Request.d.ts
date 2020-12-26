import { ServiceProvider, ApplicationContainer } from "bfg-js";
export interface anyObject {
    [key: string]: any;
}
export interface requestObject {
    method?: string;
    url?: string;
    headers?: anyObject;
    token?: string;
    body: any;
}
export declare class Request extends ServiceProvider<ApplicationContainer> {
    register(): void;
}
