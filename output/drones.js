var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("services/key-status", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeyDown = /** @class */ (function () {
        function KeyDown() {
            this.keys = {
                17: false,
                65: false,
                87: false,
                68: false,
                83: false,
                13: false,
                69: false,
                32: false,
                37: false,
                38: false,
                39: false,
                40: false // down
            };
        }
        KeyDown.prototype.keyChange = function (code, UporDown) {
            this.keys[code] = UporDown;
        };
        KeyDown.prototype.isLeft = function () {
            return this.keys[37];
        };
        KeyDown.prototype.isRight = function () {
            return this.keys[39];
        };
        KeyDown.prototype.isUp = function () {
            return this.keys[38];
        };
        KeyDown.prototype.isDown = function () {
            return this.keys[40];
        };
        KeyDown.prototype.isShooting = function () {
            return this.keys[32];
        };
        KeyDown.prototype.isFireZeMissiles = function () {
            return this.keys[17];
        };
        return KeyDown;
    }());
    exports.KeyDown = KeyDown;
});
define("model/entity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("model/user", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = /** @class */ (function () {
        function User(color, width, height, x, y) {
            this.color = color;
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.Color = color;
            this.Width = width;
            this.Height = height;
            this.X = x;
            this.Y = y;
            this.sprite = new Image();
        }
        User.prototype.draw = function (canvas) {
            canvas.fillStyle = this.color;
            canvas.drawImage(this.sprite, this.X, this.Y, this.width, this.height);
            //canvas.fillRect(this.X, this.Y, this.width, this.height);
        };
        User.prototype.explode = function () {
            this.health--;
            if (this.health <= 0) {
                return true;
            }
            return false;
        };
        User.prototype.update = function (canvas, keyHandler, dT) {
            //console.log('updated from user')
        };
        return User;
    }());
    exports.User = User;
});
define("model/projectile", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Projectile = /** @class */ (function () {
        function Projectile() {
            this.Color = 'fff';
            this.Width = 30;
            this.Height = 15;
            this.active = true;
            this.powerup = false;
            this.sprite = new Image();
        }
        Projectile.prototype.draw = function (canvas) {
            canvas.fillStyle = this.Color;
            canvas.drawImage(this.sprite, this.X, this.Y, this.Width, this.Height);
        };
        Projectile.prototype.explode = function () {
            this.active = false;
        };
        Projectile.prototype.update = function (canvas, keyHandler, dT) {
            if (!this.inBounds(canvas)) {
                this.active = false;
            }
            else {
                this.X -= this.Speed * dT;
            }
        };
        Projectile.prototype.inBounds = function (canvas) {
            return this.X >= 0 && this.X <= canvas.canvas.width &&
                this.Y >= 0 && this.Y <= canvas.canvas.height;
        };
        return Projectile;
    }());
    exports.Projectile = Projectile;
});
define("services/asset-manager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ASSETS;
    (function (ASSETS) {
        ASSETS["PREPEND"] = "./assets/";
    })(ASSETS = exports.ASSETS || (exports.ASSETS = {}));
});
define("model/playerBullets", ["require", "exports", "model/projectile", "services/asset-manager"], function (require, exports, projectile_1, asset_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerBullets = /** @class */ (function (_super) {
        __extends(PlayerBullets, _super);
        function PlayerBullets(speed, x, y) {
            var _this = _super.call(this) || this;
            _this.bulletCycle = Math.random() * 128;
            _this.X = x;
            _this.Y = y;
            _this.Speed = speed;
            _this.sprite.src = asset_manager_1.ASSETS.PREPEND + "drone-images/player-bullet.png";
            return _this;
        }
        PlayerBullets.prototype.powerUpCycle = function () {
            this.Y += 3 * Math.sin(this.bulletCycle * Math.PI / 60);
            this.bulletCycle++;
        };
        return PlayerBullets;
    }(projectile_1.Projectile));
    exports.PlayerBullets = PlayerBullets;
});
define("model/player", ["require", "exports", "model/user", "model/playerBullets", "services/asset-manager"], function (require, exports, user_1, playerBullets_1, asset_manager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this, 'fff', 117, 53, 200, 200) || this;
            _this.shieldTick = 10;
            _this.playerVelocity = 250;
            _this.maxHealth = 60;
            _this.baseSprite = asset_manager_2.ASSETS.PREPEND + "drone-images/playerShip.png";
            _this.shieldSprite = asset_manager_2.ASSETS.PREPEND + "drone-images/playerShip-shield-loop.png";
            _this.shieldSpriteNum = 0;
            _this.shieldInstanceLocation = [0, 117, 234, 351, 468]; //starting X value location of each image to show
            _this.shieldPointer = 0;
            _this.health = 50;
            _this.hasSprayPowerUp = false;
            _this.hasShield = false;
            _this.hasExplosionVelocity = false;
            _this.hasRoFpowerUp = false;
            _this.sprite.src = _this.baseSprite;
            return _this;
        }
        Player.prototype.update = function (canvas, keyHandler, dT) {
            if (keyHandler.isDown()) {
                this.Y += this.Y > canvas.canvas.height - 20 ? 0 : this.playerVelocity * dT;
            }
            if (keyHandler.isUp()) {
                this.Y -= this.Y < 0 ? 0 : this.playerVelocity * dT;
            }
            if (keyHandler.isLeft()) {
                this.X -= this.X < 0 ? 0 : this.playerVelocity * dT;
            }
            if (keyHandler.isRight()) {
                this.X += this.X > canvas.canvas.width - 20 ? 0 : this.playerVelocity * dT;
            }
            //remove shields when tick is gone
            if (this.hasShield && this.shieldTick <= 0) {
                clearInterval(this.loopShieldSprites);
                this.hasShield = false;
                this.sprite.src = this.baseSprite;
            }
        };
        Player.prototype.midpoint = function () {
            return {
                x: this.X + this.Width / 2,
                y: this.Y + this.Height / 2
            };
        };
        Player.prototype.shoot = function (playerBullets) {
            var loc = this.midpoint();
            playerBullets.push(new playerBullets_1.PlayerBullets(-750, loc.x, loc.y));
            return playerBullets;
        };
        /** Override explosion function */
        Player.prototype.explode = function () {
            if (!this.hasShield) {
                this.hasSprayPowerUp = false;
                this.health--;
                if (this.health <= 0) {
                    return true;
                }
                return false;
            }
            else {
                this.shieldTick--;
            }
        };
        /** Call to add Health to the player */
        Player.prototype.addHealth = function (amount) {
            this.health += amount;
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
        };
        /** Activate Shield Boost */
        Player.prototype.activateShield = function () {
            var _this = this;
            clearInterval(this.loopShieldSprites);
            this.sprite.src = this.shieldSprite;
            this.shieldTick = 10;
            this.hasShield = true;
            this.loopShieldSprites = setInterval(function () {
                if (_this.shieldPointer === _this.shieldInstanceLocation.length - 1) {
                    _this.shieldPointer = 0;
                }
                _this.shieldSpriteNum = _this.shieldInstanceLocation[_this.shieldPointer];
                _this.shieldPointer++;
            }, 80);
        };
        /** Lose all powerups */
        Player.prototype.losePowerUps = function () {
            this.hasSprayPowerUp = false;
            this.hasExplosionVelocity = false;
            this.hasRoFpowerUp = false;
        };
        Player.prototype.draw = function (canvas) {
            if (!this.hasShield) {
                canvas.drawImage(this.sprite, this.X, this.Y, this.Width, this.Height);
            }
            else {
                canvas.drawImage(this.sprite, this.shieldSpriteNum, 0, this.Width, this.Height, this.X, this.Y, this.Width, this.Height);
            }
        };
        return Player;
    }(user_1.User));
    exports.Player = Player;
});
define("model/enemy-drones", ["require", "exports", "model/projectile", "services/asset-manager"], function (require, exports, projectile_2, asset_manager_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Enemy = /** @class */ (function (_super) {
        __extends(Enemy, _super);
        function Enemy(speed, x, y) {
            var _this = _super.call(this) || this;
            _this.X = x;
            _this.Y = y;
            _this.Speed = speed;
            _this.Width = 50;
            _this.Height = 30;
            _this.age = Math.floor(Math.random() * 128);
            _this.hasBeenShot = false;
            _this.sprite.src = asset_manager_3.ASSETS.PREPEND + "drone-images/alienship.png";
            return _this;
        }
        //override projectile
        Enemy.prototype.update = function (canvas, keyHandler, dT) {
            if (!this.inBounds(canvas)) {
                this.active = false;
            }
            else {
                this.X -= (this.Speed * dT);
                this.Y += 3 * Math.sin(this.age * Math.PI / 128);
                this.age++;
            }
        };
        Enemy.prototype.explode = function () {
            var _this = this;
            this.hasBeenShot = true;
            this.sprite.src = asset_manager_3.ASSETS.PREPEND + "drone-images/explode-red.png";
            setTimeout(function () {
                _this.active = false;
            }, 250);
        };
        ;
        return Enemy;
    }(projectile_2.Projectile));
    exports.Enemy = Enemy;
});
define("model/powerups", ["require", "exports", "model/user", "services/asset-manager"], function (require, exports, user_2, asset_manager_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Powerup = /** @class */ (function (_super) {
        __extends(Powerup, _super);
        function Powerup() {
            var _this = _super.call(this, 'aaa', 50, 41, 0, 200) || this;
            _this.showText = false;
            _this.active = false;
            _this.getNewType();
            return _this;
        }
        Powerup.prototype.update = function (canvas, keyHandler, dT) {
            if (this.inBounds(canvas)) {
                this.X -= 200 * dT;
            }
            else {
                this.active = false;
                this.X = canvas.canvas.width;
            }
        };
        Powerup.prototype.inBounds = function (canvas) {
            return this.X >= 0 && this.X <= canvas.canvas.width &&
                this.Y >= 0 && this.Y <= canvas.canvas.height;
        };
        Powerup.prototype.getNewType = function () {
            var rand = Math.random() * 100;
            if (rand >= 0 && rand < 20) {
                this.sprite.src = asset_manager_4.ASSETS.PREPEND + "drone-images/powerup-spray.png";
                this.type = PowerUpType.Spray;
            }
            else if (rand >= 20 && rand < 40) {
                this.sprite.src = asset_manager_4.ASSETS.PREPEND + "drone-images/powerup-health.png";
                this.type = PowerUpType.Health;
            }
            else if (rand >= 40 && rand < 60) {
                this.sprite.src = asset_manager_4.ASSETS.PREPEND + "drone-images/powerup-explosionVelocity.png";
                this.type = PowerUpType.explosionVelocity;
            }
            else if (rand >= 60 && rand < 80) {
                this.sprite.src = asset_manager_4.ASSETS.PREPEND + "drone-images/powerup-shield.png";
                this.type = PowerUpType.Shield;
            }
            else if (rand >= 80) {
                this.sprite.src = asset_manager_4.ASSETS.PREPEND + "drone-images/powerup-rOf.png";
                this.type = PowerUpType.RoF;
            }
            //testing shield
            // this.sprite.src = ASSETS.PREPEND + "drone-images/powerup-shield.png";
            // this.type = PowerUpType.Shield;
        };
        Powerup.prototype.getFlashText = function () {
            switch (this.showType) {
                case PowerUpType.Spray:
                    return "Main Weapon Upgrade!";
                case PowerUpType.Health:
                    return "+10 Health!";
                case PowerUpType.explosionVelocity:
                    return "Increase Missile Damage";
                case PowerUpType.RoF:
                    return "Rate of Fire Increase";
                case PowerUpType.Shield:
                    return "Shields!";
                default:
                    return "";
            }
        };
        Powerup.prototype.flashInfo = function (type) {
            var _this = this;
            this.showType = type;
            this.showText = true;
            setTimeout(function () {
                _this.showText = false;
            }, 2000);
        };
        return Powerup;
    }(user_2.User));
    exports.Powerup = Powerup;
    var PowerUpType;
    (function (PowerUpType) {
        PowerUpType[PowerUpType["Spray"] = 0] = "Spray";
        PowerUpType[PowerUpType["Health"] = 1] = "Health";
        PowerUpType[PowerUpType["explosionVelocity"] = 2] = "explosionVelocity";
        PowerUpType[PowerUpType["RoF"] = 3] = "RoF";
        PowerUpType[PowerUpType["Shield"] = 4] = "Shield";
    })(PowerUpType = exports.PowerUpType || (exports.PowerUpType = {}));
});
define("model/missile", ["require", "exports", "model/user", "services/asset-manager"], function (require, exports, user_3, asset_manager_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Missile = /** @class */ (function (_super) {
        __extends(Missile, _super);
        function Missile(hasExplosionVelocity) {
            var _this = _super.call(this, 'fff', 60, 30, 0, 0) || this;
            _this.activeMissile = false;
            _this.missileVelocity = 450;
            _this.defaultExplosionVelocity = 100;
            _this.explodingMissile = false;
            _this.defaultSprite = asset_manager_5.ASSETS.PREPEND + "drone-images/missile-weak.png";
            _this.powerupSprite = asset_manager_5.ASSETS.PREPEND + "drone-images/missile-powerup.png";
            _this.explodingSprite = asset_manager_5.ASSETS.PREPEND + "drone-images/explode-red.png";
            _this.needMissile = false;
            _this.sprite.src = hasExplosionVelocity ? _this.powerupSprite : _this.defaultSprite;
            _this.explosionVelocity = hasExplosionVelocity ? 400 : _this.defaultExplosionVelocity;
            return _this;
        }
        Missile.prototype.update = function (canvas, keyHandler, dT) {
            if (this.inBounds(canvas)) {
                this.X += this.missileVelocity * dT;
            }
            else {
                this.activeMissile = false;
            }
        };
        Missile.prototype.inBounds = function (canvas) {
            return this.X >= 0 && this.X <= canvas.canvas.width &&
                this.Y >= 0 && this.Y <= canvas.canvas.height;
        };
        Missile.prototype.destroy = function (canvas) {
            var _this = this;
            this.activeMissile = false;
            this.explodingMissile = true;
            this.Width = 200;
            this.Height = 200;
            this.sprite.src = this.explodingSprite;
            setTimeout(function () {
                _this.explodingMissile = false;
                _this.needMissile = true;
                _this.sprite.src = _this.defaultSprite;
            }, 200);
        };
        return Missile;
    }(user_3.User));
    exports.Missile = Missile;
});
define("model/enemyBullets", ["require", "exports", "model/projectile", "services/asset-manager"], function (require, exports, projectile_3, asset_manager_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EnemyBullet = /** @class */ (function (_super) {
        __extends(EnemyBullet, _super);
        function EnemyBullet(speed, x, y) {
            var _this = _super.call(this) || this;
            _this.bulletCycle = Math.random() * 128;
            _this.X = x;
            _this.Y = y;
            _this.Speed = speed;
            _this.sprite.src = asset_manager_6.ASSETS.PREPEND + "drone-images/bossBullet.png";
            return _this;
        }
        EnemyBullet.prototype.powerUpCycle = function () {
            this.Y += 3 * Math.sin(this.bulletCycle * Math.PI / 128);
            this.bulletCycle++;
        };
        return EnemyBullet;
    }(projectile_3.Projectile));
    exports.EnemyBullet = EnemyBullet;
});
define("model/boss.drones", ["require", "exports", "model/user", "model/enemyBullets", "services/asset-manager"], function (require, exports, user_4, enemyBullets_1, asset_manager_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Boss = /** @class */ (function (_super) {
        __extends(Boss, _super);
        function Boss() {
            var _this = _super.call(this, 'fff', 200, 100, 0, 300) || this;
            _this.active = false;
            _this.bossVelocity = 80;
            _this.defaultSprite = asset_manager_7.ASSETS.PREPEND + "drone-images/boss.png";
            _this.health = 100;
            _this.sprite.src = _this.defaultSprite;
            return _this;
        }
        Boss.prototype.update = function (canvas, keyHandler, dT) {
            if (keyHandler.isDown()) {
                this.Y += this.Y > canvas.canvas.height - (canvas.canvas.height / 4) ?
                    0 : this.bossVelocity * dT;
            }
            if (keyHandler.isUp()) {
                this.Y -= this.Y < 0 ? 0 : this.bossVelocity * dT;
            }
            if (keyHandler.isLeft()) {
                this.X -= this.X < 0 ? 0 : this.bossVelocity * dT;
            }
            if (keyHandler.isRight()) {
                this.X += this.X > canvas.canvas.width - (canvas.canvas.width / 4) ?
                    0 : this.bossVelocity * dT;
            }
        };
        Boss.prototype.midpoint = function () {
            return {
                x: this.X + this.Width / 2,
                y: this.Y + this.Height / 2
            };
        };
        Boss.prototype.shoot = function (enemyBullets) {
            var loc = this.midpoint();
            enemyBullets.push(new enemyBullets_1.EnemyBullet(550, loc.x, loc.y));
            return enemyBullets;
        };
        Boss.prototype.destroy = function (canvas) {
            var _this = this;
            this.active = false;
            this.explodingBoss = true;
            this.sprite.src = asset_manager_7.ASSETS.PREPEND + "drone-images/explode-yellow.png";
            setTimeout(function () {
                _this.explodingBoss = false;
                _this.sprite.src = _this.defaultSprite;
            }, 300);
        };
        return Boss;
    }(user_4.User));
    exports.Boss = Boss;
});
define("model/CanvasMenuObjects", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Object for clickable elements on the canvas
     */
    var CanvasShape = /** @class */ (function () {
        /**
         *
         * @param name
         * @param x X Position
         * @param y Y Position
         * @param w Width
         * @param h Height
         */
        function CanvasShape(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        return CanvasShape;
    }());
    exports.CanvasShape = CanvasShape;
    /**
     * Object for Text elements on the canvas
     */
    var CanvasText = /** @class */ (function () {
        /**
         *
         * @param word String to show
         * @param x X Position
         * @param y Y Position
         * @param color color of Text
         * @param font Size and Font of text
         */
        function CanvasText(word, x, y, color, font) {
            this.word = word;
            this.x = x;
            this.y = y;
            this.color = color;
            this.font = font;
        }
        return CanvasText;
    }());
    exports.CanvasText = CanvasText;
});
define("model/hud", ["require", "exports", "services/asset-manager", "model/CanvasMenuObjects"], function (require, exports, asset_manager_8, CanvasMenuObjects_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Hud = /** @class */ (function () {
        function Hud() {
            this.showLevelText = "Level 1";
            this.volOn = asset_manager_8.ASSETS.PREPEND + "drone-images/volume.png";
            this.volPaused = asset_manager_8.ASSETS.PREPEND + "drone-images/volume-pause.png";
            this.textColor = "lime";
            this.volumeImageObj = new Image(25, 25);
            this.volumeImageObj.src = this.volOn;
            this.nextImageObj = new Image(25, 25);
            this.nextImageObj.src = asset_manager_8.ASSETS.PREPEND + "drone-images/volumeNext.jpg";
            this.createGUI();
        }
        Hud.prototype.displayText = function (canvas, text) {
            var displayText = new CanvasMenuObjects_1.CanvasText(text, (canvas.canvas.width / 2), (canvas.canvas.height / 6), this.textColor, "25px Jazz LET, fantasy");
            canvas.font = displayText.font;
            canvas.fillStyle = displayText.color;
            canvas.textAlign = "center";
            canvas.fillText(text, displayText.x, displayText.y);
        };
        /**
         * Bottom left corner stats
         * @param canvas
         * @param player
         * @param kills
         */
        Hud.prototype.playerStats = function (canvas, player, kills) {
            var health = new CanvasMenuObjects_1.CanvasText("Health: " + player.health.toString(), (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 14)), this.textColor, "17px Jazz LET, fantasy");
            var KillsText = new CanvasMenuObjects_1.CanvasText("Kills: " + kills.toString(), (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 10)), this.textColor, "17px Jazz LET, fantasy");
            var level = new CanvasMenuObjects_1.CanvasText(this.showLevelText, (canvas.canvas.width / 40), (canvas.canvas.height - (canvas.canvas.height / 7)), this.textColor, "17px Jazz LET, fantasy");
            canvas.font = health.font;
            canvas.fillStyle = this.textColor;
            canvas.strokeStyle = this.textColor;
            canvas.textAlign = "left";
            canvas.fillText(health.word, health.x, health.y);
            canvas.fillText(KillsText.word, KillsText.x, KillsText.y);
            canvas.fillText(level.word, level.x, level.y);
        };
        /**
         * Draw Shield
         */
        Hud.prototype.drawShieldTick = function (canvas, shieldTick) {
            var displayWidth = 250;
            var shieldBox = new CanvasMenuObjects_1.CanvasShape((canvas.canvas.width / 2) - 125, (canvas.canvas.height - 50), displayWidth, 16);
            canvas.fillStyle = this.textColor;
            canvas.lineWidth = 2;
            canvas.strokeRect(shieldBox.x, shieldBox.y, shieldBox.w, shieldBox.h);
            var fillAmount = shieldTick / 10;
            fillAmount = fillAmount * displayWidth;
            //fillAmount = displayWidth - fillAmount;
            var shieldFill = new CanvasMenuObjects_1.CanvasShape((canvas.canvas.width / 2) - 125, (canvas.canvas.height - 50), fillAmount, 16);
            canvas.fillStyle = 'rgba(0,225,0,0.5)';
            canvas.fillRect(shieldFill.x, shieldFill.y, shieldFill.w, shieldFill.h);
        };
        Hud.prototype.volumeHud = function (canvas) {
            canvas.drawImage(this.volumeImageObj, 0, 0);
            canvas.drawImage(this.nextImageObj, 20, 0);
        };
        Hud.prototype.pauseVolume = function (paused) {
            if (paused) {
                this.volumeImageObj.src = this.volPaused;
            }
            else {
                this.volumeImageObj.src = this.volOn;
            }
        };
        Hud.prototype.addCount = function (canvas, enemy) {
            var hitCount = new CanvasMenuObjects_1.CanvasText("+1", enemy.X, enemy.Y, this.textColor, "15px Arial");
            canvas.font = hitCount.font;
            canvas.fillStyle = hitCount.color;
            canvas.strokeStyle = hitCount.color;
            canvas.fillText(hitCount.word, hitCount.x, hitCount.y);
        };
        /**
         * Initial Screen
         * @param DronesCanvas
         */
        Hud.prototype.splashScreen = function (Controller) {
            var _this = this;
            this.clearGUI();
            var title = document.createElement('LABEL');
            title.innerText = "DRONES";
            title.setAttribute('style', 'color:lime;font:40px Verdana;font-weight: 700;');
            var startBtn = document.createElement('BUTTON');
            startBtn.innerText = "START";
            startBtn.id = "startBtn";
            startBtn.setAttribute('style', this.getButtonStyle(false));
            startBtn.onclick = function () {
                Controller.start();
                _this.clearGUI();
            };
            startBtn.onmouseover = function () {
                startBtn.setAttribute('style', _this.getButtonStyle(true));
            };
            startBtn.onmouseleave = function () {
                startBtn.setAttribute('style', _this.getButtonStyle(false));
            };
            var howToPlay = document.createElement('LABEL');
            howToPlay.setAttribute('style', 'color:lime;font:16px Verdana;bottom: 0;');
            howToPlay.innerText = "Arrows to move; Spacebar to shoot; left ctrl for missiles";
            var initLine = this.getNewLineElem(5);
            this.guiBox.insertAdjacentElement("afterbegin", initLine);
            initLine.insertAdjacentElement("afterend", title);
            var newLine = this.getNewLineElem(25);
            title.insertAdjacentElement("afterend", newLine);
            newLine.insertAdjacentElement("afterend", startBtn);
            var thirdLine = this.getNewLineElem(150);
            startBtn.insertAdjacentElement("afterend", thirdLine);
            thirdLine.insertAdjacentElement("afterend", howToPlay);
        };
        /**
         * Pause/settings Screen
         */
        Hud.prototype.pauseScreen = function (Controller) {
            this.clearGUI();
            var pauseText = document.createElement('LABEL');
            pauseText.innerText = "PAUSED";
            pauseText.setAttribute('style', 'color:lime;font:40px Verdana;');
            this.guiBox.insertAdjacentElement("afterbegin", pauseText);
        };
        /**
         * Game Over Screen
         */
        Hud.prototype.gameOverScreen = function (Controller) {
            var _this = this;
            this.clearGUI();
            var gameOverText = document.createElement('LABEL');
            gameOverText.innerText = "GAME OVER";
            gameOverText.setAttribute('style', 'color:lime;font:40px Verdana;');
            var resetBtn = document.createElement('BUTTON');
            resetBtn.innerText = "RESET";
            resetBtn.id = "resetBtn";
            resetBtn.setAttribute('style', this.getButtonStyle(false));
            resetBtn.onclick = function () {
                _this.clearGUI();
                Controller.reset();
            };
            resetBtn.onmouseover = function () {
                resetBtn.setAttribute('style', _this.getButtonStyle(true));
            };
            resetBtn.onmouseleave = function () {
                resetBtn.setAttribute('style', _this.getButtonStyle(false));
            };
            this.guiBox.insertAdjacentElement("afterbegin", gameOverText);
            var thirdLine = this.getNewLineElem(25);
            gameOverText.insertAdjacentElement("afterend", thirdLine);
            thirdLine.insertAdjacentElement("afterend", resetBtn);
        };
        /**
         * Build GUI Box so I can use HTML for buttons, not canvas... canvas dom sucks
         */
        Hud.prototype.createGUI = function () {
            var canvasElem = window.document.getElementById('canvasElem');
            var guiOverlay = window.document.createElement("DIV");
            guiOverlay.id = "gui";
            guiOverlay.setAttribute('style', 'position:absolute;top:0;float:left; width:99%;height:99vh;text-align:center;z-index:5;');
            canvasElem.insertAdjacentElement("afterend", guiOverlay);
            this.guiBox = window.document.createElement('DIV');
            this.guiBox.id = "guiBox";
            this.guiBox.setAttribute('style', 'float:left;color:lime;margin-top:15%;height:50%;width:100%;text-align:center;');
            guiOverlay.insertAdjacentElement("afterbegin", this.guiBox);
        };
        Hud.prototype.clearGUI = function () {
            while (this.guiBox.firstChild) {
                this.guiBox.removeChild(this.guiBox.firstChild);
            }
        };
        Hud.prototype.getNewLineElem = function (height) {
            var newDiv = document.createElement('DIV');
            newDiv.setAttribute('style', 'height:' + height + 'px;');
            return newDiv;
        };
        Hud.prototype.getButtonStyle = function (isHovering) {
            if (isHovering) {
                return 'color:black;font:20px Verdana;font-weight: 700;background-color:lime;border:2px solid lime;width:15%;height:50px;transition:.6s;cursor:pointer;box-shadow:0 0 25px lime;border-radius: 12px;';
            }
            return 'color:lime;font:20px Verdana;font-weight: 700;background-color:black;border:2px solid lime;width:15%;height:50px;transition:.3s;cursor:pointer;box-shadow:0 0 15px lime;border-radius: 12px;';
        };
        return Hud;
    }());
    exports.Hud = Hud;
    var SCREEN_ACTIONS;
    (function (SCREEN_ACTIONS) {
        SCREEN_ACTIONS[SCREEN_ACTIONS["SPLASH"] = 0] = "SPLASH";
        SCREEN_ACTIONS[SCREEN_ACTIONS["PAUSE"] = 1] = "PAUSE";
        SCREEN_ACTIONS[SCREEN_ACTIONS["GAME_OVER"] = 2] = "GAME_OVER";
    })(SCREEN_ACTIONS = exports.SCREEN_ACTIONS || (exports.SCREEN_ACTIONS = {}));
});
define("services/audio.service", ["require", "exports", "services/asset-manager"], function (require, exports, asset_manager_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //import {BehaviorSubject} from "../../node_modules/rxjs/BehaviorSubject";
    var AudioService = /** @class */ (function () {
        function AudioService() {
            var _this = this;
            this.song = 0;
            this.musicVolume = .3;
            this.playlist = [
                asset_manager_9.ASSETS.PREPEND + "sounds/PatrickLieberkind-1.wav",
                asset_manager_9.ASSETS.PREPEND + "sounds/PatrickLieberkind-2.wav",
                asset_manager_9.ASSETS.PREPEND + "sounds/PatrickLieberkind-3.wav"
            ];
            this.audioElem = new Audio();
            this.missleElem = new Audio();
            this.lazorElem = new Audio();
            this.audioElem.onended = function () {
                setTimeout(function () {
                    _this.next();
                }, 10000);
            };
        }
        /** Toggle Audio Pause/play */
        AudioService.prototype.toggle = function (isPaused) {
            if (isPaused) {
                this.audioElem.pause();
            }
            else {
                this.audioElem.volume = this.musicVolume;
                this.audioElem.play();
            }
        };
        AudioService.prototype.next = function () {
            this.song++;
            if (this.song >= this.playlist.length) {
                this.song = 0;
            }
            this.audioElem.pause();
            this.audioElem.src = this.playlist[this.song];
            this.audioElem.volume = this.musicVolume;
            this.audioElem.play();
        };
        AudioService.prototype._noiseFireMissile = function () {
            this.missleElem.pause();
            this.missleElem.src = asset_manager_9.ASSETS.PREPEND + "sounds/fireMissle.wav";
            this.missleElem.volume = .3;
            this.missleElem.play();
        };
        AudioService.prototype._noiseFireZeLazor = function () {
            this.lazorElem.pause();
            this.lazorElem.src = asset_manager_9.ASSETS.PREPEND + "sounds/laser.wav";
            this.lazorElem.volume = .02;
            this.lazorElem.play();
        };
        return AudioService;
    }());
    exports.AudioService = AudioService;
});
define("services/drones-manager.service", ["require", "exports", "model/player", "services/key-status", "model/enemy-drones", "model/powerups", "model/missile", "model/boss.drones", "model/hud", "services/audio.service"], function (require, exports, player_1, key_status_1, enemy_drones_1, powerups_1, missile_1, boss_drones_1, hud_1, audio_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DronesManagerService = /** @class */ (function () {
        function DronesManagerService() {
            this.hud = new hud_1.Hud();
            this.player = new player_1.Player();
            this.keyHandler = new key_status_1.KeyDown();
            this.powerUp = new powerups_1.Powerup();
            this.playerMissile = new missile_1.Missile(false);
            this.boss = new boss_drones_1.Boss();
            this.soundService = new audio_service_1.AudioService();
            this.dT = 0;
            this.pauseGame = false;
            this.playerRoF = 0;
            this.playerBullets = [];
            this.enemyFleet = [];
            this.enemyBullets = [];
            this.GAME_DIFFICULTY = .04; //TODO: make enum
            this.GameOver = false;
            this.KILLS = 0;
        }
        /** Key change resolver */
        DronesManagerService.prototype.keyChange = function (keyCode, UporDown) {
            if (keyCode === 13 && !UporDown) {
                this.pauseGame = !this.pauseGame;
            }
            this.keyHandler.keyChange(keyCode, UporDown);
        };
        /**
         * Update Funtion for Events. Called in Main Gameloop
         * @param canvas
         */
        DronesManagerService.prototype.update = function (canvas, deltaTime) {
            this.dT = deltaTime;
            this.updateUserLocations(canvas);
            this.updateProjectileLocations(canvas);
            this.updateEnemiesLocation(canvas);
            this.randomizedGameElements(canvas);
            this.checkCollitions(canvas);
        };
        /**
         * Draw Function for elements.  Called in Main Gameloop
         * @param canvas
         */
        DronesManagerService.prototype.draw = function (canvas) {
            var _this = this;
            //draw the player
            this.player.draw(canvas);
            //draw powerup
            if (this.powerUp.active) {
                this.powerUp.draw(canvas);
            }
            if (this.powerUp.showText) {
                this.hud.displayText(canvas, this.powerUp.getFlashText());
            }
            //draw missile
            if (this.playerMissile.activeMissile || this.playerMissile.explodingMissile) {
                this.playerMissile.draw(canvas);
            }
            //draw the bullets
            this.playerBullets.forEach(function (bullet) {
                bullet.draw(canvas);
            });
            //draw the enemy drones
            this.enemyFleet.forEach(function (enemy) {
                enemy.draw(canvas);
                if (enemy.hasBeenShot && enemy.active) {
                    _this.hud.addCount(canvas, enemy);
                }
            });
            //draw boss
            if (this.boss.active || this.boss.explodingBoss) {
                this.boss.draw(canvas);
            }
            ;
            //enemy bullets
            this.enemyBullets.forEach(function (bullet) {
                bullet.draw(canvas);
            });
            //draw HUD
            this.hud.playerStats(canvas, this.player, this.KILLS);
            this.hud.volumeHud(canvas);
            if (this.player.hasShield) {
                this.hud.drawShieldTick(canvas, this.player.shieldTick);
            }
        };
        /**
         * Update the Location of the player
         * @param canvas
         */
        DronesManagerService.prototype.updateUserLocations = function (canvas) {
            //player
            this.player.update(canvas, this.keyHandler, this.dT);
        };
        /**
         * Updates all player and Boss bullets
         * @param canvas
         */
        DronesManagerService.prototype.updateProjectileLocations = function (canvas) {
            var _this = this;
            //add bullets to game board
            if (this.keyHandler.isShooting()) {
                if (this.playerRoF === 0) {
                    this.playerBullets = this.player.shoot(this.playerBullets);
                    this.soundService._noiseFireZeLazor();
                }
                if (!this.player.hasRoFpowerUp) {
                    this.playerRoF++;
                    if (this.playerRoF === 5) {
                        this.playerRoF = 0;
                    }
                }
                else {
                    this.playerRoF = 0;
                }
            }
            //update bullet positions
            this.playerBullets.forEach(function (bullet) {
                bullet.update(canvas, null, _this.dT);
                if (_this.player.hasSprayPowerUp) {
                    bullet.powerUpCycle();
                }
            });
            //remove inactive bullets
            this.playerBullets = this.playerBullets.filter(function (bullet) { return bullet.active; });
            this.enemyBullets = this.enemyBullets.filter(function (eBullet) { return eBullet.active; });
            if (!this.playerMissile.activeMissile && this.keyHandler.isFireZeMissiles() && !this.playerMissile.explodingMissile) {
                this.playerMissile.activeMissile = true;
                this.playerMissile.X = this.player.X;
                this.playerMissile.Y = this.player.Y;
                this.soundService._noiseFireMissile();
            }
            if (this.playerMissile.activeMissile) {
                this.playerMissile.update(canvas, null, this.dT);
            }
            if (this.powerUp.active) {
                this.powerUp.update(canvas, null, this.dT);
            }
        };
        /**
         * Update all drones and Boss if active.
         * @param canvas
         */
        DronesManagerService.prototype.updateEnemiesLocation = function (canvas) {
            var _this = this;
            //add enemies
            if (Math.random() < this.GAME_DIFFICULTY + .02) {
                this.enemyFleet.push(new enemy_drones_1.Enemy(200, canvas.canvas.width - 30, (canvas.canvas.width / 12 + Math.random() * canvas.canvas.width / 3)));
            }
            //update enemy position
            this.enemyFleet.forEach(function (enemy) {
                enemy.update(canvas, null, _this.dT);
            });
            //remove inactive enemies
            this.enemyFleet = this.enemyFleet.filter(function (enemy) { return enemy.active; });
            //update boss
            if (this.boss.active) {
                this.boss.update(canvas, this.keyHandler, this.dT);
                if (Math.random() < this.GAME_DIFFICULTY) {
                    this.enemyBullets = this.boss.shoot(this.enemyBullets);
                }
            }
            //update bullet positions
            this.enemyBullets.forEach(function (bullet) {
                bullet.update(canvas, null, _this.dT);
                bullet.powerUpCycle();
            });
        };
        /**
         * Function that will create and update all Random game elements
         * @param canvas
         */
        DronesManagerService.prototype.randomizedGameElements = function (canvas) {
            //generate powerups
            if (!this.powerUp.active) {
                if (Math.random() * 10000 < 40) {
                    this.powerUp.active = true;
                    this.powerUp.X = canvas.canvas.width;
                    this.powerUp.Y = this.getRandomHeight(canvas);
                }
            }
            //generate boss 
            if (!this.boss.active) {
                if (this.KILLS % 273 === 0 && this.KILLS !== 0) {
                    this.boss.active = true;
                    this.boss.health = 500;
                    this.boss.X = canvas.canvas.width - 300;
                    this.boss.Y = canvas.canvas.height / 2;
                }
            }
        };
        /**
         * Main Loop function to check for all collisions and handle event
         */
        DronesManagerService.prototype.checkCollitions = function (canvas) {
            var _this = this;
            //enemies - player bullets
            this.enemyFleet.forEach(function (enemy) {
                if (!enemy.hasBeenShot) {
                    _this.playerBullets.forEach(function (bullet) {
                        if (_this.collides(enemy, bullet)) {
                            _this.KILLS++;
                            enemy.explode();
                            bullet.active = false;
                        }
                    });
                }
            });
            //enemies - player && enemies - missiles
            this.enemyFleet.forEach(function (enemy) {
                if (!enemy.hasBeenShot) {
                    if (_this.collides(enemy, _this.player)) {
                        enemy.explode();
                        if (!_this.player.hasShield) {
                            _this.removePowerups();
                        }
                        _this.GameOver = _this.player.explode();
                    }
                    if (_this.playerMissile.activeMissile && _this.collides(_this.playerMissile, enemy)) {
                        _this.KILLS++;
                        enemy.explode();
                        _this.playerMissile.destroy(canvas);
                        _this.enemyFleet.forEach(function (nestEnemy) {
                            if (_this.bombCollides(_this.playerMissile, nestEnemy, _this.playerMissile.explosionVelocity)) {
                                _this.KILLS++;
                                nestEnemy.explode();
                            }
                        });
                    }
                }
            });
            //player - powerups
            if (this.powerUp.active && this.collides(this.player, this.powerUp)) {
                switch (this.powerUp.type) {
                    case powerups_1.PowerUpType.Spray:
                        this.player.hasSprayPowerUp = true;
                        break;
                    case powerups_1.PowerUpType.Health:
                        this.player.addHealth(10);
                        break;
                    case powerups_1.PowerUpType.explosionVelocity:
                        this.player.hasExplosionVelocity = true;
                        this.playerMissile.explosionVelocity = 400;
                        break;
                    case powerups_1.PowerUpType.RoF:
                        this.player.hasRoFpowerUp = true;
                        break;
                    case powerups_1.PowerUpType.Shield:
                        this.player.activateShield();
                        break;
                }
                this.powerUp.flashInfo(this.powerUp.type);
                //reset powerup
                this.powerUp.active = false;
                this.powerUp.X = canvas.canvas.width;
                //change the type of the powerup
                this.powerUp.getNewType();
            }
            //boss - playerbullets
            if (this.boss.active) {
                this.playerBullets.forEach(function (bullet) {
                    if (_this.collides(_this.boss, bullet)) {
                        _this.boss.health--;
                        if (_this.boss.health <= 0) {
                            _this.boss.active = false;
                        }
                        bullet.active = false;
                    }
                });
                //boss - missile
                if (this.playerMissile.activeMissile && this.collides(this.playerMissile, this.boss)) {
                    this.boss.health -= this.player.hasExplosionVelocity ? 100 : 50;
                    this.playerMissile.destroy(canvas);
                    if (this.boss.health <= 0) {
                        this.boss.destroy(canvas);
                    }
                    this.enemyFleet.forEach(function (nestEnemy) {
                        if (_this.bombCollides(_this.playerMissile, nestEnemy, _this.playerMissile.explosionVelocity)) {
                            _this.KILLS++;
                            nestEnemy.explode();
                        }
                    });
                }
            }
            //enemy bullets - player
            this.enemyBullets.forEach(function (bullet) {
                if (_this.collides(bullet, _this.player)) {
                    bullet.active = false;
                    if (!_this.player.hasShield) {
                        _this.removePowerups();
                    }
                    _this.GameOver = _this.player.explode();
                }
            });
            if (this.playerMissile.needMissile) {
                this.playerMissile = new missile_1.Missile(this.player.hasExplosionVelocity);
            }
            if (this.KILLS > 100 && this.GAME_DIFFICULTY !== .07) {
                this.GAME_DIFFICULTY = .07;
                this.hud.showLevelText = "Level 2";
            }
            if (this.KILLS > 500 && this.GAME_DIFFICULTY !== .13) {
                this.GAME_DIFFICULTY = .13;
                this.hud.showLevelText = "Level 3";
            }
        };
        /** Collision Detection Handler */
        DronesManagerService.prototype.collides = function (a, b) {
            return a.X < b.X + b.Width &&
                a.X + a.Width > b.X &&
                a.Y < b.Y + b.Height &&
                a.Y + a.Height > b.Y;
        };
        /**
         * Radius defined bomb explosion
         * @param a
         * @param b
         * @param rad
         */
        DronesManagerService.prototype.bombCollides = function (a, b, rad) {
            return a.X < (b.X + rad) + b.Width &&
                a.X + a.Width > (b.X - rad) &&
                a.Y < (b.Y + rad) + b.Width &&
                a.Y + a.Height > (b.Y - rad);
        };
        DronesManagerService.prototype.getRandomHeight = function (canvas) {
            var rand = Math.floor(Math.random() * 1000) + 1;
            if (rand < 10) {
                rand = 10;
            }
            if (rand % 2 === 0) {
                rand += 100;
            }
            if (rand > canvas.canvas.height) {
                rand -= (rand - canvas.canvas.height);
            }
            if (rand > canvas.canvas.height - 50) {
                rand = canvas.canvas.height - 100;
            }
            return rand;
        };
        /** When Player Collision happens remove all powerups */
        DronesManagerService.prototype.removePowerups = function () {
            this.player.losePowerUps();
            this.playerMissile.explosionVelocity = this.playerMissile.defaultExplosionVelocity;
        };
        return DronesManagerService;
    }());
    exports.DronesManagerService = DronesManagerService;
});
define("DronesCanvas", ["require", "exports", "services/drones-manager.service", "model/hud"], function (require, exports, drones_manager_service_1, hud_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DronesCanvas = /** @class */ (function () {
        function DronesCanvas(canvasElementName) {
            var _this = this;
            this.canvasElementName = canvasElementName;
            this.currentTime = (new Date()).getTime();
            this.lastTime = (new Date()).getTime();
            this.interval = 1000 / 30;
            this.audioPause = false;
            this.canvasButtonList = [];
            /**
             * The Game Loop.
             * requestAnimationFrame passing the callback as the function.
             * current time is now, delta time is the difference between now and the last current time
             * (How long does the loop take)
             */
            this.loop = function () {
                if (!_this.gameManager.GameOver && !_this.gameManager.pauseGame) {
                    _this.gameLoop = window.requestAnimationFrame(_this.loop);
                    var currentTime = (new Date()).getTime();
                    _this.deltaTime = (currentTime - _this.lastTime) / 1000;
                    if (_this.deltaTime > .2) {
                        _this.deltaTime = .018;
                    }
                    //normal game loop, Clear -> update -> draw -> repeat
                    _this.CanvasObject.clearRect(0, 0, _this.CanvasObject.canvas.width, _this.CanvasObject.canvas.height);
                    _this.gameManager.update(_this.CanvasObject, _this.deltaTime);
                    _this.gameManager.draw(_this.CanvasObject);
                    _this.lastTime = currentTime - (_this.deltaTime % _this.interval);
                }
                else if (_this.gameManager.GameOver) {
                    //game over. Draw menu box
                    _this.buildCanvasGUI(hud_2.SCREEN_ACTIONS.GAME_OVER);
                }
            };
            this.CanvasObject = canvasElementName.getContext('2d');
            this.gameManager = new drones_manager_service_1.DronesManagerService();
            this.audioService = this.gameManager.soundService;
        }
        DronesCanvas.prototype.init = function () {
            var _this = this;
            window.document.body.style.backgroundColor = 'black';
            var arr = this.getWindowSize();
            this.CanvasObject.canvas.width = arr[0] - 15;
            this.CanvasObject.canvas.height = arr[1] - 25;
            this.hud = this.gameManager.hud;
            this.buildCanvasGUI(hud_2.SCREEN_ACTIONS.SPLASH);
            document.addEventListener('keydown', function (e) {
                _this.gameManager.keyChange(e.keyCode, true);
            });
            document.addEventListener('keyup', function (e) {
                _this.gameManager.keyChange(e.keyCode, false);
                if (e.keyCode === 13) {
                    if (_this.gameManager.pauseGame) {
                        _this.buildCanvasGUI(hud_2.SCREEN_ACTIONS.PAUSE);
                    }
                    else {
                        _this.hud.clearGUI();
                        _this.loop();
                    }
                }
            });
            window.addEventListener('resize', function () {
                var arr = _this.getWindowSize();
                _this.CanvasObject.canvas.width = arr[0] - 15;
                _this.CanvasObject.canvas.height = arr[1] - 25;
            });
            /** Click event handler.  Use For canvas button handling */
            this.canvasElementName.addEventListener('click', function (e) {
                var pos = {
                    x: e.clientX,
                    y: e.clientY
                };
            });
        };
        DronesCanvas.prototype.start = function () {
            this.gameManager.GameOver = false;
            this.audioService.next();
            this.loop();
        };
        DronesCanvas.prototype.reset = function () {
            window.cancelAnimationFrame(this.gameLoop);
            this.gameManager = new drones_manager_service_1.DronesManagerService();
            this.buildCanvasGUI(hud_2.SCREEN_ACTIONS.SPLASH);
        };
        /**
         * Function called to get Window Size of page.
         */
        DronesCanvas.prototype.getWindowSize = function () {
            var myWidth = 0, myHeight = 0;
            if (typeof (window.innerWidth) === 'number') {
                // everything outside of IE
                myWidth = window.innerWidth;
                myHeight = window.innerHeight;
            }
            else if (document.documentElement &&
                (document.documentElement.clientWidth ||
                    document.documentElement.clientHeight)) {
                // IE 6+ in 'standards compliant mode'... whatever that means
                myWidth = document.documentElement.clientWidth;
                myHeight = document.documentElement.clientHeight;
            }
            else if (document.body &&
                (document.body.clientWidth ||
                    document.body.clientHeight)) {
                // IE 4 compatible... blow it up cause you should never use it
                myWidth = document.body.clientWidth;
                myHeight = document.body.clientHeight;
            }
            return [myWidth, myHeight];
        };
        /**
         * UNUSED RIGHT NOW
         * @param num
         */
        DronesCanvas.prototype.setDifficulty = function (num) {
            switch (num) {
                case 1:
                    this.gameManager.GAME_DIFFICULTY = .04;
                    break;
                case 2:
                    this.gameManager.GAME_DIFFICULTY = .07;
                    break;
                case 3:
                    this.gameManager.GAME_DIFFICULTY = .13;
                    break;
                default:
                    this.gameManager.GAME_DIFFICULTY = .07;
                    break;
            }
            this.gameManager.playerRoF = 0;
            this.canvasElementName.focus;
        };
        /**
         * Builds buttons
         */
        DronesCanvas.prototype.buildCanvasGUI = function (screen) {
            this.canvasButtonList = [];
            switch (screen) {
                case hud_2.SCREEN_ACTIONS.SPLASH:
                    this.hud.splashScreen(this);
                    break;
                case hud_2.SCREEN_ACTIONS.PAUSE:
                    this.hud.pauseScreen(this);
                    break;
                case hud_2.SCREEN_ACTIONS.GAME_OVER:
                    this.hud.gameOverScreen(this);
                    break;
            }
            //buttons that are always visible
            // this.canvasButtonList.push(new CanvasButton(CANVAS_BUTTON_NAME.AUDIO_PLAY, 0, 0, 30, 50));
            // this.canvasButtonList.push(new CanvasButton(CANVAS_BUTTON_NAME.NEXT, 30, 0, 30, 50));
        };
        return DronesCanvas;
    }());
    exports.DronesCanvas = DronesCanvas;
});
