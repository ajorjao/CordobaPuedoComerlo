function register(){
  var form = new FormData();
  form.append("user[email]", $("#email").val());
  form.append("user[password]", $("#pass").val());
  form.append("user[password_confirmation]", $("#pass_conf").val());

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
				alert("Error, por favor comprueba tu conexión");
		  }
		  else{
				alert(JSON.parse(resp.responseText).error);
		  }
		}
	}

	if ($('#pass').val() != $('#pass_conf').val()) {
		alert("Error, las contraseñas no coinciden")
	}
	else if ($('#name').val()=="") {
		alert("Error, tu nombre no puede quedar vacio")
	}
	else {
	  $.ajax(settings).done(function (response) {
			console.log(response);
			add_new_familiar();
	  });
	}
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
		$("#check-list-box li.active").each(function() {
		  intolerances.push($(this).data('value'));
		});
		new_intolerances(JSON.parse(response).created.id, intolerances);
		alert("Te has registrado exitosamente");
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
	"async": false,
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




function showhidepass(){
	if ($('#pass').attr('type') == 'password'){
		$('#pass').attr('type', 'text');
		$('#pass_conf').attr('type', 'text');
	}
	else{
		$('#pass').attr('type', 'password');
		$('#pass_conf').attr('type', 'password');
	}
  
}





// funcion que hace que los checklist se vean bien... no es necesario ententerla, solo saber q funciona
$(function () {
	$('.list-group.checked-list-box .list-group-item').each(function () {
		
		// Settings
		var $widget = $(this),
			$checkbox = $('<input type="checkbox" class="hidden" />'),
			color = ($widget.data('color') ? $widget.data('color') : "primary"),
			style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
			settings = {
				on: {
					icon: 'glyphicon glyphicon-check'
				},
				off: {
					icon: 'glyphicon glyphicon-unchecked'
				}
			};
			
		$widget.css('cursor', 'pointer')
		$widget.append($checkbox);

		// Event Handlers
		$widget.on('click', function () {
			$checkbox.prop('checked', !$checkbox.is(':checked'));
			$checkbox.triggerHandler('change');
			updateDisplay();
		});
		$checkbox.on('change', function () {
			updateDisplay();
		});
		  

		// Actions
		function updateDisplay() {
			var isChecked = $checkbox.is(':checked');

			// Set the button's state
			$widget.data('state', (isChecked) ? "on" : "off");

			// Set the button's icon
			$widget.find('.state-icon')
				.removeClass()
				.addClass('state-icon ' + settings[$widget.data('state')].icon);

			// Update the button's color
			if (isChecked) {
				$widget.addClass(style + color + ' active');
			} else {
				$widget.removeClass(style + color + ' active');
			}
		}

		// Initialization
		function init() {
			
			if ($widget.data('checked') == true) {
				$checkbox.prop('checked', !$checkbox.is(':checked'));
			}
			
			updateDisplay();

			// Inject the icon if applicable
			if ($widget.find('.state-icon').length == 0) {
				$widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
			}
		}
		init();
	});

});