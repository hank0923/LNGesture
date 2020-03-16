// A $( document ).ready() block.

console.log("ready!");


const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
var trackButton = document.getElementById("trackbutton");
// let nextImageButton = document.getElementById("nextimagebutton");
var updateNote = document.getElementById("updatenote");
var voiceNote = document.getElementById("voiceInput");
var voiceSection = document.getElementById("voiceSection");
// let iconVoice = document.getElementById("iconVoice");
var helpSection = document.getElementById("helpSection");

var imgindex = 1
var isVideo = false;

const modelParams = {
      flipHorizontal: true, // flip e.g for video  
      maxNumBoxes: 1, // maximum number of boxes to detect
      iouThreshold: 0.2, // ioU threshold for non-max suppression
      scoreThreshold: 0.7, // confidence threshold for predictions.
      imageScaleFactor: 0.7,
}


// var model 
// handTrack.load(modelParams).then(lmodel => {
//             // detect objects in the image.
//             // console.log(lmodel)
//             model = lmodel;
//             // updateNote.innerText = "Start Mode";
//             runDetectionImage(handimg);
//             // trackButton.disabled = false;
//             isLoaded = true;
//             // nextImageButton.disabled = false
//       });
// var isLoaded = false

video.width = 200;
video.height = 125;


updateNote.innerText = "Start Guesture Mode"
voiceNote.innerHTML = "<span style='font-style:italic; color: #666'>Say 'help' to view voice commands</span>"
var helptext = '<span style="padding: 12px 24px;">Say <b>"Exit"</b> to leave mode</span> <span>|</span> <span style="padding: 12px 24px;">Say <b>"Hand control"</b> to activate hand guesture</span><span>|</span> <span style="padding: 12px 24px;">Say <b>"Hide"</b> to hide help</span>'
helpSection.innerHTML = helptext;


function loadVideo() {
            // Load the model.
      handTrack.load(modelParams).then(lmodel => {
            // detect objects in the image.
            // console.log(lmodel)
            model = lmodel;
            // updateNote.innerText = "Start Mode";
            runDetectionImage(handimg);
            // trackButton.disabled = false;
            isLoaded = true;
            // nextImageButton.disabled = false
      });

}


function runDetection() {
      // console.log(isLoaded,'isLoaded')
  
handTrack.load(modelParams).then(lmodel => {
            // detect objects in the image.
            // console.log(lmodel)
           var model = lmodel;
            // updateNote.innerText = "Start Mode";

            // runDetectionImage(handimg);
            model.detect(handimg).then(predictions => {
            // console.log("Predictions: ", predictions);
                  model.renderPredictions(predictions, canvas, context, handimg);
            });
            model.detect(video).then(predictions => {

                  model.renderPredictions(predictions, canvas, context, video);

                  if (predictions[0]) {

                        let score = predictions[0].score;
                        // console.log(score)
                        // if (score >= 0.9){              
                        let midvalX = (predictions[0].bbox[2] / 2) + predictions[0].bbox[0];
                        let midvalY = (predictions[0].bbox[3] / 2) + predictions[0].bbox[1];

                        cursorx = windowWidth * (midvalX / video.width)
                        cursory = windowHeight * (midvalY / video.height)

                        // moveCursor(cursorx, cursory);
                        if (guestureActivate) {
                              scrollPage(predictions);
                        }


                        // triggerMouseHover(cursorx, cursory);

                        var area = predictions[0].bbox[2] * predictions[0].bbox[3];
                        areaArray.push(area);
                        // compareArea(predictions);

                  } else {
                        ElementCursor.setCursor('fake');
                        ElementCursor.activeCursor();
                  }



                  if (isVideo) {
                        requestAnimationFrame(runDetection);
                  }
            });
            // trackButton.disabled = false;
            // nextImageButton.disabled = false
      });
            
         
}

function startVideo() {

      handTrack.startVideo(video).then(function(status) {
            console.log("video started", status);
            if (status) {
                  // updateNote.innerText = "Video started. Now tracking"
                  isVideo = true;
                  runDetection()
            } else {
                  // updateNote.innerText = "Please enable video"
            }
      });
}

function toggleVideo() {
    
            // updateNote.innerText = "Starting video"
            // loadVideo();
            startVoice();
            $('#exampleModal').modal('hide')
            $('#voiceSection').removeClass('hidden').addClass('fadeInDown');
     
}

var guestureActivate = false;

