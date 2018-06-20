
/**
 * Object for clickable elements on the canvas
 */
export class CanvasShape {

    /**
     * 
     * @param name 
     * @param x X Position
     * @param y Y Position
     * @param w Width
     * @param h Height
     */
    constructor(public x:number, public y:number, public w:number, public h:number){

    }
}

/**
 * Object for Text elements on the canvas
 */
export class CanvasText {

    /**
     * 
     * @param word String to show
     * @param x X Position
     * @param y Y Position
     * @param color color of Text
     * @param font Size and Font of text
     */
    constructor(public word:string, public x:number, public y:number, public color:string, public font: string){

    }
}