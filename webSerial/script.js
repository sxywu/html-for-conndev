/*
WebSerial example
Reads from a webSerial serial port, and writes to it.
Works on Chrome and Edge and Opera browsers. 

created 28 Jan 2022
by Tom Igoe
*/

// Serial port elements:
let port;               // the serial port
let reader;             // port reader object
let writer;             // port writer object
let keepReading = true; // keeps the listenForSerial loop going
let serialReadPromise;  // Promise for the listenForSerial function

// the DOM elements that might be changed by various functions:
let portButton;   // the open/close port button
let readingsSpan; // DOM element where the incoming readings go
let timeSpan;     // DOM element for one special reading

function setup() {
  // get the DOM elements and assign any listeners needed:
  // user text input:
  const textInput = document.getElementById("txt");
  textInput.addEventListener("keyup", readTextInput);
  // user range input:
  const slider = document.getElementById("dim");
  slider.addEventListener("change", readRangeInput);
  // port open/close button:
  portButton = document.getElementById("portButton");
  portButton.addEventListener("click", openClosePort);
  // span for incoming serial messages:
  readingsSpan = document.getElementById("readings");
  // span for incoming serial messages:
  timeSpan = document.getElementById("seconds");
}

async function openClosePort() {
  // if the browser supports serial:
  if ("serial" in navigator) {
    // if the port exists, it's likely open. Close it:
    if (port) {
      // set keepReading false to stop the listenForSerial loop:
      keepReading = false;
      // stop the reader, so you can close the port:
      reader.cancel();
      // wait for the listenForSerial function to stop:
      await serialReadPromise;
      // close the serial port itself:
      await port.close();
      // change the button label:
      portButton.innerHTML = "open port";
      // clear the port variable:
      port = null;
    } else {
      // if the port is null, try to open it:
      try {
        // pop up window to select port:
        port = await navigator.serial.requestPort();
        // set port settings and open it:
        await port.open({ baudRate: 9600 });
        // enable the listenForSerial loop:
        keepReading = true;
        // start the listenForSerial function:
        serialReadPromise = listenForSerial();
        // change the button label:
        portButton.innerHTML = "Close port";
      } catch (err) {
        // if there's an error opening the port:
        console.error("There was an error opening the serial port:", err);
      }
    }
  }
}

function readTextInput(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  if (event.keyCode != 13) {
    return;
  }
  // if you do get an enter keyCode, send the value of the field
  // out the serial port:
  sendData(event.target.value);
}

function readRangeInput(event) {
  // send the range input's value out the serial port:
  sendData(event.target.value);
}

async function sendData(data) {
  // if the port's open and readable:
  if (port) {
    if (port.readable) {
      // initialize the writer:
      writer = port.writable.getWriter();
      // convert the data to be sent to an array:
      var output = new TextEncoder().encode(data);
      // send it, then release the writer:
      writer.write(output).then(writer.releaseLock());
    }
  }
}

async function listenForSerial() {
  // while the port is open and keepReading is true:
  while (port.readable && keepReading) {
    // initialize the reader:
    reader = port.readable.getReader();
    try {
      // read incoming serial buffer:
      const { value, done } = await reader.read();
      // convert the input to a text string:
      let inString = new TextDecoder().decode(value);
      // Put the string in a span:
      readingsSpan.innerHTML = inString;
      // if it's not JSON, you can skip to the catch below.
      // if it's JSON, parse it:
      let jsonInput = JSON.parse(inString);
      // if you've got a valid object with the property you want:
      if (jsonInput.secs) {
        // put it in the time span element of the DOM:
        timeSpan.innerHTML = jsonInput.secs;
      }
    } catch (error) {
      // if there's an error reading the port:
      console.log(error);
    } finally {
      // once the read is done, release the reader.
      // this enables other functions to run port.close():
      reader.releaseLock();
    }
  }
}

// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);