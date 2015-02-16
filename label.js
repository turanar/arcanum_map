// MarkerWithLabel inherits from <code>Marker</code>:
// Define the overlay, derived from google.maps.OverlayView
function Label(marker, opt_options) {
     this.marker_ = marker;
     this.handCursorURL_ = marker.handCursorURL;
     
     // Initialization
     this.setValues(opt_options);
     var labelColor = opt_options.labelColor || "#ffffff";
     var offsetX = opt_options.labelOffsetX || 0;
     var offsetY = opt_options.labelOffsetY || 0;
     offsetX += 10;
     offsetY -= 10;
     this.set('offsetX',offsetX);
     this.set('offsetY',offsetY);
     
     // Here go the label styles
     var span = this.span_ = document.createElement('img');
     span.style.cssText = 'position: relative;';
     var div = this.div_ = document.createElement('div');
     div.appendChild(span);
     div.style.cssText = 'position: absolute; display: none;';
};

Label.prototype = new google.maps.OverlayView;
 
Label.prototype.onAdd = function() {
     var pane = this.getPanes().overlayImage;
     pane.appendChild(this.div_);

    google.maps.event.addDomListener(this.span_, "mouseover", function (e) {
      if (me.marker_.getDraggable() || me.marker_.getClickable()) {
        this.style.cursor = "pointer";
        google.maps.event.trigger(me.marker_, "mouseover", e);
      }
    });
    google.maps.event.addDomListener(this.span_, "mouseout", function (e) {
      if ((me.marker_.getDraggable() || me.marker_.getClickable())) {
        this.style.cursor = me.marker_.getCursor();
        google.maps.event.trigger(me.marker_, "mouseout", e);
      }
    });
    google.maps.event.addDomListener(this.span_, "click", function (e) {
      if (me.marker_.getDraggable() || me.marker_.getClickable()) {
          google.maps.event.trigger(me.marker_, "click", e);
          e.preventDefault();
      }
    });    
      
     // Ensures the label is redrawn if the text or position is changed.
     var me = this;
     this.listeners_ = [
          google.maps.event.addListener(this, 'position_changed',
               function() { me.draw(); }),
          google.maps.event.addListener(this, 'text_changed',
               function() { me.draw(); }),
          google.maps.event.addListener(this, 'zindex_changed',
               function() { me.draw(); })
     ];
};
 
// Implement onRemove
Label.prototype.onRemove = function() {
     this.div_.parentNode.removeChild(this.div_);
 
     // Label is removed from the map, stop updating its position/text.
     for (var i = 0, I = this.listeners_.length; i < I; ++i) {
          google.maps.event.removeListener(this.listeners_[i]);
     }
};
 
// Implement draw
Label.prototype.draw = function() {
     var projection = this.getProjection();
     var position = projection.fromLatLngToDivPixel(this.get('position'));
     var div = this.div_;
     var offsetX = this.get('offsetX');
     var offsetY = this.get('offsetY');
     div.style.left = (position.x + offsetX) + 'px';
     div.style.top = (position.y + offsetY) + 'px';
     div.style.display = 'block';
     div.style.zIndex = this.get('zIndex'); //ALLOW LABEL TO OVERLAY MARKER
     
     this.span_.src = 'labels/' + this.get('text').toString() + '.png';
     this.span_.alt = this.get('text').toString();
};

function MarkerWithLabel() {}

function MarkerWithLabel(opt_options) {
  opt_options = opt_options || {};
  opt_options.labelContent = opt_options.labelContent || "";
  
  this.label = new Label(this, opt_options);
  this.label.set('zIndex', 1234);
  this.label.bindTo('position', this, 'position');
  this.label.set('text', opt_options.labelContent);
  this.label.set('note', opt_options.labelNote || false)  
  google.maps.Marker.apply(this, arguments);
}

MarkerWithLabel.prototype = new google.maps.Marker();

/**
 * Overrides the standard Marker setMap function.
 * @param {Map} marker The map to which the marker is to be added.
 * @private
 */
MarkerWithLabel.prototype.setMap = function (theMap) {
  // Call the inherited function...
  google.maps.Marker.prototype.setMap.apply(this, arguments);
  // ... then deal with the label:
  this.label.setMap(theMap);
};