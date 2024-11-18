"use strict";

// Some preset audio files
const soundData = [
  { "label": "Mute", "url": "" },
  { "label": "Shatter", "url": "sounds/shatter.mp3" },
  { "label": "Alarm", "url": "sounds/alarm.mp3" },
  { "label": "Meet", "url": "sounds/meet.mp3" },
  { "label": "Metal Pipes", "url": "sounds/metalpipe.mp3" },
  { "label": "Vine Boom", "url": "sounds/vineboom.mp3" },
  { "label": "Water Drop", "url": "sounds/waterdrop.mp3" },
  { "label": "Zoom Join", "url": "sounds/zoom.mp3" },
  { "label": "Alice in Borderland", "url": "sounds/aib.mp3" },
  { "label": "Discord", "url": "sounds/discord.mp3" },
  { "label": "Jeopardy", "url": "sounds/jeopardy.mp3" },
  { "label": "Ding", "url": "sounds/ding.mp3" },
  { "label": "Toi", "url": "sounds/toi.mp3" },
  { "label": "Sus", "url": "sounds/sus.mp3" }
];

const icons = [
  "assets/legion_wealth.webp",
  "assets/legion_exp.webp",
  "assets/legion_luck.webp",
  "assets/exp.webp",
  "assets/drop.webp",
  "assets/wap.webp",
  "assets/swap.png",
  "assets/scwap.png",
  "assets/goldpot.png",
  "assets/hs.png",
  "assets/dice.png",
  "assets/vip.png",
  "assets/mvp.webp",
  "assets/bossmvp.png",
  "assets/mugongmvp.png",
  "assets/ozmvp.png",
  "assets/selfmvp.png",
  "assets/paidmvp.png",
  "assets/mapmvp.png",
  "assets/mapmugong.png",
  "assets/threads.webp",
  "assets/frenzy.png",
  "assets/erdafountain.png",
  "assets/janusdawn.png"
];

const timerData = [
  { "duration":  600, "title": "Legion Wealth", "icon": "assets/legion_wealth.webp" },
  { "duration": 1200, "title": "Legion Wealth", "icon": "assets/legion_wealth.webp" },
  { "duration": 1800, "title": "Legion Wealth", "icon": "assets/legion_wealth.webp" },
  { "duration":  600, "title": "Legion Exp", "icon": "assets/legion_exp.webp" },
  { "duration": 1200, "title": "Legion Exp", "icon": "assets/legion_exp.webp" },
  { "duration": 1800, "title": "Legion Exp", "icon": "assets/legion_exp.webp" },
  { "duration":  600, "title": "Legion Luck", "icon": "assets/legion_luck.webp" },
  { "duration": 1200, "title": "Legion Luck", "icon": "assets/legion_luck.webp" },
  { "duration": 1800, "title": "Legion Luck", "icon": "assets/legion_luck.webp" },
  { "duration":  900, "title": "Exp Coupon", "icon": "assets/exp.webp" },
  { "duration": 1800, "title": "Exp Coupon", "icon": "assets/exp.webp" },
  { "duration": 3600, "title": "Exp Coupon", "icon": "assets/exp.webp" },
  { "duration": 7200, "title": "WAP", "icon": "assets/wap.webp" },
  { "duration": 1800, "title": "MVP", "icon": "assets/mvp.webp" }
];

const toast = (text) => {
  Toastify({
    text,
    duration: 6500,
    gravity: "top",
    position: "left",
    style: {
      background: "BlueViolet",
    }
  }).showToast();
};

// === Information ===

const infoHover = document.getElementById('info');
const infoPage = document.getElementById('infoPage');

infoHover.onmouseenter = () => infoPage.style.display = 'block';
infoHover.onmouseleave = () => infoPage.style.display = '';

// === Audio ===

const volume = document.getElementById('vol');
const audioButton = document.getElementById('soundButton');
const soundSelect = document.getElementById('soundselect');
const soundurl = document.getElementById('soundurl');

const savedVolume = localStorage.getItem('volume');
const savedSound = localStorage.getItem('sound');

// Global audio for reference
const timerAudio = new Audio(savedSound);
soundurl.value = savedSound;

