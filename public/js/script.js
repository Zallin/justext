$(document).ready(function (){

  var reqOpts = {
    method : 'POST',
    url : window.location.href,
    contentType : 'application/json'
  }

  $('form').submit(function (e){
    e.preventDefault();

    var vals = {};

    var form = $(this).serializeArray();

    for(var i = 0; i < form.length; i++){
        var key = form[i].name, val = form[i].value;
        vals[key] = val;
    }
    console.log(vals);
    reqOpts.data = JSON.stringify(vals);

    var jqxhr = $.ajax(reqOpts);

    jqxhr.done(function (){

    });

    jqxhr.fail(function (){

    });

    this.reset();
  });
});