function startVoice() {
      const artyom = new Artyom();
      // This function activates artyom and will listen and execute only 1 command (for http connections)
      function startOneCommandArtyom() {
            artyom.fatality(); // use this to stop any of

            setTimeout(function() { // if you use artyom.fatality , wait 250 ms to initialize again.
                  artyom.initialize({
                        lang: "en-GB", // A lot of languages are supported. Read the docs !
                        continuous: true, // recognize 1 command and stop listening !
                        listen: true, // Start recognizing
                        debug: true, // Show everything in the console
                        speed: 1, // talk normally
                  }).then(function() {
                        console.log("Ready to work !");
                  });
            }, 250);
      }

      startOneCommandArtyom();
      // Add a single command
      var commandActive = [{
            indexes: ["hand control"], // These spoken words will trigger the execution of the command,
            action: function() { // Action to be executed when a index match with spoken word
                  startVideo()
                  $('#canvas').removeClass('hidden');
                  $('#helpSection').removeClass('hidden')
                  guestureActivate = true;
                  helpSection.innerHTML = '<span style="padding: 12px 24px;">Move your hand up or down to scroll.</span><span>|</span> <span style="padding: 12px 24px;">Say <b>"Close"</b> to stop.</span>'
                  console.log('guestureActivate:', guestureActivate)
            }
      }, {
            indexes: ["close"], // These spoken words will trigger the execution of the command
            action: function() { // Action to be executed when a index match with spoken word
                  // artyom.say("Hey buddy ! How are you today?");
                  guestureActivate = false;
                  helpSection.innerHTML = helptext;
                  $('#canvas').addClass('hidden');
                  handTrack.stopVideo();
                  console.log('guestureActivate:', guestureActivate)
            }
      }, {
            indexes: ["help"], // These spoken words will trigger the execution of the command
            action: function() { // Action to be executed when a index match with spoken word
                  $('#helpSection').removeClass('hidden')
            }
      }, {
            indexes: ["hide"], // These spoken words will trigger the execution of the command
            action: function() { // Action to be executed when a index match with spoken word
                  $('#helpSection').addClass('hidden')
            }
      }, {
            indexes: ["exit"], // These spoken words will trigger the execution of the command
            action: function() { // Action to be executed when a index match with spoken word
                  stop();
            }
      }]

      artyom.addCommands(commandActive);

      artyom.redirectRecognizedTextOutput(function(recognized, isFinal) {
            if (isFinal) {
                  voiceNote.innerHTML = recognized;
                  console.log("Final recognized text: " + recognized);
            } else {
                  voiceNote.innerHTML = "<span style='font-style:italic; color: #666'>Analyzing...</span>"
                  console.log(recognized);
            }
      });

      function stop() {
            artyom.fatality().then(() => {
                  console.log("Artyom succesfully stopped !");
            });
            $('#helpSection').addClass('hidden')
            $('#voiceSection').addClass('hidden')
            voiceNote.innerHTML = "<span style='font-style:italic; color: #666'>Say 'help' to view voice commands</span>"
            handTrack.stopVideo(video)
            isVideo = false;
      }

}

function stop() {
      artyom.fatality().then(() => {
            console.log("Artyom succesfully stopped !");
      });
      $('#helpSection').addClass('hidden')
      $('#voiceSection').addClass('hidden')
      $('#canvas').addClass('hidden');
      voiceNote.innerHTML = "<span style='font-style:italic; color: #666'>Say 'help' to view voice commands</span>"
      handTrack.stopVideo(video)
      isVideo = false;
}

// artyom.fatality().then(() => {
//       console.log("Artyom succesfully stopped !");
// });


// nextImageButton.addEventListener("click", function() {
//       nextImage();
// });

trackButton.addEventListener("click", function() {
      toggleVideo();
});

function nextImage() {

      imgindex++;
      handimg.src = "images/" + imgindex % 15 + ".jpg"
      // alert(handimg.src)
      runDetectionImage(handimg)
}


windowHeight = $(document).height();
windowWidth = document.body.clientWidth;


areaArray = [];


var fist_pos_old

function scrollPage(coords) {

      if (coords) {

            var coord = coords[0].bbox;
            // console.log(coord)
            /* Rescale coordinates from detector to video coordinate space: */
            // coord[0] *= video.width / windowWidth;
            // coord[1] *= video.height / windowHeight;
            // coord[2] *= video.width / windowWidth;
            // coord[3] *= video.height / windowHeight;

            /* Find coordinates with maximum confidence: */
            // var coord = coords[0];
            // for (var i = coords.length - 1; i >= 0; --i)
            // if (coords[i][4] > coord[4]) coord = coords[i];

            /* Scroll window: */
            var fist_pos = [coord[0] + coord[2] / 2, coord[1] + coord[3] / 2];
            if (fist_pos_old) {
                  var dx = (fist_pos[0] - fist_pos_old[0]) / video.width,
                        dy = (fist_pos[1] - fist_pos_old[1]) / video.height;
                  // console.log(fist_pos,fist_pos_old,dx, dy)

                  if (dy < 0) { console.log('up'); }
                  if (dy >= 0) { console.log('down') }
                  window.scrollBy(dx * 250, dy * 250);
                  fist_pos = fist_pos_old;

            } else { fist_pos_old = fist_pos; }

      } else { fist_pos_old = null; }
}