// Set initial volume
if (savedVolume === null) {
  timerAudio.volume = 0.2;
  volume.value = 20;
  localStorage.setItem('volume', timerAudio.volume);
} else {
  timerAudio.volume = savedVolume;
  volume.value = savedVolume * 100;
}

// Set default sound
if (savedSound === null) {
  soundSelect.value = 1;
  timerAudio.src = 'sounds/shatter.mp3';
}

// Volume Slider
volume.oninput = () => {
  timerAudio.volume = volume.value / 100;
  localStorage.setItem('volume', timerAudio.volume);
}

// Load sound file from link and show toast on failure
const failedToast = {
  text: 'Invalid URL',
  duration: 1500,
  gravity: "bottom", position: "center",
  style: { background: "Maroon" }
};

audioButton.onclick = () => {
  timerAudio.src = soundurl.value;
  timerAudio.play()
    .then(e => localStorage.setItem('sound', soundurl.value))
    .catch(e => Toastify(failedToast).showToast());
};


// Add options to sound select screen
for (let i = 0; i < soundData.length; i++) {
  const option = document.createElement("option");
  const text = document.createTextNode(soundData[i].label);
  option.setAttribute("value", i);
  option.appendChild(text);
  soundSelect.appendChild(option);

  // Default option if it was saved
  if (savedSound === soundData[i].url) soundSelect.value = i;
}

soundSelect.onchange = (e) => {
  const i = e.target.value;
  const url = soundData[i].url;
  timerAudio.src = url;
  timerAudio.play();
  localStorage.setItem('sound', url);
};

// === Icons ===

let selectedIcon = -1;

const iconsDisplay = document.getElementById('icons');
const iconsLabel = document.getElementById('iconsLabel');

// Element of icons listed above
const iconElements = [];

for (let i = 0; i < icons.length; i++) {
  const icon = icons[i];

  const iconDiv = document.createElement("div");
  const iconImage = document.createElement("img");

  iconDiv.className = "inline";
  iconImage.src = icon;

  // Select icon with at most one icon selected
  iconDiv.onclick = () => {
    if (selectedIcon === i) {
      // Deselect current selected icon
      iconDiv.style.border = '';
      selectedIcon = -1;
    } else if (selectedIcon === -1) {
      iconDiv.style.border = '3px solid yellow';
      selectedIcon = i;
    } else {
      iconDiv.style.border = '3px solid yellow';
      iconElements[selectedIcon].style.border = '';
      selectedIcon = i;
    }
  };

  iconDiv.appendChild(iconImage);
  iconsDisplay.appendChild(iconDiv);
  iconElements.push(iconDiv);
}

// ON/OFF toggle for displaying icons
iconsLabel.onclick = () => {
  if (iconsLabel.innerText === 'Icons (-)') {
    iconsLabel.innerText = 'Icons (+)';
    iconsDisplay.style.display = 'none';
  } else {
    iconsLabel.innerText = 'Icons (-)';
    iconsDisplay.style.display = '';
  }
};

// === Timers ===

const audioLoopDelay = 5;

const timersList = document.getElementById("timers");
const activeTimers = document.getElementById("active-timers");

