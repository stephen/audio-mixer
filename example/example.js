var
	fs = require('fs'),
	Speaker = require('speaker'),

	Mixer = require('../index.js'),

	lame = require('lame')
	;

/*
 * Create the mixer and stream to speaker:
 */

var mixer = new Mixer({
	channels: 1
});

var speaker = new Speaker({
	channels: 1,
	bitDepth: 16,
	sampleRate: 44100
});

mixer.pipe(speaker);

/*
 * Decode mp3 and add the stream as mixer input:
 */

var file0 = fs.createReadStream(__dirname + '/example0.mp3');

var decoder0 = new lame.Decoder();
var mp3stream0 = file0.pipe(decoder0);

decoder0.on('format', function (format) {
	console.log(format);

	mp3stream0.pipe(mixer.input({
		sampleRate: format.sampleRate,
		channels: format.channels,
		bitDepth: format.bitDepth
	}));

});

/*
 * Decode mp3 and add the stream as mixer input:
 */

var file1 = fs.createReadStream(__dirname + '/example1.mp3');

var decoder1 = new lame.Decoder();
var mp3stream1 = file1.pipe(decoder1);

decoder1.on('format', function (format) {
	console.log(format);

	mp3stream1.pipe(mixer.input({
		sampleRate: format.sampleRate,
		channels: format.channels,
		bitDepth: format.bitDepth
	}));

});


