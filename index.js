const rows = document.querySelector(".sequencer").children;
 
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const kick = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/kick.mp3"),
    clap = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/clap.mp3"),
    hihat = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/hihat.mp3"),
    rim = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/rim.mp3"),
    Q = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/Q.mp3"),
    W = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/W.mp3"),
    E = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/E.mp3"),
    R = new Audio("https://raw.githubusercontent.com/kucerajacob/DRUM-SEQUENCER/master/audio/R.mp3");
 
const item = document.querySelectorAll(".sample");
 
// Checkbox toggle functionality
item.forEach(function (el) {
    el.onclick = function () {
        if (el.classList.contains("item-selected")) {
            el.classList.remove("item-selected");
        } else {
            el.classList.add("item-selected");
        }
    }
});
 
// Clear button functionality
document.getElementById("clear-track").onclick = function () {
    [].forEach.call(item, function (el) {
        el.classList.remove("item-selected");
    });
}
 
// Sample pad key press functionality
document.onkeydown = function (e) {
    e = e || window.event;
 
    switch (e.key) {
        case "q":
            playSound(Q);
            document.getElementById("sampler1").classList.add("pressed");
            break;
        case "w":
            playSound(W);
            document.getElementById("sampler2").classList.add("pressed");
            break;
        case "e":
            playSound(E);
            document.getElementById("sampler3").classList.add("pressed");
            break;
        case "r":
            playSound(R);
            document.getElementById("sampler4").classList.add("pressed");
            break;    
    }
}
 
document.onkeyup = function (e) {
    e = e || window.event;
 
    switch (e.key) {
        case "q":
            document.getElementById("sampler1").classList.remove("pressed");
            break;
        case "w":
            document.getElementById("sampler2").classList.remove("pressed");
            break;
        case "e":
            document.getElementById("sampler3").classList.remove("pressed");
            break;
        case "r":
            document.getElementById("sampler4").classList.remove("pressed");
            break;    
    }
}
 
// BPM slider
const bpmSlider = document.getElementById("bpm-slider");
const bpmText = document.getElementById("bpm");
var T0 = parseInt(((60 / bpmSlider.value) * 1000) / 4);
var maxShift = T0/2;
 
bpmText.innerHTML = bpmSlider.value + " BPM";
 
bpmSlider.oninput = function () {
    bpmText.innerHTML = this.value + " BPM";
    T0 = parseInt(((60 / bpmSlider.value) * 1000) / 4);
    maxShift = T0/2;
}
 
// SHIFT slider
const shiftSlider = document.getElementById("shift-slider");
const shiftText = document.getElementById("shift");
var shift = 0;

const claps = Array.from(document.getElementsByClassName("clap"))
 
shiftText.innerHTML = "off"
shiftSlider.oninput = function() {
  shift = parseFloat(shiftSlider.value);
 
  if (this.value == 0) {
    shiftText.innerHTML = "off"
 
    for (var k = 0; k < claps.length; k++) {
        claps[k].style.width="100%";

    }
    
  } else {
    shiftText.innerHTML = this.value;

    for (var k = 0; k < claps.length; k++) {
        claps[k].style.width=100*(1-0.5*shift/10)+"%";
    }

  }
}
 
function playSound(audio, offset=0) {
    const source = audioContext.createBufferSource();
    source.buffer = audio.buffer;
    source.connect(audioContext.destination);
    source.start(audioContext.currentTime + offset/1000);
}
 
function highlightRow(i) {
    document.querySelector(".d" + (i + 1)).childNodes[1].classList.add("row-highlight");
    document.querySelector(".d" + (i + 1)).childNodes[3].classList.add("row-highlight");
    document.querySelector(".d" + (i + 1)).childNodes[5].classList.add("row-highlight");
    document.querySelector(".d" + (i + 1)).childNodes[7].classList.add("row-highlight");
 
    if (i > 0) {
        document.querySelector(".d" + i).childNodes[1].classList.remove("row-highlight");
        document.querySelector(".d" + i).childNodes[3].classList.remove("row-highlight");
        document.querySelector(".d" + i).childNodes[5].classList.remove("row-highlight");
        document.querySelector(".d" + i).childNodes[7].classList.remove("row-highlight");
    } else {
        document.querySelector(".d16").childNodes[1].classList.remove("row-highlight");
        document.querySelector(".d16").childNodes[3].classList.remove("row-highlight");
        document.querySelector(".d16").childNodes[5].classList.remove("row-highlight");
        document.querySelector(".d16").childNodes[7].classList.remove("row-highlight");
    }
}
 
function scheduleSounds(currentRow, currentTime) {
    document.querySelectorAll(".d" + (currentRow + 1)).forEach(function (bruh) {
        if (bruh.childNodes[1].classList.contains("row-highlight") && bruh.childNodes[1].classList.contains("item-selected")) {
            playSound(kick);
        }
 
        if (bruh.childNodes[3].classList.contains("row-highlight") && bruh.childNodes[3].classList.contains("item-selected")) {
            playSound(clap, offset=shift/10 * maxShift);
        }
 
        if (bruh.childNodes[5].classList.contains("row-highlight") && bruh.childNodes[5].classList.contains("item-selected")) {
            playSound(hihat);
        }
 
        if (bruh.childNodes[7].classList.contains("row-highlight") && bruh.childNodes[7].classList.contains("item-selected")) {
            playSound(rim);
        }
    });
}
 
var currentTime = audioContext.currentTime;
let currentRow = 0;
 
function loop() {
    highlightRow(currentRow);
    scheduleSounds(currentRow, currentTime);
 
    let interval = T0 / 1000;
 
    if (shift !== 0) {

        

    }
 
    currentTime += interval;
    currentRow = (currentRow + 1) % rows.length;
 
    setTimeout(loop, interval * 1000);
}
 
// Convert audio to buffer for scheduling
function convertToBuffer(audioElement, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', audioElement.src, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        audioContext.decodeAudioData(request.response, function (buffer) {
            audioElement.buffer = buffer;
            if (callback) callback();
        });
    }
    request.send();
}
 
// Load all audio buffers
function loadAllBuffers(callback) {
    let loadedCount = 0;
    const audioElements = [kick, clap, hihat, rim, Q, W, E, R];
    audioElements.forEach(audio => {
        convertToBuffer(audio, () => {
            loadedCount++;
            if (loadedCount === audioElements.length) {
                callback();
            }
        });
    });
}

// Start the loop after all buffers are loaded
loadAllBuffers(loop);
