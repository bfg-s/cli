export interface NumInterface {
    isNumber (num: any): boolean
}

export class Num implements NumInterface {

    /**
     * Check is number
     * @param num
     */
    isNumber (num: any) {
        return !isNaN(Number(num))
    }
}