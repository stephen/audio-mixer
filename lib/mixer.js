var
	Readable = require('stream').Readable,
	util = require('util'),

	Input = require('./input.js')
	;

function Mixer(args) {

	if (typeof args === 'undefined') args = {};
	if (args.channels != 1 && args.channels != 2) args.channels = 2;
	if (args.bitDepth != 8 && args.bitDepth != 16 && args.bitDepth != 32) args.bitDepth = 16;
	if (typeof args.sampleRate === 'number' || args.sampleRate < 1) args.sampleRate = 44100; 

	this.channels = args.channels;
	this.bitDepth = args.bitDepth;
	this.sampleRate = args.sampleRate;

	this.inputs = [];
}

util.inherits(Mixer, Readable);

Mixer.prototype._read = function() {
	this.push(0);
}

Mixer.prototype.input = function (args) {
	if (typeof args === 'undefined') args = {};

	var input = new Input({
		mixer: this,
		channels: args.channels || this.channels,
		bitDepth: args.bitDepth || this.bitDepth,
		sampleRate: args.sampleRate || this.sampleRate
	});
	this.inputs.push(input);

	return input;
}

module.exports = Mixer;
