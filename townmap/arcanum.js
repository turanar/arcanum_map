function load() {
    L.TileLayer.Arcanum = L.TileLayer.extend({
        getTileUrl: function(coord) {
            var tilex=coord.x;
            var tiley=coord.y;

            zoom = coord.z;
            var xoffset = Math.floor((Math.pow(2,zoom) - zoomSize[zoom][0])/2);
            var yoffset = Math.floor((Math.pow(2,zoom) - zoomSize[zoom][1])/2);
            var width = xoffset + zoomSize[zoom][0];
            var height = yoffset + zoomSize[zoom][1];

            zoomSize[6] = [zoomSize[5][0]*2,zoomSize[5][1]*2];
            zoomSize[4] = [zoomSize[5][0]/2,zoomSize[5][1]/2];
            zoomSize[3] = [zoomSize[4][0]/2,zoomSize[4][1]/2];

            if ((tilex < xoffset)||(tilex>= width)||(tiley < yoffset)||(tiley >= (height))) {
                return null;
            }

            var num = (coord.y-yoffset)*zoomSize[zoom][0] + (coord.x-xoffset);
            var image = folder + "/" + coord.z + "/tile-" + num + ".jpg";
            return image;
        },
        getTileSize: function() {
            return L.point(256, 256);
        }
    });

    L.tileLayer.arcanum = function(urlTemplate, options) {
        return new L.TileLayer.Arcanum(urlTemplate, options);
    }

    var map = L.map('map', {
        minZoom: 3,
        maxZoom: 6
    });
    map.setView([0,0], 5);
    L.tileLayer.arcanum().addTo(map);
}