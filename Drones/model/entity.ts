import { KeyDown } from "../services/key-status";

export interface Entity {
    Color: string;
    Width: number;
    Height: number;
    X: number;
    Y: number;
    sprite: HTMLImageElement;

    draw(canvas: CanvasRenderingContext2D);
    explode();
    update(canvas: CanvasRenderingContext2D, keyHandler: KeyDown, dT: number);
}
