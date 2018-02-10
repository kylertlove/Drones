export class KeyDown {

    private keys = {
        17: false, //ctrl
        65: false, // a
        87: false, // w
        68: false, // d
        83: false, // s
        13: false, // enter
        69: false, // e
        32: false, // space
        37: false, // left
        38: false, // up
        39: false, // right
        40: false  // down
    }

        keyChange(code, UporDown) {
            this.keys[code] = UporDown;
        }

       public isLeft() {
            return this.keys[37];
        }
       public isRight() {
            return this.keys[39];
       }
       public isUp() {
            return this.keys[38];
       }
       public isDown() {
            return this.keys[40];
       }
       public isShooting() {
           return this.keys[32];
       }
       public isFireZeMissiles(){
           return this.keys[17];
       }
}
