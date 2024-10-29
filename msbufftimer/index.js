const toast = (text) => {
  Toastify({
    text,
    duration: 5000,
    gravity: "top",
    position: "left",
    style: {
      background: "BlueViolet",
    }
  }).showToast();
};

// Audio

const savedSound = localStorage.getItem('sound');
const timerAudio = new Audio(savedSound);

const volume = document.getElementById('vol');
const savedVolume = localStorage.getItem('volume');

if (savedVolume === null) {
  timerAudio.volume = 0.2;
  localStorage.setItem('volume', timerAudio.volume);
} else {
  timerAudio.volume = savedVolume;
}

volume.value = timerAudio.volume * 100;

volume.oninput = () => {
  timerAudio.volume = volume.value / 100;
  localStorage.setItem('volume', timerAudio.volume);
}

const audioButton = document.getElementById('soundButton');
const soundselect = document.getElementById('soundselect');

const soundurl = document.getElementById('soundurl');
soundurl.value = savedSound;

audioButton.onclick = () => {
  timerAudio.src = soundurl.value;
  timerAudio.play()
    .then(e => localStorage.setItem('sound', soundurl.value))
    .catch(e => {
      const options = {
        text: 'Invalid URL',
        duration: 1500,
        gravity: "bottom", position: "center",
        style: { background: "Maroon" }
      };
      Toastify(options).showToast();
    });
};

