L.TileLayer.Arcanum = L.TileLayer.extend({
    getTileUrl: function(coord) {
        if (coord.x < 0 || coord.x > (Math.pow(2,coord.z)-1)) return null;
        if (coord.y < 0 || coord.y > (Math.pow(2,coord.z)-1)) return null;
        var num = (coord.x) + (coord.y*Math.pow(2,coord.z));
        var image = "images/" + coord.z + "/tile-" + num + ".jpg";
        return image;
    },
    getTileSize: function() {
        return L.point(250, 250);
    }
});

var ArcanumIcon = L.Icon.extend({
    options: {
        // @section
        // @aka DivIcon options
        iconSize: [12, 12], // also can be set through CSS
        // iconAnchor: (Point),
        // popupAnchor: (Point),
        // @option html: String = ''
        // Custom HTML code to put inside the div element, empty by default.
        html: false,
        // @option bgPos: Point = [0, 0]
        // Optional relative position of the background, in pixels
        bgPos: null,
        className: 'leaflet-div-icon',
        offsetX : 0,
        offsetY : 0
    },

    createIcon: function (oldIcon) {
        var div = document.createElement('div');
        options = this.options;

        var offsetX =  5 + options.offsetX;
        var offsetY =  options.offsetY - 6;
        var img = options.img;

        div.innerHTML  = '<img src="MM_Loc.png" style="float:left" />'
        div.innerHTML += '<img src="labels/' + img + '.png" alt="Tarant" style="position:relative;left:' + offsetX + 'px;top:' + offsetY + 'px;"/>';

        if (options.bgPos) {
            var bgPos = point(options.bgPos);
            div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
        }
        div.style.width = 'auto';
        div.style.whiteSpace = 'nowrap';
        div.style.marginLeft = '-5px';
        div.style.marginTop = '-5px';

        this._setIconStyles(div, 'icon');

        return div;
    }
});

L.arcanumIcon = function icon(options) {
    return new ArcanumIcon(options);
}

var icon = L.arcanumIcon({});

L.tileLayer.arcanum = function(urlTemplate, options) {
    return new L.TileLayer.Arcanum(urlTemplate, options);
}

L.CRS.MySimple = L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(-(250/20), 250, 250/20, 0)
});

var map = L.map('map_canvas', {
    minZoom: 2,
    maxZoom: 4,
    crs: L.CRS.MySimple
});
map.setView([10, 10], 3);
L.tileLayer.arcanum().addTo(map);

for(var i = 0; i < gamearea.length; i++) {
    var data = gamearea[i];
    var x = data[0]/64;
    var lng = x/100;
    var y = data[1]/64;
    var lat = y/100;
    var desc = '('+ Math.floor(x) + 'W, ' + Math.floor(y) +'S)<br/>' + data[5];
    if(data[8].length > 0) {
        desc = desc + '<ul>';
        for(var j = 0; j < data[8].length; j++) {
            desc = desc + '<li><a target="_blank" href="townmap/' + data[8][j] + '.html">' + data[8][j] + '</a></li>';
        }
        desc = desc + '</ul>';
    }

    console.log("x: " + lat, ",y:" + lng);
    L.marker([lat,lng],{
        icon: L.arcanumIcon({
        img: data[4],
        offsetX: data[2],
        offsetY: data[3]
    })})
        .bindPopup(desc)
        .on({
            click: function() {
                this.openPopup();
            }
        })
        .addTo(map);
}

