var consulta_exitosa = false;

jQuery(document).ready(function( $ ) {
    $( '#my-slider' ).sliderPro({
      forceSize:'fullWidth',
      fade:true,
      buttons:false,
      keyboard:false,
      touchSwipe:false,
      autoplayOnHover:'none',
    });
                                            // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('pdata');
    pdata = JSON.parse(retrievedObject);
    //console.log('retrievedObject: ', pdata); // para ver en consola los datos recibidos
    //pdata.pnint = 1;                       // pa cachar que la wea funciona xd
    if (pdata.pnint==0){
      class1 = "alert alert-success";
      srcimg = "img/sisi.png";
    }
    else{
      class1 = "alert alert-danger";
      srcimg = "img/nono.png";
    }
    detalle = '<center><div class="'+class1+'" role="alert"><h3 class="display-3">'+pdata.pname+'</h3><p class="lead">'+pdata.pid+'</p><br><img  src="'+srcimg+'" alt="..." ></div></center>';
    $("#menu1").append(detalle);
});

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
function go_main_menu(){
  window.location = "index.html";
}