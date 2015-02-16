// -- Arcanum Coordinate Projection -- //
function ArcanumProjection() {
  this.worldOrigin_ = new google.maps.Point(250, 0);
  this.ratio_ = 250/20; 
};

ArcanumProjection.prototype.fromLatLngToPoint = function(latLng) {
  var ratio = this.ratio_;
  var x = 250 - latLng.lng() * ratio;
  /*if(x < 0) x = 0;
  if(x > 250) x = 250;*/

  var y = latLng.lat() * ratio;
  if(y < 0) y = 0;
  if(y > 250) y = 250;

  return new google.maps.Point(x, y);
};

ArcanumProjection.prototype.fromPointToLatLng = function(point, noWrap) {
  var origin = this.worldOrigin_;
  var ratio = this.ratio_;

  var x = origin.x - point.x;
  var y = point.y;
  
  if (y < 0) {
    y = 0;
  }
  if (y >= 250) {
    y = 250;
  }
  
  var lng = x / ratio;
  var lat = y / ratio;
  
  return new google.maps.LatLng(lat, lng, noWrap); 
};
    
// -- Arcanum Map Type -- //
var arcanumTypeOptions = {
      lang: 'en',
      getTileUrl: function(coord, zoom) {
         if (coord.x < 0 || coord.x > (Math.pow(2,zoom)-1)) return null;
         if (coord.y < 0 || coord.y > (Math.pow(2,zoom)-1)) return null;
         var num = (coord.x) + (coord.y*Math.pow(2,zoom));
         var image = "images/" + zoom + "/tile-" + num + ".jpg";
         return image;
      },
      tileSize: new google.maps.Size(250, 250),
      isPng: false,
      maxZoom: 4,
      minZoom: 2,
      name: 'Arcanum'
};

var map = null;

// -- Init -- //      
function initialize() {
  var arcanumMapType = new google.maps.ImageMapType(arcanumTypeOptions);
  arcanumMapType.projection = new ArcanumProjection(); 

  var myLatlng = new google.maps.LatLng(9.72, 10.29);
  var myOptions = {
    center: myLatlng,
    zoom: 3,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL
    },
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions ); 
  map.mapTypes.set('Arcanum', arcanumMapType)  
  map.setMapTypeId('Arcanum');
  
  // bounds of the desired area
  var allowedBounds = new google.maps.LatLngBounds(
       new google.maps.LatLng(0.0, 0.0), 
       new google.maps.LatLng(20.0, 20.0)
  );
  var lastValidCenter = map.getCenter();
  
  google.maps.event.addListener(map, 'center_changed', function() {
      if (allowedBounds.contains(map.getCenter())) {
          // still within valid bounds, so save the last valid position
          lastValidCenter = map.getCenter();
          return; 
      }
  
      // not valid anymore => return to last valid position
      map.panTo(lastValidCenter);
  });

  var image = new google.maps.MarkerImage('MM_Loc.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(11, 11),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(5, 5));
  var image2 = new google.maps.MarkerImage('MM_Loc2.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(11, 11),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(5, 5));
       
  var infoWindow = new google.maps.InfoWindow();  
  var mgrOptions = { borderPadding: 50, maxZoom: 4, trackMarkers: false};
  var mgr = new MarkerManager(map, mgrOptions);

  google.maps.event.addListener(mgr, 'loaded', function(){
    var markers = [];
    for(var i = 0; i < gamearea.length; i++) {
        var data = gamearea[i];
        var x = data[0]/64; var lng = x/100;
        var y = data[1]/64; var lat = y/100;
        var desc = '('+ Math.floor(x) + 'W, ' + Math.floor(y) +'S)<br/>' + data[5]; 
        if(data[8].length > 0) {
          desc = desc + '<ul>';
          for(var j = 0; j < data[8].length; j++) {
            desc = desc + '<li><a target="_blank" href="townmap/' + data[8][j] + '.html">' + data[8][j] + '</a></li>';
          }
          desc = desc + '</ul>';
        }
        
        var marker = new MarkerWithLabel({
            position: new google.maps.LatLng(lat,lng),
            title: data[4],
            desc: desc,
            labelNote : (data[8].length > 0 ? true : false),
            labelContent: data[4],
            labelOffsetX: data[2],
            labelOffsetY: data[3],
            icon: image
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.setContent('<div class="info-window-content"><h4>' + this.title + '</h4><p>' + this.desc + '</p></div>');
          infoWindow.open(map, this);
        });  
                     
        mgr.addMarker(marker, data[7]);
    }
  });
}
