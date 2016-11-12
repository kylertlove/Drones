

function gameStart(){
  $('#btnFullScreen').prop("disabled",true);

  //creates the game map
  var finalSec = $('#finalSection');
  var CANVAS_WIDTH = $('#finalSection').width();
  var CANVAS_HEIGHT = $('#finalSection').height();
  var FPS = 30;
  var killcount = 0;
  var killcountLabel = $('#lblKillcount');
  var bossHP = 500;
  //var to count when bad guys shoot
  var timeToShoot = 0;
  var PlayerHealth = 100;
  var bossKills = 0;
  var PLAYER_WIDTH = 1;
  var BOSS_WIDTH = 1;
  var DiffVal = $('#myRange').val();
  var GAME_DIFFICULTY = (DiffVal / 300);

  //health displays
  var canvasElement = $("<canvas id='maincanvas4' width='" + CANVAS_WIDTH +
  "' height='" + CANVAS_HEIGHT + "'></canvas>");
  var canvas = canvasElement.get(0).getContext("2d");
  canvasElement.appendTo(finalSec);

  //creates a player object------------------------------------------------------------Player
  var player = {};
  $.extend(player, user(500, 270, "#00A", 20, 30));

    player.draw = function(){
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
    };

  player.explode = function () {
    PlayerHealth -= 5;

    if (PlayerHealth <= 0) {
      gameOver();
    }
  };

  // boss object-------------------------------------------------------------------Boss
  var boss = {};
  $.extend(boss, user(0, 1500, "#00A", 380, 150));

    boss.draw = function () {
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
    };
  boss.active = false;

  //-----------------enimies
  enemies = [];
  //--------------creates enemy-----------------------------------------------------Drone Enemies
  function Enemy(I) {

    //stores ememies
    I = I || {};
  $.extend(I, projectile(2, 120, "#A2B", 32, 32));

    //activates it
    I.active = true;

    //sets a timer for life of enemy
    I.age = Math.floor(Math.random() * 128);


    //spacing of enemies on page
    I.y = CANVAS_WIDTH / 12 + Math.random() * CANVAS_WIDTH / 12;
    I.x = 0;

    I.inBounds = function () {
      return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.sprite = Sprite("alienship");

    I.draw = function () {
      this.sprite.draw(canvas, this.x, this.y);
    };

    I.update = function () {
      I.x += I.xVel;
      I.y += I.yVel;

      I.yVel = 3 * Math.sin(I.age * Math.PI / 64);

      I.age++;

      I.active = I.active && I.inBounds();
    };

    I.explode = function () {
      //    Sound.play("explosion");
      //change enemy to explosion
      I.sprite = Sprite("explode");
      //  setTimeout(function () { I.sprite = Sprite("explode1"); }, 3000);
        killcountLabel.html(killcount);
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

    I = I || {};

    //inherit entity and projectile
    $.extend(I, projectile(I.speed, 0, "#00FF00", 10, 6));
    I.active = true;


    //returns boolean true if in bounds
    I.inBounds = function () {
      return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    //display of bullets
    I.draw = function () {
      this.sprite.draw(canvas, this.x, this.y);
    };

  I.sprite = Sprite("bossBullet");

    //updates bullets location
    I.update = function () {
      I.x += I.xVel;
      I.y += I.yVel;

      //based off of how many bosses you kill <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<TO DO: fix boss difficulty
      //  I.yVelocity = 20 * Math.sin((I.x * int value of how many bosses killed) * Math.PI / 180);

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

    I = I || {};

    //inherit entity and projectile
    $.extend(I, projectile(-I.speed, 0, "#fff", 9, 3));

    I.active = true;
      var bulletCycle = Math.random() * 128;

    //returns boolean true if in bounds
    I.inBounds = function () {
      return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.sprite = Sprite("bullet");

    //display of bullets
    I.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };

    //updates bullets location
    I.update = function () {
      I.x += I.xVel;
      I.y += I.yVel;

      //cheat codes
        if($('#chkbxCheatCodes')[0].checked) {
          I.yVel = 3 * Math.sin(bulletCycle * Math.PI / 60);
          bulletCycle++;
        }

      I.active = I.active && I.inBounds();
    };


    I.explode = function () {
      this.active = false;
    };
    //returns bullet with updated information
    return I;
  }
  // game controller  ----------------------------------------------------------------SetInterval
   var timer = setInterval(function () {
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
        boss.x -= 4;
      }
    }

    if (keydown.right) {
      player.x += 10;
      if (boss.active === true) {
        boss.x += 1;
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
    if (timeToShoot % 11 === 0 && boss.active === true) {
      // Enemy.shoot();
      boss.shoot();
    //  console.log('enemy shooting');
    }

    player.x = player.x.clamp(0, CANVAS_WIDTH - 120);
    player.y = player.y.clamp(0, CANVAS_HEIGHT - (player.height * 2));

if(boss.active === true){
    boss.x = boss.x.clamp(0, CANVAS_WIDTH / 2);
    boss.y = boss.y.clamp(0, CANVAS_HEIGHT - boss.height);
  }

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
     DiffVal = document.getElementById('myRange').value;
     GAME_DIFFICULTY = (DiffVal / 300);

    if (Math.random() < GAME_DIFFICULTY) {
      enemies.push(Enemy());
    }
    timeToShoot++;
    $('#health').val(PlayerHealth);

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


    //calls the different bosses.  TODO:Make variables that control how hard the boss is

      if(boss.active === false && killcount > 100 && killcount < 105){
        boss.active = true;
        setBossLocation();
        bossHP = 500;
        boss.draw();
        //setTimeout(boss.draw(), 300);
      }
      else if(boss.active === false && killcount > 400 && killcount < 405){
        boss.active = true;
        setBossLocation();
        bossHP = 600;
        boss.draw();
        //setTimeout(boss.draw(), 300);

      }
      else if(boss.active === false && killcount > 700 && killcount < 705){
        boss.active = true;
        setBossLocation();
        bossHP = 700;
        boss.draw();
        //setTimeout(boss.draw(), 300);
      }else{
          boss.draw();
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

  //handles all functions with regard to collisions
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
        bossHP -= 10;
        console.log(bossHP);
        if (bossHP < 0) {
          //get rid of boss
          boss.y = 1500;
          boss.x = 0;
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
      }
    });

    //kills player
    enemies.forEach(function (enemy) {
      if (collides(enemy, player)) {
        enemy.explode();
        player.explode();
      }
    });
  }

  //draw the player and grab the sprite
  player.sprite = Sprite("playerShip");
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
      clearInterval(timer);
      alert("Game Over");
      if(localStorage.getItem('DronesHighScore') < killcount){
        alert("NEW HIGH SCORE");
        localStorage.setItem( 'DronesHighScore', killcount );
        $('#lblHighScore').html("Current High Score: " + localStorage.getItem('DronesHighScore'));
      }

    //  location.reload();
  }

}
