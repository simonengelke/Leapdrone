var webSocket = require('ws'),
    ws = new webSocket('ws://127.0.0.1:6437'),
    five = require('johnny-five'),
    board = new five.Board(),
    SerialPort = require("serialport").SerialPort,
    serialPort = new SerialPort("/dev/cu.usbmodemfd131", {
		baudrate: 57600
	}),
	led, frame, pitch, roll, hand_normal;

	var sensitivity_constant = 300;

	var out = [0, 0, 0];

var socketWrite = function(sensitivity_constant) {
	mvg_avg = [0,0,0];    
    ws.on('message', function(data, flags) {
        frame = JSON.parse(data); 

        if(frame.hands && frame.hands.length > 0) {

        	hand_normal = frame.hands[0].palmNormal;

	     	console.log('Hand Normal: ' + hand_normal); // [roll, thumb_thing, pitch]

	 //    	// Leap Roll: Left is positive 
	 //    	// Leap Pitch: Forward is positive
	 //    	// Leap Thumb on Left => -1
	 		
	    	roll = Math.round(hand_normal[0]*sensitivity_constant + 500);	    	
	    	//if (roll < 10) roll = String("00" + roll);
	    	//else if (roll < 100) roll = String("0" + roll);

	    	// console.log('Roll: ' + roll);

	    	serialPort.write("1" + roll + "\r");

	    	pitch = Math.round(hand_normal[2]*sensitivity_constant + 500);
	    	//if (pitch < 10) pitch = String("00" + pitch);
	    	//else if (pitch < 100) pitch = String("0" + pitch);

	    	// console.log('Pitch: ' + pitch);

	    	serialPort.write("0" + pitch + "\r");

    	} else {
	    	serialPort.write("0500\r");
	    	serialPort.write("1500\r");

    	}
    });
};
    
setTimeout(socketWrite(sensitivity_constant),18);