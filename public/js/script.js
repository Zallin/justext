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

    reqOpts.data = JSON.stringify(vals);

    var jqxhr = $.ajax(reqOpts);

    jqxhr.done(function (data){
      if(data.redirect) window.location.href = data.redirect;
    });

    jqxhr.fail(function (){

    });

    this.reset();
  });

  $('.delete').click(function (e){
    e.preventDefault();
    var link = $(this).prev().attr('_permalink');

    var reqOpts = {
        method : "POST",
        url : '/posts/' + link,
    }

    reqOpts.headers = {
      "X-HTTP-Method-Override" : "DELETE"
    }

    var jqxhr = $.ajax(reqOpts);

    jqxhr.done(function (){

    });
  });
});
