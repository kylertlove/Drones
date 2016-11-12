/*
Controller Class.  self-invoking function that creates all the
abstract objects
*/
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

//build game page /// why cant the page read objects from self-invoking functions
(function(){
//keep the screen from moving with the arrow keys
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  //add the base class functions to the widow object
  //these are the functions that the game will call to create objects

  window.projectile = function(xvel, yvel, a, b, c){
    return Projectile(xvel, yvel, a, b, c);
  };

  window.user = function(x, y, a, b, c){
    return User(x, y, a, b, c);
  };

  //the private functions that the base class functions call to create the
  //objects for the game.  Now I can create instances of entities without
  //have to call or be able to change the entObj object.

  function Entity(colors, widths, heights){
    color = colors || "#fff";
    widths = widths || 0;
    heights = heights || 0;

    entObj = {
      color: colors,
      width: widths,
      height: heights
    };
    return entObj;
  }

  function Projectile(xvel, yvel, A, B, C){
    xvel = xvel || 0;
    yvel = yvel || 0;

    projectileObj = {
      xVel: xvel,
      yVel: yvel
    };
    $.extend(projectileObj, Entity(A, B, C));
    return projectileObj;
  }

  function User(X, Y, A, B, C){
    X = X || 0;
    Y = Y || 0;

    userObj = {
      x: X,
      y: Y
    };
    $.extend(userObj, Entity(A, B, C));
    return userObj;
  }
})();
