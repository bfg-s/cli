interface anyObject {
    [key: string]: any;
}

export interface JsonInterface {
    encode (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string
    decode (text: string, reviver?: (this: any, key: string, value: any) => any): anyObject
}

export class Json implements JsonInterface {

    /**
     * JSON stringify
     * @param value
     * @param replacer
     * @param space
     */
    encode(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string {
        try {
            return JSON.stringify(value, replacer, space);
        } catch (e) {
            return "";
        }
    }

    /**
     * JSON parse
     * @param text
     * @param reviver
     */
    decode(text: string, reviver?: (this: any, key: string, value: any) => any): anyObject {
        try {
            return JSON.parse(text, reviver);
        } catch (e) {
            return {};
        }
    }
}