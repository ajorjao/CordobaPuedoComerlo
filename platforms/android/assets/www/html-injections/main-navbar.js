$(function(){
  $("#main-navbar").html('\
    <nav class="navbar" style="margin-bottom: 0;">\
      <div class="container-fluid">\
        <ul class="nav navbar-nav" style="margin: 0;">\
        <li>\
          <a href="perfil.html"> <img id="profilePicture" alt="..." class="img-circle">\
            <span style="font-size: 15px; position: absolute; top: 57px; left: 15px; color: white;">Mi perfil</span>\
          </a>\
        </li>\
        <li><p class="navbar-text navbar-text-menu">¿Puedo comerlo?</p></li>\
        </ul>\
      </div>\
    </nav>\
    <nav class="navbar navbar2">\
      <a href="index.html">\
        <div class="col-xs-3 btn-default">\
          <img class="center-block" src="img/barcode-scan.png" alt="...">\
        </div>\
      </a>\
      <a href="busqueda_id.html">\
        <div class="col-xs-3 btn-default">\
          <img class="center-block" src="img/barcode-search.png" alt="...">\
        </div>\
      </a>\
      <a href="busqueda_nombre.html">\
        <div class="col-xs-3 btn-default">\
          <img class="center-block" src="img/search-name.png" alt="...">\
        </div>\
      </a>\
      <a href="configuraciones.html">\
        <div class="col-xs-3 btn-default">\
          <img class="center-block" src="img/settings.png" alt="..." >\
        </div>\
      </a>\
    </nav>\
  ');

  var filename = window.location.pathname.split("/").pop();
  $('a[href$="'+filename+'"] .btn-default').toggleClass("active")

  if (filename=="busqueda_id.html"){
  	$('.navbar-text.navbar-text-menu').html("Busqueda por Codigo")
  }
  else if (filename=="busqueda_nombre.html"){
  	$('.navbar-text.navbar-text-menu').html("Busqueda por Nombre")
  }
  else if (filename=="configuraciones.html"){
  	$('.navbar-text.navbar-text-menu').html("Configuraciones")
  }

});
