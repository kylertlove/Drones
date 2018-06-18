import { Entity } from './entity';
import { KeyDown } from '../services/key-status';

export class User implements Entity {
    sprite: HTMLImageElement;
    X: number;
    Y: number;
    Color: string;
    Width: number;
    Height: number;
    health: number;

    constructor(private color, private width, private height, private x, private y) {
        this.Color = color;
        this.Width = width;
        this.Height = height;
        this.X = x;
        this.Y = y;
        this.sprite = new Image();
    }

    draw(canvas: CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.drawImage(this.sprite, this.X, this.Y, this.width, this.height);
        //canvas.fillRect(this.X, this.Y, this.width, this.height);
    }

    explode() {
        this.health--;
        if (this.health <= 0) {
            return true;
        }
        return false;
    }

    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number) {
        //console.log('updated from user')
    }
}
