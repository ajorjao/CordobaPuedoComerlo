function modo_sin_conexion(){
	userdata = JSON.parse(localStorage.getItem('usuario'));
	$("#profilePicture").attr("src", userdata.foto_de_perfil);
	$("#profilePicture2").attr("src", userdata.foto_de_perfil);
	$("#nombredelwn").html(userdata.username);
	$.each(userdata.grupo_familiar, function(pos, familiar) {
		console.log("familiar:", familiar.name);
		add_familiar(familiar.name, familiar.id);
		$(".list-group-"+familiar.id).append('<li class="intolerance list-group-item">En el modo sin conexion no se pueden ver las intolerancias</li>')
		$('#heading_'+familiar.id+' a').remove()
	});
	$('.panel-heading .info').text("")
	$('.btn.btn-success').remove();
	$('#change-photo').remove();
	$('#familiares').css('margin-top','40px');
	$('#add-familiar').remove();
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
      if (resp.status==0){
        alert("Error de conexión con el servidor, por favor intentelo mas tarde");
        location.reload();
      }
      else{
        not_loged();
      }
		}
	}


	// se intenta reducir las consultas al servidor
	userdata = JSON.parse(localStorage.getItem('usuario'));
	if (userdata){
		console.log("la info del perfil se obtuvo localmente");
		$("#profilePicture").attr("src", userdata.foto_de_perfil);
		$("#profilePicture2").attr("src", userdata.foto_de_perfil);
		$("#nombredelwn").html(userdata.username);
		$.each(userdata.grupo_familiar, function(pos, familiar) {
			console.log("familiar:", familiar.name);
			add_familiar(familiar.name, familiar.id);
			get_familiar_data(familiar.id, familiar.name);
		});
	}

	else{
		$.ajax(settings).done(function (response) {
			console.log("se hace la consulta del perfil");
			var foto_de_perfil = "http://"+url_server+response.user.avatar_file_name
			foto_de_perfil = foto_de_perfil.replace("/original/","/medium/")
			$("#profilePicture").attr("src", foto_de_perfil);
			$("#profilePicture2").attr("src", foto_de_perfil);
			$("#nombredelwn").html(response.user.username);
			$.each(response.family, function(pos, familiar) {
				console.log("familiar:", familiar.name);
				add_familiar(familiar.name, familiar.id);
				get_familiar_data(familiar.id, familiar.name);
			});
			//aqui se guardan/actualizan los datos del usuario
			foto_de_perfil_base64 = ""
			toDataUrl(foto_de_perfil, function(base64Img) {
			  foto_de_perfil_base64 = base64Img;
		    localStorage.setItem('usuario', JSON.stringify({'username': response.user.username, 'intolerancias': intolerancias_familia, 'grupo_familiar': response.family, 'foto_de_perfil': foto_de_perfil_base64 }))
			});
		});
	}
}

// Grupo familiar
	var stored_id = 0;
	var stored_name = ""

	function guardar_id(newid, name){
		stored_id = newid;
		stored_name = name;
		console.log("id guardardada:",name,"-", stored_id)
	}

	function add_familiar(nombre, id){
		var familiar = '\
			<div class="panel panel-default">\
				<div class="panel-heading" style="display: inline-block; width: calc(100% - 38px);" role="tab" onclick="$(\'#\'+this.id+\' h4 span\').toggleClass(\'glyphicon-chevron-right\'); $(\'#\'+this.id+\' h4 span\').toggleClass(\'glyphicon-chevron-down\');" id="heading_'+id+'" data-toggle="collapse" data-parent="#accordion" href="#collapse_'+id+'" aria-expanded="true" aria-controls="collapseOne">\
					<h4 class="panel-title"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> '+nombre+'\
					</h4>\
				</div>'+

				'<a data-toggle="modal" data-target="#nombre-familiar-modal">\
					<span style="padding: 10px; font-size: 17px; color: black;" class="edit-relative glyphicon glyphicon-pencil" aria-hidden="true" onClick="guardar_id('+id+',\''+nombre+'\'); center_modal(\'nombre-familiar-modal\'); $(\'#name\').val(\''+nombre+'\')"></span>\
				</a>'+
				
				'<div id="collapse_'+id+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_'+id+'" aria-expanded="false">\
						<ul class="list-group-'+id+'" style="padding-left: 0;">'+
						// #############intolerancias###############
							// '<li class="intolerance list-group-item">'+
							// 	'<img src="img/intolerancias/2.png" alt="...">'+
							//   'Nueces'+
							//   '<a href=""><span class=" remove-intolerance glyphicon glyphicon-remove aria-hidden="true"></span></a>'+
							// '</li>'+
						// #############intolerancias###############
						'</ul>\
				</div>\
			</div>'
		$("#familiares").append(familiar);
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
					alert("Error, por favor comprueba tu conexión");
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
				localStorage.removeItem('usuario'); //se rehace el usuario ya que las intolerancias del grupo famliar pudieron haber cambiado
				location.reload();
			});
		}
	}

	user = localStorage.getItem('usuario');
	if (user){
		var intolerancias_familia = JSON.parse(user).intolerancias;
	}
	else{
		var intolerancias_familia = [];
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
				// console.log(resp);
	      if (resp.status==0){
	        alert("Error, por favor comprueba tu conexión")
	      }
	      else{
					localStorage.removeItem('usuario'); //para cuando se cambia de ip desde un mismo dispositivo
	      }
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
				'<button data-toggle="modal" data-target="#intolerancia-modal" onClick="guardar_id('+family_id+',\''+family_name+'\'); center_modal(\'intolerancia-modal\');" type="button" class="list-group-item">'+
					'<a  href=""><span class="add-intolerance glyphicon glyphicon-plus" aria-hidden="true"></span></a>'+
					' Agregar Intolerancia'+
				'</button>'
			$(".list-group-"+family_id).append(button_add_intolerance);
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
		// stored_id guarda el familiar en caso de que se seleccione desde el Modal de Agregar Intolerancia
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
				localStorage.removeItem('usuario'); //se rehace el usuario ya que las intolerancias del grupo famliar pudieron haber cambiado
	      location.reload();
			}
		}

		$.ajax(settings).done(function (response) {
			localStorage.removeItem('usuario');
			// console.log(response);
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
			localStorage.removeItem('usuario'); //se rehace el usuario ya que las intolerancias del grupo famliar pudieron haber cambiado
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
			localStorage.removeItem('usuario'); //se rehace el usuario ya que las intolerancias del grupo famliar pudieron haber cambiado
			location.reload();
		});
	}
