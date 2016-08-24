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
    console.log('retrievedObject: ', pdata);
});

function patata(){
  //nada :DDD
}
