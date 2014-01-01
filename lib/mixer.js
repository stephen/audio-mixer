var
	Readable = require('stream').Readable,
	util = require('util'),

	Input = require('./input.js')
	;

function Mixer(args) {

	if (typeof args === 'undefined') args = {};
	if (args.channels != 1 && args.channels != 2) args.channels = 2;
	if (typeof args.sampleRate === 'number' || args.sampleRate < 1) args.sampleRate = 44100; 

	this.bitDepth = args.bitDepth;
	if (args.bitDepth == 8) {
		this.readSample = Buffer.readInt8;
		this.writeSample = Buffer.writeInt8;
		this.sampleByteLength = 1;
	}
	else if (args.bitDepth == 32) {
		this.readSample = Buffer.readInt32LE;
		this.writeSample = Buffer.writeInt32LE;
		this.sampleByteLength = 4;
	}
	else {
		args.bitDepth = 16;
		this.readSample = Buffer.readInt16LE;
		this.writeSample = Buffer.writeInt16LE;
		this.sampleByteLength = 2;
	}

	this.channels = args.channels;
	this.sampleRate = args.sampleRate;

	this.inputs = [];
}

util.inherits(Mixer, Readable);

Mixer.prototype._read = function() {

	var samples = 9007199254740992;
	this.inputs.forEach(function (input) {
		var as = input.availSamples();
		if (as < samples) samples = as;
	});
	if (samples > 0) {

		var mixedBuffer = new Buffer(samples * this.sampleByteLength);
		for (var i = 0; i < samples; i++) {
			var mixedSample = 0;
			for (var j = 0; j < this.inputs.length; j++) {
				mixedSample += this.inputs[j].readSample.call(this.inputs[j], i * this.inputs[j].sampleByteLength);
			}
			this.writeSample.call(mixedBuffer, Math.round(mixedSample / this.inputs.length), i * this.sampleByteLength);
		}

		this.push(mixedBuffer);
	}
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