function triggerMouseHover(x, y) {
      var el = document.elementFromPoint(x, y);
      if (el) {
            console.log('tagName:', el.tagName)
            if (el.tagName == 'BUTTON' || el.tagName == 'A') {
                  simulate(el, 'mouseover')
                  el.addEventListener('mouseover', function() {
                        $(el).addClass('fakehover');
                  });

            }
      }
}

var isClosed = false;
var isSwitched = false;

function compareArea(predictions) {
      shrinkPrecentage = (areaArray[areaArray.length - 1] - areaArray[0]) / areaArray[areaArray.length - 1];

      //on
      // if(!isSwitched){
      //     if (shrinkPrecentage <= -0.5) {
      //           $('#' + ElementCursor.cursorElement).css({
      //                 'background': 'green',
      //           });
      //           isClosed = true;
      //     } 

      //     if((shrinkPrecentage >= -0.2) && isClosed){
      //         $('#' + ElementCursor.cursorElement).css({
      //                 'background': 'red',
      //             });
      //         isClosed = false;
      //         isSwitched = true;
      //         console.log('actve')
      //         areaArray = [];
      //     }
      // }

      // //off
      // if(isSwitched){
      //     scrollPage(predictions);
      //     if (shrinkPrecentage <= -0.5) {
      //           $('#' + ElementCursor.cursorElement).css({
      //                 'background': 'green',
      //           });
      //           isClosed = true;
      //     } 
      //     if((shrinkPrecentage >= -0.2) && isClosed){
      //         $('#' + ElementCursor.cursorElement).css({
      //                 'background': 'red',
      //             });
      //         isClosed = false;
      //         isSwitched = false;
      //         console.log('inactive')
      //         areaArray = [];
      //     }
      // }








      // if (shrinkPrecentage <= -0.4 && isSwitched) {
      //       $('#' + ElementCursor.cursorElement).css({
      //             'background': 'green',
      //       });
      //        scrollPage(predictions);
      //       isSwitched = true;
      // } else if(shrinkPrecentage <= -0.4 && !isSwitched) {
      //       $('#' + ElementCursor.cursorElement).css({
      //             'background': 'green',
      //       });
      //        scrollPage(predictions);
      // } else if(shrinkPrecentage >= -0.2 && isSwitched) {
      //       $('#' + ElementCursor.cursorElement).css({
      //             'background': 'red',
      //       });
      //      isSwitched = false;
      //      areaArray = [];
      // } else if(shrinkPrecentage >= -0.2 && !isSwitched) {
      //       $('#' + ElementCursor.cursorElement).css({
      //             'background': 'red',
      //       });
      // } 

}

function fakeClick() {
      console.log('fake click')
}

function runDetectionImage(img) {
      model.detect(img).then(predictions => {
            // console.log("Predictions: ", predictions);
            model.renderPredictions(predictions, canvas, context, img);
      });
}


var scale_factor = 1;
var mouseX, mouseY;

function moveCursor(x, y) {

      mouseX = x * scale_factor;
      mouseY = y * scale_factor;

      ElementCursor.setCursor('fake');
      ElementCursor.updateCursor(mouseX, mouseY);

}




var ElementCursor = {
      cursorElement: "",
      setCursor: function(cursorId) {
            ElementCursor.cursorElement = cursorId;
      },
      removeCursor: function() {
            $('html').css({
                  'cursor': ''
            });
            ElementCursor.cursorElement = '';
      },
      updateCursor: function(x, y) {
            // $(document).mousemove(function (e) {
            $('#' + ElementCursor.cursorElement).css({
                  'position': 'fixed',
                  'user-select': 'none',
                  'top': y + 2 + 'px',
                  'left': x + 2 + 'px',
                  'transition': 'all linear 0.1s'
            });
      },
      activeCursor: function() {
            $('#' + ElementCursor.cursorElement).css({
                  'background': 'red',
            });
      }
};



//=======================================================

function simulate(element, eventName) {
      var options = extend(defaultOptions, arguments[2] || {});
      var oEvent, eventType = null;
      console.log('event fire:', element, eventName)

      for (var name in eventMatchers) {
            if (eventMatchers[name].test(eventName)) { eventType = name; break; }
      }

      if (!eventType)
            throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

      if (document.createEvent) {
            oEvent = document.createEvent(eventType);
            if (eventType == 'HTMLEvents') {
                  oEvent.initEvent(eventName, options.bubbles, options.cancelable);
            } else {
                  oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                        options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                        options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
            }
            element.dispatchEvent(oEvent);
      } else {
            options.clientX = options.pointerX;
            options.clientY = options.pointerY;
            var evt = document.createEventObject();
            oEvent = extend(evt, options);
            element.fireEvent('on' + eventName, oEvent);
      }
      return element;
}

function extend(destination, source) {
      for (var property in source)
            destination[property] = source[property];
      return destination;
}

var eventMatchers = {
      'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
      'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true
}
//=======================================================