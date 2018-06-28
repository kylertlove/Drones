
/**
 * Utility Class
 */
export class Utils {


    constructor() {

    }


    /**
     * Takes in an array and returns a random item from it
     * @param Array
     */
    getRandomItemFromList(list:any[]) {
        return list[Math.floor(Math.random() * Math.floor(list.length))];
    }
}