const startTimer = (seconds, icon, title = null, loop = false, repeat = false, sound = 'sounds/shatter.mp3', volume = 0.2, hourMinute = null, hourSecond = null) => {
  if (!seconds || seconds <= 0) return;
  if (repeat && !loop) return;

  if (presetSave.checked) {
    const options = { seconds, icon, title, loop, repeat, sound, volume, hourMinute, hourSecond };
    preset.push(options);
    localStorage.setItem('buffPreset', JSON.stringify(preset));
    populatePreset();
    return;
  }

  const activeDiv = document.createElement("div");
  const activeLabel = document.createElement("p");
  const activeImage = document.createElement("img");

  activeDiv.appendChild(activeImage);
  activeDiv.appendChild(activeLabel);
  activeTimers.appendChild(activeDiv);

  activeDiv.className = "inline";
  activeDiv.title = title;
  activeLabel.innerText = `${seconds}`;
  activeImage.src = icon;

  if (loop) activeDiv.style.border = '2px solid green';

  const now = new Date().getTime() / 1000;
  let target = now + seconds;
  let audioTarget = now + seconds;

  // Audio is instanced per timer
  const audio = new Audio(sound);
  audio.volume = volume;

  let done = false;
  // Timer sound repeats until it is clicked
  let repeating = false;
  let flash = 0;

  const timerInterval = setInterval(() => {
    const current = new Date().getTime() / 1000;
    const remaining = Math.max(Math.round(target - current), 0);
    const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

    activeLabel.innerText = `${remaining}`;

    if (remaining === 0 && !done) {
      if (!loop) {
        done = true;
        activeDiv.style.border = '2px solid red';
        toast(activeDiv.title || "Alarm!");
      } else if (hourMinute) {
        // Loop reset to next hour mm:ss
        target = current + 3600;
      } else {
        // Loop another x seconds
        target = current + seconds;
      }
    }

    // Back to green loop border when flash is finished
    if (flash > 0) {
      if (--flash <= 0) activeDiv.style.border = '2px solid green';
    }

    if (remainingAudio === 0) {
      audio.play();

      if (!loop) {
        audioTarget = current + audioLoopDelay;
      } else if (!repeat) {
        audioTarget = target;
        toast(activeDiv.title || "Alarm!");
        // Yellow border for 5s to show which timer just triggered
        flash = 5;
        activeDiv.style.border = '2px solid yellow';
      } else {
        if (!repeating) {
          toast(activeDiv.title || "Alarm!");
          repeating = true;
          activeDiv.style.border = '2px solid orange';
        }
        audioTarget = current + audioLoopDelay;
      }
    }
  }, 1000);

  // Right click to reset timers. Don't reset alarms.
  activeImage.oncontextmenu = (e) => {
    e.preventDefault();
    if (repeat || hourMinute) return;
    const current = new Date().getTime() / 1000;
    target = current + seconds;
    audioTarget = target;
    done = false;
    activeDiv.style.border = loop ? '2px solid green' : '';
  };

  // Holding ctrl shift or alt while mouse hover reset alarm as well
  activeImage.onmouseover = (e) => {
    if (!e.altKey && !e.ctrlKey && !e.shiftKey) return;
    if (repeat || hourMinute) return;
    const current = new Date().getTime() / 1000;
    target = current + seconds;
    audioTarget = target;
    done = false;
    activeDiv.style.border = loop ? '2px solid green' : '';
  };

  activeImage.onclick = (e) => {
    if (repeating) {
      repeating = false;
      audioTarget = target;
      activeDiv.style.border = '2px solid green';
    } else {
      clearInterval(timerInterval);
      activeDiv.remove();
    }
  };
};

// === Preset Timers ===

for (let i = 0; i < timerData.length; i++) {
  const timer = timerData[i];
  const minutes = timer.duration / 60;

  const timerDiv = document.createElement("div");
  const timerLabel = document.createElement("p");
  const timerImage = document.createElement("img");

  timerDiv.appendChild(timerImage);
  timerDiv.appendChild(timerLabel);
  timersList.appendChild(timerDiv);

  timerDiv.className = "inline";
  timerLabel.innerText = `${minutes}m`;
  timerImage.src = timer.icon;

  timerImage.onclick = () => {
    const seconds = timer.duration;
    const { icon, title } = timer;
    const sound = timerAudio.src;
    const volume = timerAudio.volume;

    startTimer(seconds, icon, title, false, false, sound, volume);
  }
}

// === Custom Preset ===

const preset = JSON.parse(localStorage.getItem('buffPreset') || "[]");
const presetUse = document.getElementById('preset-use');
const presetSave = document.getElementById('preset-save');
const presetRemove = document.getElementById('preset-remove');
const presetTimerDiv = document.getElementById('preset-timers');