// End grupo familiar

// Username y foto de perfil
	function change_username_mode(){
	  if ($("#nombredelwn").is(":visible")){
	  	var current_username = $("#nombredelwn").text()
		  $('#nombredelwn').hide();
		  $('#nombredelwn-input').show();
		  $('#change_username').show();
		  $('#cancel_username').show();
	  	$('#nombredelwn-input').val(current_username);
		  // setTimeout(function(){
		  // }, 0);
	  }
	  else{
		  $('#nombredelwn').show();
		  $('#nombredelwn-input').hide();
		  $('#change_username').hide();
		  $('#cancel_username').hide();	
	  }
	}

	function change_username(){
		var form = new FormData();
		form.append("user[username]", $('#nombredelwn-input').val());

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
			// console.log(response);
			localStorage.removeItem('usuario'); //se rehace el usuario cuando se cambia el nombre de usuario
			location.reload();
		});
	}

	function new_picture(){
		$("#foto-perfil-modal").modal("hide");
	  loading("Subiendo Imagen","Por favor espere mientras esta subiendo su nuevo avatar", 0);

		var form = new FormData();
		// form.append("user[avatar]", $("#InputFile").prop("files")[0]);
    form.append("user[avatar]", $('#myImage').attr("src"));

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
			// console.log(response);
			stop_loading();
			localStorage.removeItem('usuario'); //se rehace el usuario cuando se agrega una nueva imagen
			location.reload();
		});
	}

	function select_photo(myurl){
		url = $(myurl).val()
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#myImage').attr('src', e.target.result);
    }
   	reader.readAsDataURL(myurl.files[0]);
	}


	function foto(){
	  navigator.camera.getPicture(
	    function onSuccess(imageData){
	      var image = document.getElementById('myImage');
	      image.src = "data:image/jpeg;base64," + imageData;
	    },
	    function onFail(message){
	      // alert('Error: ' + message);
	      alert('Se ha cancelado la fotografia');
	      location.reload();
	    },
	    { //options
	      quality: 100,
	      targetWidth: 1024,
	      targetHeight: 768,
	      destinationType: Camera.DestinationType.DATA_URL,
	      cameraDirection: Camera.Direction.FRONT
	    }
	  );
	}
//End username y foto de perfil


function go_back(){
  var back = JSON.parse(localStorage.getItem('back'));
  window.location = back.location;
}


// funcion que hace que seleccionar una foto se vea bien
// $(function () {
// 	$("#InputFile").fileinput({
//     overwriteInitial: true,
//     maxFileSize: 1500,
//     showClose: false,
//     showCaption: false,
//     browseLabel: '',
//     removeLabel: '',
//     browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
//     removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
//     removeTitle: 'Cancel or reset changes',
//     elErrorContainer: '#kv-avatar-errors-1',
//     msgErrorClass: 'alert alert-block alert-danger',
//     defaultPreviewContent: '<i class="fa fa-upload" aria-hidden="true"></i>',
//     layoutTemplates: {main2: '{preview} ' +  btnCust + ' {remove} {browse}'},
//     allowedFileExtensions: ["jpg", "png", "gif"]
// 	});
// });


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