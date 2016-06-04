

function gameStart(){

  //creates the game map
  var CANVAS_WIDTH = $('#gameBoard').width();
  var CANVAS_HEIGHT = $('#gameBoard').height();
  var FPS = 30;
  var killcount = 0;
  var bossHP = 350;
  //var to count when bad guys shoot
  var timeToShoot = 0;
  var PlayerHealth = 1000;
  var bossKills = 0;
  var PLAYER_WIDTH = 1;
  var BOSS_WIDTH = 1;
  //health displays
  var PBBossHP = $('#BossHP');
  PBBossHP.width(PBBossHP.offsetParent().width());
  var PBPlayerHP = $('#PlayerHP');
  PBPlayerHP.width(PBPlayerHP.offsetParent().width());
  var lblPlayerKillz = $('#lblKillCount');
  var lblBossKill = $('#lblBossKills');

  var canvasElement = $("<canvas id='maincanvas' width='" + CANVAS_WIDTH +
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
    if (PLAYER_WIDTH <= 0) {
      player.active = false;
      gameOver();
    }
  };

  //working on cloud objects
  var cloud = {
    x: 1600, y: 200, width: 20, height: 30,
    draw: function () { canvas.fillStyle = this.color; canvas.fillRect(this.x, this.y, this.width, this.height); }
  };
  var cloud2 = {
    x: 900, y: 100, width: 20, height: 30,
    draw: function () {
      canvas.fillStyle = this.color; canvas.fillRect(this.x, this.y, this.width, this.height);
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
    I.color = "	#00FF00";

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
    I.active = true;

    //direction of bullets
    I.xVelocity = -I.speed;
    I.yVelocity = 0;
    I.width = 9;
    I.height = 3;
    I.color = "#fff";

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
    if (timeToShoot % 7 === 0 && boss.active === true) {
      // Enemy.shoot();
      boss.shoot();
      console.log('enemy shooting');
    }

    player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
    player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height);

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

    if (Math.random() < 0.1) {
      enemies.push(Enemy());
    }
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


    //calls the different bosses.  TODO:Make variables that control how hard the boss is

      if(boss.active === false && killcount > 50 && killcount < 55){
        boss.active = true;
        setBossLocation();
        setTimeout(boss.draw(), 300);
      }
      else if(boss.active === false && killcount > 400 && killcount < 405){
        PBBossHP.css('width', 100 + '%');
        boss.active = true;
        setBossLocation();
        setTimeout(boss.draw(), 300);

      }
      else if(boss.active === false && killcount > 700 && killcount < 705){
        PBBossHP.css('width', 100 + '%');
        boss.active = true;
        setBossLocation();
        setTimeout(boss.draw(), 300);
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
        lblPlayerKillz.html(killcount);
      });

      //kill boss
      if (collides(bullet, boss)) {
        bullet.active = false;
        BOSS_WIDTH =  getHealthBar(PBBossHP, 20.25);
        PBBossHP.css('width', BOSS_WIDTH + '%');
        if (BOSS_WIDTH < 0) {
          //get rid of boss
          boss.y = 1500;
          boss.x = 0;
          boss.active = false;
          bossKills++;
          lblBossKill.html(bossKills);
        }
      }
    });

    //bullets kill player
    badguyBullets.forEach(function (bullet) {
      if (collides(bullet, player)) {
        player.explode();
        bullet.active = false;
      PLAYER_WIDTH =  getHealthBar(PBPlayerHP, 5.25);
        PBPlayerHP.css('width', PLAYER_WIDTH + '%');
      }
    });

    //kills player
    enemies.forEach(function (enemy) {
      if (collides(enemy, player)) {
        enemy.explode();
        player.explode();
      PLAYER_WIDTH =  getHealthBar(PBPlayerHP, 4.25);
        PBPlayerHP.css('width', PLAYER_WIDTH + '%');
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
      clearInterval(timer);
      $('#modalGameOver').modal();
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

  //gets the width of the parent so that I can accuratly calculate the
  //percentage for the width
  function getHealthBar(div1, x){
    var width = div1.width() - x;
    var parentWidth = div1.offsetParent().width();
    return (100*width/parentWidth);
  }
  function viewCode(){
    $('#modalCode').modal("toggle");
  }
}
