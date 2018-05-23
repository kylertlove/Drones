
/**
 * Object for clickable elements on the canvas
 */
export class CanvasButton {

    /**
     * 
     * @param name 
     * @param x X Position
     * @param y Y Position
     * @param w Width
     * @param h Height
     */
    constructor(public name:CANVAS_BUTTON_NAME ,public x:number, public y:number, public w:number, public h:number){

    }

    isWithinBounds(posX: number, posY: number):boolean {
        return posX < this.x + this.w && posX > this.x &&
               posY < this.y + this.h && posY > this.y;
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

export enum CANVAS_BUTTON_NAME {
    GAME_PLAY, AUDIO_PLAY, NEXT, VOLUME_UP, VOLUME_DOWN, RESTART
}