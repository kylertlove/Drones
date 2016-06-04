
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/


$(document).ready(function () {


    //creates the gmae map
    var CANVAS_WIDTH = window.innerWidth;
    var CANVAS_HEIGHT = window.innerHeight;
    var FPS = 30;
    var killcount = 0;
    var bossHP = 300;

    var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
      "' height='" + CANVAS_HEIGHT + "'></canvas>");
    var canvas = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('section');

    //creates a player object
    var player = {
        color: "#00A",
        x: 500,
        y: 270,
        width: 20,
        height: 30,
        draw: function () {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    //working on cloud objects
    var cloud = {
        x: 1600, y: 200,width: 20,  height: 30,
        draw: function () {  canvas.fillStyle = this.color;  canvas.fillRect(this.x, this.y, this.width, this.height); }
    };
    var cloud2 = {
        x: 900, y: 100,  width: 20,  height: 30,
        draw: function () {  canvas.fillStyle = this.color;   canvas.fillRect(this.x, this.y, this.width, this.height);
        }
    };


   // boss object
    var boss = {
        color: "#00A",
        x: 0,
        y: 900,
        hitpoints : 200,
        width: 380,
        height: 150,
        draw: function () {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    //stores bullets
    var playerBullets = [];

    //function for bullet creation
    function Bullet(I) {
        I.active = true;

        //direction of bullets
        I.xVelocity = -I.speed;
        I.yVelocity = 0;
        I.width = 9;
        I.height = 3;
        I.color = "#e50000";

        //returns boolean true if in bounds
        I.inBounds = function () {
            return I.x >= 0 && I.x <= CANVAS_WIDTH &&
              I.y >= 0 && I.y <= CANVAS_HEIGHT;
        };

        //display of bullets
        I.draw = function () {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        };

        //updates bullets location
        I.update = function () {
            I.x += I.xVelocity;
            I.y += I.yVelocity;

            I.active = I.active && I.inBounds();
        };


        I.explode = function () {
            this.active = false;
        };

        //returns bullet with updated information
        return I;
    }

    //-----------------enimies
     enemies = [];


    //--------------creates enemy
      function Enemy(I) {

        //stores ememies
        I = I || {};


        //activates it
        I.active = true;

        //sets a timer for life of enemy
        I.age = Math.floor(Math.random() * 128);

        //color of enemy?
        I.color = "#A2B";

        //spacing of enemies on page
        I.y = CANVAS_WIDTH / 12 + Math.random() * CANVAS_WIDTH / 12;
        I.x = 0;
        I.yVelocity = 0
        I.xVelocity = 2;

        I.width = 32;
        I.height = 32;

        I.inBounds = function () {
            return I.x >= 0 && I.x <= CANVAS_WIDTH &&
              I.y >= 0 && I.y <= CANVAS_HEIGHT;
        };

        I.sprite = Sprite("alienship");

        I.draw = function () {
            this.sprite.draw(canvas, this.x, this.y);
        };

        I.update = function () {
            I.x += I.xVelocity;
            I.y += I.yVelocity;

           // I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);
            I.yVelocity = 3 * Math.sin(I.age * Math.PI / 64);

            I.age++;

            I.active = I.active && I.inBounds();
        };

        I.explode = function () {
            //    Sound.play("explosion");
            //change enemy to explosion 
            I.sprite = Sprite("explode");
          //  setTimeout(function () { I.sprite = Sprite("explode1"); }, 3000);
            
            //delay deactivate for explosion
            setTimeout(function () { I.active = false; }, 200);
        };

        return I;
    };


    // game controller  
    setInterval(function () {
        update();
        draw();
        
    }, 1000 / FPS);

    
    //update the game
    function update() {
        if (keydown.space) {
            player.shoot();
        }

        if (keydown.left) {
            player.x -= 10;
        }

        if (keydown.right) {
            player.x += 10;
        }

        if (keydown.up) {
            player.y -= 10;
        }

        if (keydown.down) {
            player.y += 10;
        }

        player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
        player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height);

        playerBullets.forEach(function (bullet) {
            bullet.update();
        });

        playerBullets = playerBullets.filter(function (bullet) {
            return bullet.active;
        });

        enemies.forEach(function (enemy) {
            enemy.update();
        });

        enemies = enemies.filter(function (enemy) {
            return enemy.active;
        });

        handleCollisions();

        if (Math.random() < 0.1) {
            enemies.push(Enemy());
        }
        $('#kills').text('Kill Count: ' + killcount);
        $('#boss').text('boss hitpoints: ' + bossHP);

    }

    //shoot function
    player.shoot = function () {
        //  Sound.play("shoot");

        var bulletPosition = this.midpoint();

        playerBullets.push(Bullet({
            speed: 16,
            x: bulletPosition.x,
            y: bulletPosition.y
        }));
    };

    player.midpoint = function () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    };


    //draw everything on the canvas
    function draw() {
        canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        player.draw();
        cloud.draw();
        cloud2.draw();


        //if kill count is over 100 show boss, if boss not dead, put him in middle of screen
        if (killcount > 500) {
            boss.draw();
            if (bossHP > 0) {
                boss.x = 60;
                boss.y = 250;
            }
        }


        playerBullets.forEach(function (bullet) {
            bullet.draw();
        });
        enemies.forEach(function (enemy) {
            enemy.draw();
        });
    }


    //collide function
    function collides(a, b) {
        return a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
    }

    //kills enemies
    function handleCollisions() {
        playerBullets.forEach(function (bullet) {
            enemies.forEach(function (enemy) {
                if (collides(bullet, enemy)) {
                    enemy.explode();
                    bullet.active = false;
                    killcount++;
                }
            });

            //kill boss
            if (collides(bullet, boss)) {
                bullet.active = false;
                bossHP--;
                if (bossHP < 0) {
                    //get rid of boss
                    boss.x = 0;
                    boss.y = 900;
                    boss.active = false;
                    
                }

            }
        });

    

        //kills player
    //enemies.forEach(function (enemy) {
    //    if (collides(enemy, player)) {
    //        enemy.explode();
    //        player.explode();
    //    }
    //});

     }

    player.explode = function () {
        this.active = false;
       //  Add an explosion graphic and then end the game
    };

    //draw the player and grab the sprite
    player.sprite = Sprite("1plane");
    player.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };

    // draw the boss and grab the sprite
        boss.sprite = Sprite("boss");
        boss.draw = function () {
            this.sprite.draw(canvas, this.x, this.y);
        };
    

   

    //scenery
    cloud.sprite = Sprite("cloud");
    cloud2.sprite = Sprite("cloud");
    cloud.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };
    cloud2.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };


});

 

        




