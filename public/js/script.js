window.onload = function (){
    $('form').submit(function(e){
        e.preventDefault();

        var vals = {}

        var form = $(this).serializeArray();

        for(var i = 0; i < form.length; i++){
            var key = form[i].name, val = form[i].value;
            vals[key] = val;
        }

        var opts = {
            method : 'POST',
            url : window.location.href,
            contentType : 'application/json',
            data : JSON.stringify(vals)
        }

        var jqxhr = $.ajax(opts);

        jqxhr.done(function(data){
          window.location.replace(data.redirect);
        });

        this.reset();
    });
}