const populatePreset = () => {
  presetTimerDiv.innerHTML = '';

  for (let i = 0; i < preset.length; i++) {
    const options = preset[i];
  
    const presetDiv = document.createElement("div");
    const presetLabel = document.createElement("p");
    const presetImage = document.createElement("img");

    presetDiv.className = "inline";
    presetDiv.title = options.title;
    presetLabel.innerText = `${options.seconds}`;
    if (options.hourMinute) presetLabel.innerText = `${options.title}`;
    presetImage.src = options.icon;
  
    if (options.loop) presetDiv.style.border = '2px solid green';
    if (options.repeat) presetDiv.style.border = '2px solid orange';
  
    presetDiv.appendChild(presetImage);
    presetDiv.appendChild(presetLabel);
    presetTimerDiv.appendChild(presetDiv);

    presetDiv.onclick = () => {
      if (presetUse.checked) {
        if (options.hourMinute) {
          const future = calculateFutureTime(options.hourMinute, options.hourSecond);
          const now = new Date().getTime() / 1000;
          options.seconds = Math.round((future.getTime() / 1000) - now);
        }
        startTimer(options.seconds, options.icon, options.title, options.loop, options.repeat, options.sound, options.volume, options.hourMinute, options.hourSecond);
      } else if (presetRemove.checked) {
        preset.splice(i, 1);
        localStorage.setItem('buffPreset', JSON.stringify(preset));
        populatePreset();
      }
    }
  }
}

populatePreset();

// === Custom Timer ===

const customButton = document.getElementById('customButton');
const customMinute = document.getElementById('customMinute');
const customTime = document.getElementById('customInput');
const customLoop = document.getElementById('customLoop');
const customTooltip = document.getElementById('customTooltip');

customButton.onclick = () => {
  const seconds = +customTime.value + 60 * +customMinute.value;
  const loop = customLoop.checked;
  const sound = timerAudio.src;
  const volume = timerAudio.volume;

  let icon = loop ? './assets/block.png' : './assets/block2.png';
  let title = "";

  if (selectedIcon >= 0) icon = icons[selectedIcon];
  if (customTooltip) title = customTooltip.value;

  startTimer(seconds, icon, title, loop, false, sound, volume);
}

// === Alarm Timer ===

const alarmButton = document.getElementById('alarmButton');
const alarmMin = document.getElementById('alarmMin');
const alarmSec = document.getElementById('alarmSec');
const alarmLoop = document.getElementById('alarmLoop');
const alarmTooltip = document.getElementById('alarmTooltip');
const alarmRepeat = document.getElementById('alarmRepeat');

// Repeat only available on loop
alarmLoop.onchange = () => {
  alarmRepeat.disabled = !alarmLoop.checked;
  if (alarmRepeat.disabled) alarmRepeat.checked = false;
};

const calculateFutureTime = (targetMin, targetSec) => {
  const future = new Date();

  // Calculate the next instance of hh:mm:ss
  if (targetMin > future.getMinutes()) {
    future.setSeconds(targetSec);
    future.setMinutes(targetMin);
  } else if (targetMin < future.getMinutes()) {
    future.setSeconds(targetSec);
    future.setMinutes(targetMin);
    future.setHours(future.getHours() + 1);
  } else {
    if (targetSec > future.getSeconds()) {
      future.setSeconds(targetSec);
    } else if (targetSec < future.getSeconds()) {
      future.setSeconds(targetSec);
      future.setHours(future.getHours() + 1);
    } else {
      future.setHours(future.getHours() + 1);
    }
  }

  return future;
};

alarmButton.onclick = () => {
  const loop = alarmLoop.checked;
  const repeat = alarmRepeat.checked;
  const sound = timerAudio.src;
  const volume = timerAudio.volume;

  const targetMin = alarmMin.value;
  const targetSec = alarmSec.value;

  if (targetMin < 0 || targetMin > 59 || targetSec < 0 || targetSec > 59) return;

  const future = calculateFutureTime(targetMin, targetSec);

  const now = new Date().getTime() / 1000;
  const seconds = Math.round((future.getTime() / 1000) - now);

  let icon = './assets/alarmclock.png';
  let title = '';

  if (selectedIcon >= 0) icon = icons[selectedIcon];
  if (alarmTooltip) title = alarmTooltip.value;

  startTimer(seconds, icon, title, loop, repeat, sound, volume, targetMin, targetSec);
};
