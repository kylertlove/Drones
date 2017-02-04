var Sound = (function($) {
  var format = ".mp3";
  var soundPath = "sounds/";
  var sounds = {};

  function loadSoundChannel(name) {
    var sound = $('<audio onended="songFinished();" id="musicTag" />').get(0);
    sound.src = soundPath + name + format;

    return sound;
  }

  function Sound(name, maxChannels) {
    return {
      play: function() {
        Sound.play(name, maxChannels);
      },

      stop: function() {
        Sound.stop(name);
      }
    };
  }

  return $.extend(Sound, {
    play: function(name, maxChannels) {
      // Note: Too many channels crash browsers
      maxChannels = maxChannels || 4;

      if(!sounds[name]) {
        sounds[name] = [loadSoundChannel(name)];
      }

      var freeChannels = $.grep(sounds[name], function(sound) {
        return sound.currentTime === sound.duration || sound.currentTime === 0;
      });

      if(freeChannels[0]) {
        try {
          freeChannels[0].currentTime = 0;
        } catch(e) {
        }
        freeChannels[0].play();
      } else {
        if(!maxChannels || sounds[name].length < maxChannels) {
          var sound = loadSoundChannel(name);
          sounds[name].push(sound);
          sound.play();
        }
      }
    },

    stop: function(name) {
      if(sounds[name]) {
        for(var j = 0; j < sounds[name].length; j++){
          sounds[name][j].muted = true;
        }

      }
    }
  });
}(jQuery));
