var watch = require('watchjs').watch;

var Pattern = require('./pattern');
var Layer = require('./layer');

function Beet(opts) {
  this.context = opts.context;
  this.tempo = opts.tempo || 120;
  this.layers = [];
  var self = this;

  watch(this, 'tempo', function () {
    self._change_tempo(self.tempo);
  });
}

Beet.prototype.layer = function (seq, on, off) {
  var layer = new Layer(this.context, this.tempo, seq, on, off);
  return layer;
};

Beet.prototype.pattern = function (pulses, steps) {
  var pattern = new Pattern(pulses, steps);
  return pattern;
};

Beet.prototype.add = function (layer) {
  this.layers.push(layer);
};

Beet.prototype.remove = function (layer) {
  var index = this.layers.indexOf(layer);
  var found = this.layers[index];
  found.metro.stop();
  this.layers.splice(index, 1);
};

Beet.prototype.start = function (when) {
  var self = this;
  var start_time = when || 0;
  setTimeout(function () {
    self.layers.forEach(function (layer) {
      layer.start();
    });
  }, start_time * 1000);
};

Beet.prototype.stop = function (when) {
  var self = this;
  var start_time = when || 0;
  setTimeout(function () {
    self.layers.forEach(function (layer) {
      layer.stop();
    });
  }, start_time * 1000);
};

Beet.prototype.pause = function () {
  this.layers.forEach(function (layer) {
    layer.pause();
  });
};

Beet.prototype._change_tempo = function (value) {
  this.layers.forEach(function (layer) {
    layer.metro.tempo = value;
  });
};

window.Beet = Beet;
module.exports = Beet;