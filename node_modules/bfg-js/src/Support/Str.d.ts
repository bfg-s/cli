interface anyItems {
    [key: string]: any;
}
export interface StrInterface {
    preg_match_all<T extends string>(pattern: RegExp, str: T): T;
    replace_tags<T extends string>(target: T, params: Object, markers: Array<T> | T): T;
}
export declare class Str {
    /**
     * Convert html text to nodes
     * @param html
     */
    to_nodes(html: string): any[] & NodeListOf<ChildNode>;
    /**
     * Preg match all how in PHP
     * @param pattern
     * @param str
     */
    preg_match_all(pattern: RegExp, str: string): any[][];
    /**
     * Replace tags in string by params
     * @param target
     * @param params
     * @param markers
     */
    replace_tags(target: string, params: Object, markers?: Array<string> | string): string;
    /**
     * Check end string with
     * @param str
     * @param end
     */
    end_with(str: string, end: string): boolean;
    /**
     * Check start string with
     * @param str
     * @param start
     */
    start_with(str: string, start: string): boolean;
    /**
     * Check has in string
     * @param str
     * @param contain
     */
    contains(str: string, contain: string): boolean;
    /**
     * Get dir name
     * @param path
     */
    dirname(path: string): string;
    /**
     * Transform to camel case
     * @param str
     * @param first
     */
    camel(str: string, first?: boolean): string;
    /**
     * Text to slug
     * @param str
     * @param separator
     */
    snake(str: string, separator?: string): string;
    /**
     * Text to translit
     * @param str
     */
    translit(str: string): string;
    /**
     * Slubable string
     * @param str
     * @param separator
     */
    slug(str: string, separator?: string): string;
    /**
     * Get query value
     * @param name
     */
    query_get(name?: string | null): any;
    /**
     * Determine if a given string matches a given pattern.
     * @param pattern
     * @param text
     */
    is(pattern: string, text: string): boolean;
    /**
     * Trip whitespace (or other characters) from the beginning and end of a string
     * @param str
     * @param charlist
     * @returns {*}
     */
    trim(str: string, charlist: string): string;
    /**
     * Number formatter
     * @param num
     * @param decimals
     * @param dec_point
     * @param thousands_sep
     */
    number_format(num: string | number, decimals?: number, dec_point?: string, thousands_sep?: string): string;
    /**
     * Create http query
     * @param obj
     * @param num_prefix
     * @param temp_key
     */
    http_build_query(obj: anyItems, num_prefix?: string | null, temp_key?: string | null): string;
}
export {};
