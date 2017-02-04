var PAUSE = false;
var POWERUP = false;

$(document).ready(function(){


//  var pageHeight = $(document).height();

  $('#divCodeExampleIntro').hover(function () {
    console.log('working');
    $(this).animate({boxShadow : "20px 20px 20px"}, 100);
  }, function () {
    $(this).animate({boxShadow : '5px 5px 5px'}, 100);
  });

  $('#chkbxCheatCodes').change(function(){
    if($('#chkbxCheatCodes')[0].checked){
      POWERUP = true;
    }else{
      POWERUP = false;
    }
  });

});

function playPause(){
  PAUSE = !PAUSE;
}
var musicPointer = 0;
var musicArr = ["trapqueen", "offspring", "Blink", "getLucky"];
function startMusic(){
  Sound.play(musicArr[musicPointer]);
}
function nextMusic(){
  Sound.stop(musicArr[musicPointer]);
  if(musicPointer === musicArr.length-1){
    musicPointer = 0;
  }else{
    musicPointer++;
  }
  Sound.play(musicArr[musicPointer]);
}
function prevMusic(){
  Sound.stop(musicArr[musicPointer]);
  if(musicPointer === 0){
    musicPointer = musicArr.length -1;
  }else{
    musicPointer--;
  }
  Sound.play(musicArr[musicPointer]);
}
function stopMusic(){
  Sound.stop(musicArr[musicPointer]);
}
function songFinished(){
  nextMusic();
}
