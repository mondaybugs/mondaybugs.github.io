(() => {
  "use strict";

  // Preset Timer

  const timerData = {
    legion_wealth_10m: { duration: 600, icon: "assets/legion_wealth.webp" },
    legion_wealth_20m: { duration: 1200, icon: "assets/legion_wealth.webp" },
    legion_wealth_30m: { duration: 1800, icon: "assets/legion_wealth.webp" },
    legion_exp_10m: { duration: 600, icon: "assets/legion_exp.webp" },
    legion_exp_20m: { duration: 1200, icon: "assets/legion_exp.webp" },
    legion_exp_30m: { duration: 1800, icon: "assets/legion_exp.webp" },
    legion_luck_10m: { duration: 600, icon: "assets/legion_luck.webp" },
    legion_luck_20m: { duration: 1200, icon: "assets/legion_luck.webp" },
    legion_luck_30m: { duration: 1800, icon: "assets/legion_luck.webp" },
    exp_15m: { duration: 900, icon: "assets/exp.webp" },
    exp_30m: { duration: 1800, icon: "assets/exp.webp" },
    exp_60m: { duration: 3600, icon: "assets/exp.webp" },
    wap: { duration: 7200, icon: "assets/wap.webp" },
    mvp: { duration: 1800, icon: "assets/mvp.webp" },
  };
  
  const timerAudio = new Audio("./assets/shatter.mp3");
  timerAudio.volume = 0.2;

  const volume = document.getElementById('vol');
  volume.oninput = () => timerAudio.volume = volume.value / 100;

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

      const activeLabel = document.createElement("p");
      activeLabel.innerText = `${seconds}`;
  
      const activeImage = document.createElement("img");
      activeImage.src = timer.icon;

      const now = new Date().getTime() / 1000;
      const target = now + seconds;
      let audioTarget = now + seconds;

      const timerInterval = setInterval(() => {
        const current = new Date().getTime() / 1000;
        const remaining = Math.max(Math.round(target - current), 0);
        const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

        activeLabel.innerText = `${remaining}`;

        if (remaining === 0) activeDiv.style.border = '2px solid red';
        
        if (remainingAudio <= 0) {
          timerAudio.play();
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

    const now = new Date().getTime() / 1000;
    let target = now + seconds;
    let audioTarget = now + seconds;

    const timerInterval = setInterval(() => {
      const current = new Date().getTime() / 1000;
      const remaining = Math.max(Math.round(target - current), 0);
      const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

      activeLabel.innerText = `${remaining}`;

      if (!loop && remaining === 0) activeDiv.style.border = '2px solid red';
      
      if (remainingAudio <= 0) {
        timerAudio.play();
        if (loop) {
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

    const repeat = alarmRepeat.checked;
    let repeating = false;

    const timerInterval = setInterval(() => {
      const current = new Date().getTime() / 1000;
      const remaining = Math.max(Math.round(target - current), 0);
      const remainingAudio = Math.max(Math.round(audioTarget - current), 0);

      activeLabel.innerText = `${remaining}`;
      
      if (remaining === 0) {
        if (!loop) {
          activeDiv.style.border = '2px solid red';
        } else {
          target = current + 3600;
        }
      }

      if (remainingAudio === 0) {
        timerAudio.play();
        if (!loop) {
          audioTarget = current + audioLoopDelay;
        } else if (!repeat) {
          audioTarget = target;
        } else {
          repeating = true;
          activeDiv.style.border = '2px solid red';
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
    "assets/frenzy.png"
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
