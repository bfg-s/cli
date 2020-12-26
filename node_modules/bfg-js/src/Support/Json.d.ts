interface anyObject {
    [key: string]: any;
}
export interface JsonInterface {
    encode(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    decode(text: string, reviver?: (this: any, key: string, value: any) => any): anyObject;
}
export declare class Json implements JsonInterface {
    /**
     * JSON stringify
     * @param value
     * @param replacer
     * @param space
     */
    encode(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    /**
     * JSON parse
     * @param text
     * @param reviver
     */
    decode(text: string, reviver?: (this: any, key: string, value: any) => any): anyObject;
}
export {};
