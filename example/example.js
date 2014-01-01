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

var file = fs.createReadStream('example0.mp3');

var decoder = new lame.Decoder();
var mp3stream = file.pipe(decoder);

decoder.on('format', function (format) {
	console.log(format);

	mp3stream.pipe(mixer.input({
		sampleRate: format.sampleRate,
		channels: format.channels,
		bitDepth: format.bitDepth
	}));

});


