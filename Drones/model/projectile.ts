import { Entity } from './entity';
import { KeyDown } from "../services/key-status";

export class Projectile implements Entity {
    
    sprite: HTMLImageElement;
    Color = 'fff';
    Width = 30;
    Height = 15;
    X: number;
    Y: number;
    Speed: number;
    active: Boolean = true;
    powerup: Boolean = false;

    constructor(){
        this.sprite = new Image();
     }

    draw(canvas: CanvasRenderingContext2D) {
        canvas.fillStyle = this.Color;
        canvas.drawImage(this.sprite, this.X, this.Y, this.Width, this.Height);
    }
    explode() {
        this.active = false;
    }
    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        if(!this.inBounds(canvas)){
            this.active = false;
        }else{
            this.X -= this.Speed * dT;
        }
    }

    inBounds(canvas: CanvasRenderingContext2D){
        return this.X >= 0 && this.X <= canvas.canvas.width &&
        this.Y >= 0 && this.Y <= canvas.canvas.height;
    }
}
