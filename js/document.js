$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();


    $('#top-toolbar').hide();

    function init(){
         $('.minitoc-tab').toggleClass('selected');
        $('.document-wrapper').toggleClass('isActive');
        $('aside').toggleClass('no-display');
        $('.inner-arrow').addClass('no-display');
    }

    init();


})