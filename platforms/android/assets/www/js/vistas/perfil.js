var stored_id = 0;
var stored_name = ""

function guardar_id(newid, name){
	stored_id = newid;
	stored_name = name;
	console.log("id guardardada:",name,"-", stored_id)
}

function add_familiar(nombre, id){
	var familiar = ''+
		'<div class="panel panel-default">'+
			'<div class="panel-heading" role="tab" id="heading_'+id+'">'+
				'<h4 class="panel-title">'+nombre+
						'<a data-toggle="modal" data-target="#nombre-familiar-modal" href=""><span class=" edit-relative glyphicon glyphicon-pencil aria-hidden="true" onClick="guardar_id('+id+',\''+nombre+'\')"></span></a>'+
				'</h4>'+
			'</div>'+


			'<div id="collapse_'+id+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_'+id+'">'+
				'<div class="panel-body">'+
					'<ul class="list-group-'+id+'" style="padding-left: 0;">'+
					// #############intolerancias###############
						// '<li class="intolerance list-group-item">'+
						// 	'<img src="img/intolerancias/2.png" alt="...">'+
						//   'Nueces'+
						//   '<a href=""><span class=" remove-intolerance glyphicon glyphicon-remove aria-hidden="true"></span></a>'+
						// '</li>'+
					// #############intolerancias###############
					'</ul>'+
				'</div>'+
			'</div>'+
		'</div>'
	$(".panel-group").append(familiar);
}

function add_intolerance(intolerance_id, family_id, family_name){
	all_intolerances = ["Lactosa","Gluten","Maní","Nueces","Apio","Mostaza","Huevo","Sesamo","Pescado","Crustaceos","Mariscos","Soya","Sulfitos","Lupino"]

	intolerance_name = all_intolerances[intolerance_id-1]

	var intolerance = ''+
	'<li class="intolerance list-group-item">'+
		'<img src="img/intolerancias/'+intolerance_id+'.png" alt="..."> '+intolerance_name+
		'<a href="#"><span class="remove-intolerance glyphicon glyphicon-remove aria-hidden="true"  onClick="delete_intolerance('+intolerance_id+','+family_id+',\''+family_name+'\')"></span></a>'+
	'</li>'
	$(".list-group-"+family_id).append(intolerance)
}

function delete_intolerance(intolerance_id, family_id, family_name){
	var form = new FormData();
	form.append("family_id", family_id);
	form.append("intolerance_id", intolerance_id);

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://"+url_server+"/family/intolerance",
		"method": "DELETE",
		xhrFields: {
			withCredentials: true
		},
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "8b5643a5-12a1-00bb-f3fb-155a6197ace5"
		},
		"processData": false,
		"contentType": false,
		"mimeType": "multipart/form-data",
		"data": form,
		error: function(resp, status){
			if (resp.status==0){
				alert("Error, por favor comprueba tu conexión")
			}
			else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
			}
			location.reload();
		}
	}

	var eliminar_intolerancia = confirm("¿Estás seguro que deseas eliminar la intolerancia de "+family_name+"?");
	if (eliminar_intolerancia == true) {
		$.ajax(settings).done(function (response) {
			console.log(response);
      send_alert("<strong>Intolerancia elminada</strong>", "success");
			// alert("Intolerancia eliminada");
			localStorage.removeItem('intolerancias-familia');
			location.reload();
		});
	}
}

last_intolerancias = localStorage.getItem('intolerancias-familia');
if (last_intolerancias){
	var intolerancias_familia = JSON.parse(last_intolerancias).intolerancias;
}
else{
	var intolerancias_familia = [];
}

function get_my_data(){
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://"+url_server+"/user",
		"method": "GET",
		xhrFields: {
			withCredentials: true
		},
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "e75d6d1f-85a5-fdce-0ff6-704ff358920b"
		},
		error: function(resp, status){
			alert("Error de conexión, intentalo nuevamente");
			window.location = "login.html";
		}
	}

	$.ajax(settings).done(function (response) {
		var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
		$("#profilePicture").attr("src", foto_de_perfil.replace("/original/","/medium/"));

		$.each(response.family, function(pos, familiar) {
			console.log("familiar:", familiar.name);
			add_familiar(familiar.name, familiar.id);
			get_familiar_data(familiar.id, familiar.name);
		});
  	localStorage.setItem('intolerancias-familia', JSON.stringify({ 'intolerancias': intolerancias_familia }));
	});
}

