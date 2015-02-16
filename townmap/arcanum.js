var gmicMapType;

function GMICMapType() {
    this.Cache = Array();
    this.opacity = 1.0;
}
GMICMapType.prototype.tileSize = new google.maps.Size(256, 256);
GMICMapType.prototype.maxZoom = 19;
GMICMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
    var tilex=coord.x;
    var tiley=coord.y;
    
    var xoffset = Math.floor((Math.pow(2,zoom) - zoomSize[zoom][0])/2);
    var yoffset = Math.floor((Math.pow(2,zoom) - zoomSize[zoom][1])/2);
    var width = xoffset + zoomSize[zoom][0];
    var height = yoffset + zoomSize[zoom][1];
    
    zoomSize[6] = [zoomSize[5][0]*2,zoomSize[5][1]*2];
    zoomSize[4] = [zoomSize[5][0]/2,zoomSize[5][1]/2];
    zoomSize[3] = [zoomSize[4][0]/2,zoomSize[4][1]/2];
      
    if ((tilex < xoffset)||(tilex>= width)||(tiley < yoffset)||(tiley >= (height)))
    {
    	var blank = ownerDocument.createElement('DIV');
    	blank.style.width = this.tileSize.width + 'px';
    	blank.style.height = this.tileSize.height + 'px';
    	return blank;
    }
    var num = (coord.y-yoffset)*zoomSize[zoom][0] + (coord.x-xoffset);
  	var img = ownerDocument.createElement('IMG');
    img.id = "t_" + num;
    img.style.width = this.tileSize.width + 'px';
    img.style.height = this.tileSize.height + 'px';
    img.src = folder + "/" + zoom + "/tile-"+num+".jpg";
    this.Cache.push(img);
    return img;
}

GMICMapType.prototype.realeaseTile = function(tile) {
    var idx = this.Cache.indexOf(tile);
    if(idx!=-1) this.Cache.splice(idx, 1);
    tile=null;
}
GMICMapType.prototype.name = "Image Cutter";
GMICMapType.prototype.alt = "Image Cutter Tiles";
GMICMapType.prototype.setOpacity = function(newOpacity) {
    this.opacity = newOpacity;
    for (var i = 0; i < this.Cache.length; i++) {
        this.Cache[i].style.opacity = newOpacity; //mozilla
        this.Cache[i].style.filter = "alpha(opacity=" + newOpacity * 100 + ")"; //ie
    }
}

var marker;
function load() {
    var latlng = new google.maps.LatLng(0.0,0.0);
    var myOptions = {
        zoom: 5,
        minZoom: 3,
        maxZoom: 6,
        center: latlng,
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        backgroundColor: '#000000',
        mapTypeId: "ImageCutter"
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    gmicMapType = new GMICMapType();
    map.mapTypes.set("ImageCutter",gmicMapType);
}  