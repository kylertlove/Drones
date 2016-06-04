
$(document).ready(function () {

    //creates the game map
    var CANVAS_WIDTH = window.innerWidth;
    var CANVAS_HEIGHT = window.innerHeight;
    var FPS = 30;
    var killcount = 0;
    var bossHP = 250;
    //var to count when bad guys shoot
    var timeToShoot = 0;
    var PlayerHealth = 1000;
    var bossKills = 0;

    var canvasElement = $("<canvas width='" + CANVAS_WIDTH +
      "' height='" + CANVAS_HEIGHT + "'></canvas>");
    var canvas = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('section');

    //creates a player object------------------------------------------------------------Player
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
    player.explode = function () {
        player.active = false;
        if (PlayerHealth <= 0) {
            gameOver();
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


   // boss object-------------------------------------------------------------------Boss
    var boss = {
        color: "#00A",
        x: 0,
        y: 1500,
        width: 380,
        height: 150,
        draw: function () {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        }

    };
    boss.active = false;

    //-----------------enimies
    enemies = [];
    //--------------creates enemy-----------------------------------------------------Drone Enemies
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
        I.yVelocity = 0;
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
    }

    //stores bullets
    var playerBullets = [];

    //stores bullets for badguys
    var badguyBullets = [];

    //bad guy bullets ----------------------------------------------------------------Enemy Bullets
    function badguyBullet(I) {
        I.active = true;

        //direction of bullets
        I.xVelocity = I.speed;
        I.yVelocity = 0;
        I.width = 10;
        I.height = 6;
        I.color = "#000080";

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

    //function for bullet creation----------------------------------------------------Player Bullets
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
    // game controller  ----------------------------------------------------------------SetInterval
    setInterval(function () {
        update();
        draw();

    }, 1000 / FPS);


    //update the game--------------------------------------------------------------------Updates
    function update() {
        if (keydown.space) {
            player.shoot();

        }

        if (keydown.left) {
            player.x -= 10;
            if (boss.active === true) {
                boss.x -= 1;
            }
        }

        if (keydown.right) {
            player.x += 10;
            if (boss.active === true) {
                boss.x += 4;
            }
        }

        if (keydown.up) {
            player.y -= 10;
            if (boss.active === true) {
                boss.y -= 4;
            }
        }

        if (keydown.down) {
            player.y += 10;
            if (boss.active === true) {
                boss.y += 4;
            }
        }
        if (timeToShoot % 7 === 0) {
           // Enemy.shoot();
            boss.shoot();
            console.log('enemy shooting');
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

        //updates each bullet in array
        badguyBullets.forEach(function (badguybullet) {
            badguybullet.update();
        });

        //repopulates the array with active bullets
        badguyBullets = badguyBullets.filter(function (badguyBullet) {
            return badguyBullet.active;
        });

        handleCollisions();

        if (Math.random() < 0.1) {
            enemies.push(Enemy());
        }
        $('#kills').text('Kill Count: ' + killcount);
        $('#bosskills').text('Boss Kill Count: ' + bossKills);
        $('#boss').width(bossHP);
        $('#health').width(PlayerHealth);
        timeToShoot++;
    }

    //shoot function----------------------------------------------------------------------Shoot functions
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

    //badguy shoot function
    //Enemy.shoot = function () {
    //    //  Sound.play("shoot");
    //    console.log('enemy.shoot is called');
    //    var bgbulletPosition = this.midpoint();

    //    badguyBullets.push(badguyBullet({
    //        speed: 10,
    //        x: bgbulletPosition.x,
    //        y: bgbulletPosition.y

    //    }));
    //};
    //Enemy.midpoint = function () {
    //    return {
    //        x: this.x + this.width / 2,
    //        y: this.y + this.height / 2
    //    };
    //};

    boss.shoot = function () {
        //  Sound.play("shoot");
        var bgbulletPosition = this.midpoint();

        badguyBullets.push(badguyBullet({
            speed: 10,
            x: bgbulletPosition.x,
            y: bgbulletPosition.y

        }));
    };

    boss.midpoint = function () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    };

    function setBossLocation() {
        boss.x = 60;
        boss.y = 250;
    }
    //draw everything on the canvas---------------------------------------------------------Draw functions
    function draw() {
        canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        player.draw();
        cloud.draw();
        cloud2.draw();


        //if kill count is over 100 show boss, if boss not dead, put him in middle of screen
        if (killcount > 200) {
            boss.active = true;
            boss.draw();
            if (bossHP == 250) {

                setBossLocation();
            }
        }

        if (killcount > 700) {
            boss.active = true;
            boss.draw();
            if (bossHP == 350) {

                setBossLocation();
            }
        }


        playerBullets.forEach(function (bullet) {
            bullet.draw();
        });

        enemies.forEach(function (enemy) {
            enemy.draw();
        });
        badguyBullets.forEach(function (bullet) {
            bullet.draw();
        });

    }

    //collide function---------------------------------------------------------------------Collides
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
                    boss.y = 1500;
                    bossHP = 350;
                    boss.active = false;
                    bossKills++;
                }

            }
        });

        //bullets kill player
        badguyBullets.forEach(function (bullet) {
                if (collides(bullet, player)) {
                    player.explode();
                    bullet.active = false;
                    PlayerHealth -= 50;
                }
            });

        //kills player
    enemies.forEach(function (enemy) {
        if (collides(enemy, player)) {
            enemy.explode();
            player.explode();
            PlayerHealth -= 10;
        }
    });

     }

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

    //ends the game----------------------------------------------------------------ends game
        function gameOver() {

         //   alert("Game Over");
          //  location.reload();
        }

    //scenery
    cloud.sprite = Sprite("cloud");
    cloud2.sprite = Sprite("cloud");
    cloud.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };
    cloud2.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };

        //modal----------------------------------------------------------------modal

});
