function logout(){
	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "http://"+url_server+"/sign_out",
	  "method": "DELETE",
	  xhrFields: {
	    withCredentials: true
	  },
	  "headers": {
	    "cache-control": "no-cache",
	    "postman-token": "0d3ea712-a98e-209b-6bcc-8b064906ed01"
	  },
	  error: function(resp, status){
	  	// console.log(resp);
    	console.log("error al cerrar sesion");
    	alert("Error al cerrar sesion, por favor comprueba tu conexión")
	  }
	}

	$.ajax(settings).done(function (response) {
	  // alert("Se recomienda que borres los datos de esta aplicacion");
  	window.location = "login.html";
	});
}

var stored_id = 0;

function guardar_id(newid){
	stored_id = newid;
}

// var stored_intolerance_id = 0;

//  	function guardar_intolerance_id(newid){
//  		stored_intolerance_id = newid;
//  	}

function add_familiar(nombre, id, importante){
	var familiar = ''+
		'<div class="panel panel-default">'+
	    '<div class="panel-heading" role="tab" id="heading_'+id+'">'+
	      '<h4 class="panel-title">'+
	        '<a role="button" data-toggle="collapse" data-parent="#accordion" onClick="guardar_id('+id+')" href="#collapse_'+id+'" aria-expanded="false" aria-controls="collapseOne">'+
	          nombre+
	          '<a data-toggle="modal" onClick="guardar_id('+id+')" data-target="#nombre-familiar-modal" href=""><span class=" edit-relative glyphicon glyphicon-pencil aria-hidden="true"></span></a>'+
	        '</a>'+
	      '</h4>'+
	    '</div>'+


	    '<div id="collapse_'+id+'" class="panel-collapse collapse'+importante+'" role="tabpanel" aria-labelledby="heading_'+id+'">'+
	      '<div class="panel-body">'+
	        '<ul class="list-group-'+id+'">'+
			    // #############intolerancias###############
					  // '<li class="intolerance list-group-item">'+
					  // 	'<img src="img/intolerancias/2.png" alt="...">'+
					  //   'Nueces'+
					  //   '<a href=""><span class=" remove-intolerance glyphicon glyphicon-remove aria-hidden="true"></span></a>'+
					  // '</li>'+
			    // #############intolerancias###############

					  // '<button data-toggle="modal" data-target="#intolerancia-modal" type="button" class="list-group-item">'+
						 //  '<a  href=""><span class=" add-intolerance glyphicon glyphicon-plus aria-hidden="true"></span></a>'+
						 //  'Agregar Intolerancia'+
					  // '</button>'+
					'</ul>'+
	      '</div>'+
	    '</div>'+
	  '</div>'
	$(".panel-group").append(familiar);
}

function add_intolerance(intolerance_id, family_id){
	all_intolerances = ["Lactosa","Gluten","Maní","Nueces","Apio","Mostaza","Huevo","Sesamo","Pescado","Crustaceos","Mariscos","Soya","Sulfitos","Lupino"]

	intolerance_name = all_intolerances[intolerance_id-1]

	var intolerance = ''+
  '<li class="intolerance list-group-item">'+
  	'<img src="img/intolerancias/'+intolerance_id+'.png" alt="..."> '+intolerance_name+
    // '<a href=""><span class="remove-intolerance glyphicon glyphicon-remove" onClick="delete_intolerance('+intolerance_id+')" aria-hidden="true"></span></a>'+
    '<a href="#"><span class="remove-intolerance glyphicon glyphicon-remove aria-hidden="true"  onClick="delete_intolerance('+intolerance_id+')"></span></a>'+
  '</li>'
  $(".list-group-"+family_id).append(intolerance)
}

// como family_id se usa el stored_id
function delete_intolerance(intolerance_id){
	var form = new FormData();
	form.append("family_id", stored_id);
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
				alert(JSON.parse(resp.responseText).error)
			}
			location.reload();
	  }
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
		location.reload();
	});
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

		$("#profilePicture").attr("src", foto_de_perfil);
		$.each(response.family, function(pos, familiar) {
	  	console.log("familiar:", familiar.name);

			if (pos==0){
				add_familiar(familiar.name, familiar.id, " in");
				guardar_id(familiar.id)
			}
			else{
				add_familiar(familiar.name, familiar.id, "");
			}
			get_familiar_data(familiar.id);
		});
	});
}

function get_familiar_data(family_id){
	var settings = {
	  "async": true,
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
		  alert("Error, por favor comprueba tu conexión")
	  	location.reload();
	  }
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
		$.each(response.intolerances, function(pos, intolerancia) {
	  	// console.log("intolerancia:", intolerancia.name);
		  add_intolerance(intolerancia.id, family_id);
		});
		button_add_intolerance=''+
		  '<button data-toggle="modal" data-target="#intolerancia-modal" type="button" class="list-group-item">'+
			  '<a  href=""><span class="add-intolerance glyphicon glyphicon-plus" aria-hidden="true"></span></a>'+
			  'Agregar Intolerancia'+
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
	  	console.log(resp);
		  alert("Error, por favor comprueba tu conexión")
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
	  	// console.log(resp);
	  	alert("Error, por favor comprueba tu conexión");
	  	location.reload();
		}
	}

	$.ajax(settings).done(function (response) {

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
	  location.reload();
	});
}

// como family_id se usa el stored_id
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
		  	// alert("Error, por favor comprueba tu conexión")
      }
      else{
        alert(JSON.parse(resp.responseText).error)
      }
	  	location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
		location.reload();
	});
}

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
				alert(JSON.parse(resp.responseText).error)
			}
			location.reload();
		}
	}

	$.ajax(settings).done(function (response) {
	  // console.log(response);
		location.reload();
	});
}

function go_main_menu(){
  window.location = "index.html";
}