function get_familiar_data(family_id, family_name){
	var settings = {
		"async": false,
		"crossDomain": true,
		"url": "http://"+url_server+"/families/"+family_id,
		"method": "GET",
		xhrFields: {
			withCredentials: true
		},
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "bc75788d-2cae-eda1-4aa1-024dbb0af657"
		},
		error: function(resp, status){
			console.log(resp);
			alert("Error, por favor comprueba tu conexión");
			location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
		// console.log(response);
		$.each(response.intolerances, function(pos, intolerancia) {
			// console.log("intolerancia:", intolerancia.name);
			add_intolerance(intolerancia.id, family_id, family_name);
			if (intolerancias_familia.indexOf(intolerancia.id)==-1){
				intolerancias_familia.push(intolerancia.id)
			}
		});
		button_add_intolerance=''+
			'<button data-toggle="modal" data-target="#intolerancia-modal" onClick="guardar_id('+family_id+',\''+family_name+'\')" type="button" class="list-group-item">'+
				'<a  href=""><span class="add-intolerance glyphicon glyphicon-plus" aria-hidden="true"></span></a>'+
				' Agregar Intolerancia'+
			'</button>'
		$(".list-group-"+family_id).append(button_add_intolerance);
	});
}

function new_picture(){
	var form = new FormData();
	form.append("user[avatar]", $("#InputFile").prop("files")[0]);

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://"+url_server+"/user/",
		"method": "PUT",
		xhrFields: {
			withCredentials: true
		},
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "1fa9c955-3fc6-3be7-2a0d-d01f59170acb"
		},
		"processData": false,
		"contentType": false,
		"mimeType": "multipart/form-data",
		"data": form,
		error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		location.reload();
	});
}

function new_familiar(){
	var form = new FormData();
	form.append("family[name]", $("#new_relative_name").val());

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
			"postman-token": "04643411-9b85-17f5-0c7f-4c4375d05851"
		},
		"processData": false,
		"contentType": false,
		"mimeType": "multipart/form-data",
		"data": form,
		error: function(resp, status){
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
		}
	}

	$.ajax(settings).done(function (response) {

		var intolerances = [];
		$("#check-list-box li.active").each(function() {
			intolerances.push($(this).data('value'));
		});

		new_intolerances(JSON.parse(response).created.id, intolerances);
	});
}

function new_intolerances(familiar, intolerancias){ //(int, array)
// stored_id en caso de que se seleccione desde el Modal Nueva Intolerancia
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
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
      }
      else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
      }
      location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		location.reload();
	});
}

// como family_id, se usa el stored_id ya que se reutiliza el mismo modal por cada usuario
function edit_familiar(){
	var form = new FormData();
	form.append("family[name]", $("#name").val());

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://"+url_server+"/families/"+stored_id,
		"method": "PUT",
		xhrFields: {
			withCredentials: true
		},
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "1082d9ec-0ae4-0939-b9d5-cb671fcecd07"
		},
		"processData": false,
		"contentType": false,
		"mimeType": "multipart/form-data",
		"data": form,
		error: function(resp, status){
			// console.log(resp);
			if (resp.status==0){
				alert("Error, por favor comprueba tu conexión")
			}
			else{
        send_alert(JSON.parse(resp.responseText).error, "danger");
			}
			location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
		// console.log(response);
		location.reload();
	});
}

// como family_id, se usa el stored_id ya que se reutiliza el mismo modal por cada usuario
function delete_familiar(){
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://"+url_server+"/families/"+stored_id,
		"method": "DELETE",
		xhrFields: {
			withCredentials: true
		},
		"headers": {
			"cache-control": "no-cache",
			"postman-token": "ffda9024-5df8-49dd-cbbf-af449e968378"
		},
		error: function(resp, status){
			if (resp.status==0){
				alert("Error, por favor comprueba tu conexión")
			}
			else{
      	send_alert(JSON.parse(resp.responseText).error, "danger");
			}
			location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
		// console.log(response);
		location.reload();
	});
}


function go_back(){
  var back = JSON.parse(localStorage.getItem('back'));
  window.location = back.location;
}


// funcion que hace que los checklist se vean bien... ### no es necesario ententerla, solo saber q funciona xd ###
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