const sounddata = [
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

for (let i = 0; i < sounddata.length; i++) {
  const option = document.createElement("option");
  const text = document.createTextNode(sounddata[i].label);
  option.setAttribute("value", i);
  option.appendChild(text);
  soundselect.appendChild(option);

  if (savedSound === sounddata[i].url) soundselect.value = i;
}

if (savedSound === null) {
  soundselect.value = 1;
  timerAudio.src = 'sounds/shatter.mp3';
}

soundselect.onchange = (e) => {
  const i = e.target.value;
  const url = sounddata[i].url;
  timerAudio.src = url;
  timerAudio.play();
  localStorage.setItem('sound', url);
};

(() => {
  "use strict";

  // Preset Timer

  const timerData = {
    legion_wealth_10m: { duration: 600, title: "Legion Wealth", icon: "assets/legion_wealth.webp" },
    legion_wealth_20m: { duration: 1200, title: "Legion Wealth", icon: "assets/legion_wealth.webp" },
    legion_wealth_30m: { duration: 1800, title: "Legion Wealth", icon: "assets/legion_wealth.webp" },
    legion_exp_10m: { duration: 600, title: "Legion Exp", icon: "assets/legion_exp.webp" },
    legion_exp_20m: { duration: 1200, title: "Legion Exp", icon: "assets/legion_exp.webp" },
    legion_exp_30m: { duration: 1800, title: "Legion Exp", icon: "assets/legion_exp.webp" },
    legion_luck_10m: { duration: 600, title: "Legion Luck", icon: "assets/legion_luck.webp" },
    legion_luck_20m: { duration: 1200, title: "Legion Luck", icon: "assets/legion_luck.webp" },
    legion_luck_30m: { duration: 1800, title: "Legion Luck", icon: "assets/legion_luck.webp" },
    exp_15m: { duration: 900, title: "Exp Coupon", icon: "assets/exp.webp" },
    exp_30m: { duration: 1800, title: "Exp Coupon", icon: "assets/exp.webp" },
    exp_60m: { duration: 3600, title: "Exp Coupon", icon: "assets/exp.webp" },
    wap: { duration: 7200, title: "WAP", icon: "assets/wap.webp" },
    mvp: { duration: 1800, title: "MVP", icon: "assets/mvp.webp" },
  };

  const audioLoopDelay = 5;

  const timers = Object.keys(timerData);
  
  const timersList = document.getElementById("timers");
  const activeTimers = document.getElementById("active-timers");

  for (let t of timers) {
    const timer = timerData[t];
    const minutes = timer.duration / 60;

    const timerDiv = document.createElement("div");
    timerDiv.className = "inline";

    const timerLabel = document.createElement("p");
    timerLabel.innerText = `${minutes}m`;

    const timerImage = document.createElement("img");
    timerImage.src = timer.icon;

    timerImage.onclick = () => {
      const seconds = timer.duration;

      const activeDiv = document.createElement("div");
      activeDiv.className = "inline";
      activeDiv.title = timer.title;

      const activeLabel = document.createElement("p");
      activeLabel.innerText = `${seconds}`;
  
      const activeImage = document.createElement("img");
      activeImage.src = timer.icon;

      const now = new Date().getTime() / 1000;
      const target = now + seconds;
      let audioTarget = now + seconds;

      const audio = new Audio(timerAudio.src);
      audio.volume = timerAudio.volume;

      let done = false;

      const timerInterval = setInterval(() => {
        const current = new Date().getTime() / 1000;
        const remaining = Math.max(Math.round(target - current), 0);
        const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

        activeLabel.innerText = `${remaining}`;

        if (remaining === 0 && !done) {
          done = true;
          activeDiv.style.border = '2px solid red';
          toast(activeDiv.title);
        }

        if (remainingAudio <= 0) {
          audio.play();
          audioTarget = current + audioLoopDelay;
        }
      }, 1000);

      activeImage.onclick = () => {
        clearInterval(timerInterval);
        activeDiv.remove();
      };

      activeDiv.appendChild(activeImage);
      activeDiv.appendChild(activeLabel);
      activeTimers.appendChild(activeDiv);
    };

    timerDiv.appendChild(timerImage);
    timerDiv.appendChild(timerLabel);
    timersList.appendChild(timerDiv);
  }

  // Custom Timer

  const customButton = document.getElementById('customButton');
  const customTime = document.getElementById('customInput');
  const customLoop = document.getElementById('customLoop');
  const customTooltip = document.getElementById('customTooltip');

  customButton.onclick = () => {
    const seconds = +customTime.value;
    if (!seconds || seconds <= 0) return;

    const loop = customLoop.checked;

    const activeDiv = document.createElement("div");
    activeDiv.className = "inline";

    if (loop) activeDiv.style.border = '2px solid green';

    const activeLabel = document.createElement("p");
    activeLabel.innerText = `${seconds}`;

    const activeImage = document.createElement("img");
    activeImage.src = loop ? './assets/block.png' : './assets/block2.png';
    if (selected >= 0) activeImage.src = icons[selected];

    if (customTooltip) activeDiv.title = customTooltip.value;

    const now = new Date().getTime() / 1000;
    let target = now + seconds;
    let audioTarget = now + seconds;

    const audio = new Audio(timerAudio.src);
    audio.volume = timerAudio.volume;

    let done = false;
    let flash = 0;

    const timerInterval = setInterval(() => {
      const current = new Date().getTime() / 1000;
      const remaining = Math.max(Math.round(target - current), 0);
      const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

      activeLabel.innerText = `${remaining}`;

      if (!loop && remaining === 0 && !done) {
        done = true;
        activeDiv.style.border = '2px solid red';
        toast(activeDiv.title || "Beep Beep!");
      }

      if (flash > 0) {
        if (--flash <= 0) activeDiv.style.border = '2px solid green';
      }

      if (remainingAudio <= 0) {
        audio.play();
        if (loop) {
          toast(activeDiv.title || "Beep Beep! (Loop)");
          flash = 5;
          activeDiv.style.border = '2px solid yellow';
          target  = current + seconds;
          audioTarget = current + seconds;
        } else {
          audioTarget = current + audioLoopDelay;
        }
      }
    }, 1000);

    activeImage.onclick = () => {
      clearInterval(timerInterval);
      activeDiv.remove();
    };

    activeDiv.appendChild(activeImage);
    activeDiv.appendChild(activeLabel);
    activeTimers.appendChild(activeDiv);
  };

  // Alarm Timer

  const alarmButton = document.getElementById('alarmButton');
  const alarmMin = document.getElementById('alarmMin');
  const alarmSec = document.getElementById('alarmSec');
  const alarmLoop = document.getElementById('alarmLoop');
  const alarmTooltip = document.getElementById('alarmTooltip');
  const alarmRepeat = document.getElementById('alarmRepeat');

  alarmLoop.onchange = () => {
    alarmRepeat.disabled = !alarmLoop.checked;
    if (alarmRepeat.disabled) alarmRepeat.checked = false;
  };

  alarmButton.onclick = () => {
    const targetMin = alarmMin.value;
    const targetSec = alarmSec.value;

    if (targetMin < 0 || targetMin > 59 || targetSec < 0 || targetSec > 59) return;

    const future = new Date();

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

    const now = new Date().getTime() / 1000;
    const seconds = Math.round((future.getTime() / 1000) - now);
    const loop = alarmLoop.checked;

    const activeDiv = document.createElement("div");
    activeDiv.className = "inline";

    if (loop) activeDiv.style.border = '2px solid green';

    const activeLabel = document.createElement("p");
    activeLabel.innerText = `${seconds}`;

    const activeImage = document.createElement("img");
    activeImage.src = './assets/alarmclock.png';
    if (selected >= 0) activeImage.src = icons[selected];

    if (alarmTooltip) activeDiv.title = alarmTooltip.value;

    let target = now + seconds;
    let audioTarget = now + seconds;

    const audio = new Audio(timerAudio.src);
    audio.volume = timerAudio.volume;

    let done = false;
    let flash = 0;

    const repeat = alarmRepeat.checked;
    let repeating = false;

    const timerInterval = setInterval(() => {
      const current = new Date().getTime() / 1000;
      const remaining = Math.max(Math.round(target - current), 0);
      const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

      activeLabel.innerText = `${remaining}`;
      
      if (remaining === 0) {
        if (!loop && !done) {
          done = true;
          activeDiv.style.border = '2px solid red';
          toast(activeDiv.title || "Ring Ring!");
        } else {
          target = current + 3600;
        }
      }

      if (flash > 0) {
        if (--flash <= 0) activeDiv.style.border = '2px solid green';
      }

      if (remainingAudio === 0) {
        audio.play();
        if (!loop) {
          audioTarget = current + audioLoopDelay;
        } else if (!repeat) {
          audioTarget = target;
          toast(activeDiv.title || "Ring Ring! (Loop)");
          flash = 5;
          activeDiv.style.border = '2px solid yellow';
        } else {
          if (!repeating) {
            toast(activeDiv.title || "Ring Ring! (Click)");
            repeating = true;
            activeDiv.style.border = '2px solid red';
          }
          audioTarget = current + audioLoopDelay;
        }
      }
    }, 1000);

    activeImage.onclick = () => {
      if (repeating) {
        repeating = false;
        audioTarget = target;
        activeDiv.style.border = '2px solid green';
      } else {
        clearInterval(timerInterval);
        activeDiv.remove();
      }
    };

    activeDiv.appendChild(activeImage);
    activeDiv.appendChild(activeLabel);
    activeTimers.appendChild(activeDiv);
  };

  // Icons
  
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

  let selected = -1;

  const iconsDisplay = document.getElementById('icons');
  const iconElements = [];

  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];

    const iconDiv = document.createElement("div");
    iconDiv.className = "inline";

    const iconImage = document.createElement("img");
    iconImage.src = icon;

    iconDiv.onclick = () => {
      if (selected === i) {
        iconDiv.style.border = '';
        selected = -1;
      } else if (selected === -1) {
        iconDiv.style.border = '3px solid yellow';
        selected = i;
      } else {
        iconDiv.style.border = '3px solid yellow';
        iconElements[selected].style.border = '';
        selected = i;
      }
    };

    iconElements.push(iconDiv);
    iconDiv.appendChild(iconImage);
    iconsDisplay.appendChild(iconDiv);
  }

  const iconsLabel = document.getElementById('iconsLabel');
  iconsLabel.onclick = () => {
    if (iconsLabel.innerText === 'Icons (-)') {
      iconsLabel.innerText = 'Icons (+)';
      iconsDisplay.style.display = 'none';
    } else {
      iconsLabel.innerText = 'Icons (-)';
      iconsDisplay.style.display = '';
    }
  };
})();
