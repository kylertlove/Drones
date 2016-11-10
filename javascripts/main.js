
$(document).ready(function(){

  var pageHeight = $(document).height();

    $('#divCodeExampleIntro').hover(function () {
      console.log('working');
        $(this).animate({boxShadow : "20px 20px 20px"}, 100);
      }, function () {
         $(this).animate({boxShadow : '5px 5px 5px'}, 100);
    });


});
