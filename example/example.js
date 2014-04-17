var
	fs = require('fs'),
	Speaker = require('speaker'),
	keypress = require('keypress'),
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

	input2 = mixer.input({
		sampleRate: format.sampleRate,
		channels: format.channels,
		bitDepth: format.bitDepth
	});
	mp3stream0.pipe(input2);

});

/*
 * Decode mp3 and add the stream as mixer input:
 */

var file1 = fs.createReadStream(__dirname + '/example1.mp3');

var decoder1 = new lame.Decoder();
var mp3stream1 = file1.pipe(decoder1);

decoder1.on('format', function (format) {
	console.log(format);
	input1 = mixer.input({
		sampleRate: format.sampleRate,
		channels: format.channels,
		bitDepth: format.bitDepth
	});
	mp3stream1.pipe(input1);

});

// volume control test

keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  if (key.name == 'up') {
  	input1.setVolume(input1.getVolume() + 1);
  	process.stdout.write('\rvolume1 is now: \t' + input1.getVolume() + ' & volume2 is now: \t' + input2.getVolume());
  } else if (key.name == 'down') {
  	input1.setVolume(input1.getVolume() - 1);
  	process.stdout.write('\rvolume1 is now: \t' + input1.getVolume() + ' & volume2 is now: \t' + input2.getVolume());
  } else if (key.name == 'right') {
  	input2.setVolume(input2.getVolume() + 1);
  	process.stdout.write('\rvolume1 is now: \t' + input1.getVolume() + ' & volume2 is now: \t' + input2.getVolume());
  } else if (key.name == 'left') {
  	input2.setVolume(input2.getVolume() - 1);
  	process.stdout.write('\rvolume1 is now: \t' + input1.getVolume() + ' & volume2 is now: \t' + input2.getVolume());
  } else if (key && key.ctrl && key.name == 'c') {
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

