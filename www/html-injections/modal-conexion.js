$(function(){
  $("#modal-conexion").html('\
  	<!-- Modal Error de Conexion -->\
		<div id="modal-popup" class="modal fade" role="dialog">\
		  <div class="modal-dialog">\
		    <div class="modal-content" style="height: 400px;">\
		      <div class="modal-header">\
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
		        <h4 class="modal-title">Problemas de Conexión</h4>\
		      </div>\
		      <div class="modal-body">\
		          <h4>Oops, la consulta se está tardando más de lo normal</h4>\
		         <img src="img/loader.gif" alt="HTML5 Icon" style="display: block;margin-left:auto;margin-right:auto;width:100px;height:100px;">\
		          <ul>\
		            <li>Compruebe su conexión a internet</li>\
		            <li>Por favor espere unos segundos si su conexión está muy lenta</li>\
		            <li>Si no tiene problemas de conexión, podría haber problemas con el servidor, por favor intentelo de nuevo en unos segundos</li>\
		          </ul>\
		          \
		          <div>\
		            <h4>Sabías que?</h4>\
		            <div class="slider-pro" id="my-slider">\
		            <div class="sp-slides">\
		              <!-- Slide 1 -->\
		              <div class="sp-slide">\
		                <p>la cantidad de alergias alimenticias actualmente conocidas son 14</p>\
		              </div>\
		              <!-- Slide 2 -->\
		              <div class="sp-slide">\
		                <p>el porcentaje de alérgicos en chile es del 25%</p>\
		              </div>\
		              <!-- Slide 3 -->\
		              <div class="sp-slide">\
		                <p>el 33% de los adultos en Chile poeen intolerancia a la lactosa</p>\
		              </div>\
		              <!-- Slide 4 -->\
		              <div class="sp-slide">\
		                <p>tienes la posibilidad de ganar premios al ingresar productos que no se encuentren<br>en nuestra base de datos</p>\
		              </div>\
		            </div>\
		            </div>\
		          </div>\
		      </div>\
		    </div>\
		  </div>\
		</div>\
  ');
});
