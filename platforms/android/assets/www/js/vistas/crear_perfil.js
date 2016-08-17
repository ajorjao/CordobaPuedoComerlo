function register(){
	var form = new FormData();
	form.append("user[email]", $("#email").val());
	form.append("user[password]", $("#pass").val());
	form.append("user[password_confirmation]", $("#pass").val());

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/register",
	  "method": "POST",
	  xhrFields: {
	    withCredentials: true
	  },
	  "headers": {
	    "cache-control": "no-cache",
	    "postman-token": "6929ffa6-6171-2dfa-13b0-19fcaafe723b"
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form,
	  error: function(resp, status){
	  	// console.log(resp);
    	// console.log("error al logearse");
    	// alert("Error, por favor comprueba tu conexión")
      if (resp.status==0){
        alert("Error, por favor comprueba tu conexión")
      }
      else{
        alert(JSON.parse(resp.responseText).error)
      }
	  }
	}

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  add_new_familiar();
	});
}

function add_new_familiar(){
	var form = new FormData();
	form.append("family[name]", $("#name").val());

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/families",
	  "method": "POST",
	  xhrFields: {
	    withCredentials: true
	  },
	  "headers": {
	    "cache-control": "no-cache",
	    "postman-token": "880451d2-bb70-c49a-a2a2-bdea0c3d7827"
	  },
	  "processData": false,
	  "contentType": false,
	  "mimeType": "multipart/form-data",
	  "data": form,
	  error: function(resp, status){
	  	// console.log(resp);
      alert("Error, por favor comprueba tu conexión");
      location.reload();
	  }
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);

    var intolerances = [];
    $('.btn-add-intolerances').find('input:checked').each(function() {
      intolerances.push($(this).data('value'));
    });
    new_intolerances(JSON.parse(response).created.id, intolerances);

	});
}

function new_intolerances(familiar, intolerancias){ //(int, array)
  if (intolerancias==0 && familiar==0){
    familiar = stored_id;
    intolerancias = $(".select-intolerance").val();
  }

  var form = new FormData();
  form.append("family_id", familiar);
  form.append("intolerances_ids", intolerancias.toString());

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://"+url_server+"/family/intolerance",
    "method": "POST",
    xhrFields: {
      withCredentials: true
    },
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "04643411-9b85-17f5-0c7f-4c4375d05851"
    },
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form,
    error: function(resp, status){
      // alert("Error, no se pudieron agregar las intolerancias, por favor comprueba tu conexión")
      // console.log(resp);
      if (resp.status==0){
        alert("Error, por favor comprueba tu conexión")
      }
      else{
        alert(JSON.parse(resp.responseText).error)
      }
      location.reload();
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
    window.location = "perfil.html";
    // location.reload();
  });
}

function go_login(){
  window.location = "login.html";
}
