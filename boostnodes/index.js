let files, classes;

let jobselect = true;

const skills = [];
const nodes = [];

const d = document.getElementById('nodes');
const t = document.getElementById('trios');
const tri = document.getElementById('trinodes');
const b = document.getElementById('boostnodes');

const mask = document.createElement('canvas');
const maskc = mask.getContext('2d', { willReadFrequently: true });

let masktl;
let node_count = 1;

// Pixel count of skill slots
const slot1c = 221;
const slot2c = 144;
const slot3c = 197;

// ===== Node Divider Mask =====
const maskimg = new Image();

maskimg.onload = async() => {
  maskc.canvas.width = maskimg.width;
  maskc.canvas.height = maskimg.height;
  maskc.drawImage(maskimg, 0, 0);
  masktl = maskc.getImageData(0, 0, 1, 1);
};
  
maskimg.src = './assets/trinode_mask.png';

// ===== Add boost node information =====
const add_image = async(data, node_count, shifts) => {
  const c = document.createElement('canvas');
  const d = document.createElement('div');
  const ctx = c.getContext('2d', { willReadFrequently: true });

  c.width = data.width;
  c.height = data.height;
  ctx.putImageData(data, 0, 0);
  
  const img = new Image();
  const bnode = [];

  // Search for the 3 skills that this node is boosting
  await new Promise((res) => {
    img.onload = async () => {
      for (const skill of skills) {
        const sc = document.createElement('canvas');
        const sctx = sc.getContext('2d', { willReadFrequently: true });

        sctx.canvas.width = skill.width;
        sctx.canvas.height = skill.height;
        sctx.drawImage(skill, 0, 0);

        let slot1 = 0;
        let slot2 = 0;
        let slot3 = 0;

        for (let y = 0; y < c.height; y++) {
          for (let x = 0; x < c.width; x++) {
            const mpx = maskc.getImageData(x + 1, y + 1, 1, 1);

            if (colour_match(mpx.data, [255, 0, 0])) {
              const npx = ctx.getImageData(x, y, 1, 1);
              const spx = sctx.getImageData(x + 3 - shifts[1], y + 3 + shifts[2], 1, 1);
              if (!colour_match(npx.data, spx.data)) continue;
              slot1++;
              continue;
            }

            if (colour_match(mpx.data, [0, 255, 0])) {
              const npx = ctx.getImageData(x, y, 1, 1);
              const spx = sctx.getImageData(x + 3 + shifts[0] - shifts[1], y + 3, 1, 1);
              if (!colour_match(npx.data, spx.data)) continue;
              slot2++;
              continue;
            }

            if (colour_match(mpx.data, [0, 0, 255])) {
              const npx = ctx.getImageData(x, y, 1, 1);
              const spx = sctx.getImageData(x + 3 + shifts[0], y + 3 + shifts[2], 1, 1);
              if (!colour_match(npx.data, spx.data)) continue;
              slot3++;
              continue;
            }
          }
        }

        const sk = skill.src.split('/').pop().split('.')[0];

        // 95% threshold since at least 1 skill has 3 slightly different icons. Why Luminous Armageddon.
        if (slot1 >= 0.95 * slot1c) bnode[0] = sk;
        if (slot2 >= 0.95 * slot2c) bnode[1] = sk;
        if (slot3 >= 0.95 * slot3c) bnode[2] = sk;
      }

      res();
    };

    img.src = c.toDataURL();
  });

  img.id = node_count - 1;

  try {
    d.innerHTML = `
      <h2>${node_count}</h2>
      ${img.outerHTML}
      <div>
        <p>1. ${bnode[0].replaceAll('-', ' ')}</p>
        <p>2. ${bnode[1].replaceAll('-', ' ')}</p>
        <p>3. ${bnode[2].replaceAll('-', ' ')}</p>
      </div>
    `;
    
    nodes.push(bnode);
    t.appendChild(d);
    return true;
  } catch (e) {
    // Node is probably locked or skill icon is different
    return false;
  }
}

// Pixels rgb are within 4 of each other
const colour_match = (a, b) => ((Math.abs(a[0] - b[0]) < 4) && (Math.abs(a[1] - b[1]) < 4) && (Math.abs(a[2] - b[2]) < 4));

// Search image for boost nodes using the divider
const search_nodes = async (ctx) => {
  const mw = maskc.canvas.width;
  const mh = maskc.canvas.height;

  const iw = ctx.canvas.width;
  const ih = ctx.canvas.height;

  // Loop image of nodes
  for (let y = 0; y <= ih - mh; y++) {
    for (let x = 0; x <= iw - mw; x++) {
      const top_left = ctx.getImageData(x, y, 1, 1);
      if (!colour_match(top_left.data, masktl.data)) continue;

      let found = true;
      // Loop image mask
      for (let sy = 0; sy < mw; sy++) {
        if (!found) break;

        for (let sx = 0; sx < mh; sx++) {
          const maskpx = maskc.getImageData(sx, sy, 1, 1);
          // Transparent pixel
          if (!colour_match(masktl.data, maskpx.data)) continue;
          const npx = ctx.getImageData(x + sx, y + sy, 1, 1);
          if (!colour_match(npx.data, maskpx.data)) found = false;
        }
      }

      if (found) {
        const left_shifted = colour_match(ctx.getImageData(x - 3, y + 1, 1, 1).data, [0, 0, 0]);
        const right_shifted = colour_match(ctx.getImageData(x + 30, y + 1, 1, 1).data, [0, 0, 0]);
        const top_shifted = colour_match(ctx.getImageData(x + 1, y - 3, 1, 1).data, [0, 0, 0]);

        let success = await add_image(ctx.getImageData(x + 1, y + 1, 26, 26), node_count, [left_shifted ? 1 : 0, right_shifted ? 1 : 0, top_shifted ? 1 : 0]);
        // Node is not locked
        if (success) {
          ctx.fillText(node_count, x + 14, y + 24);
          ctx.strokeText(node_count++, x + 14, y + 24);
        }
      }
    }
  }
}

// Add image of boost nodes to page and start picking out the boost nodes
const add_nodes = async(url) => {
  const img = new Image();
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true });

  d.appendChild(c);
  document.getElementById('paste').style.display = 'none';

  await new Promise(res => {
    img.onload = async () => {
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'white';
      ctx.font = '32px Verdana';
      ctx.textAlign = "center";
      await search_nodes(ctx);
      res();
    };
    
    img.src = url;
  });
};

// Demo
const demo = ['d', 'e', 'm', 'o'];
const typed = ['', '', '', ''];

document.onkeydown = async (e) => {
  typed.push(e.key.toLowerCase());
  typed.shift();
  if (JSON.stringify(demo) === JSON.stringify(typed) && jobselect) {
    await set_skills('mercedes');
    for (let i = 1; i <= 11; i++) await add_nodes(`./assets/demo/nodes${i}.png`);
  }
};

// Handle image paste
document.onpaste = async (event) => {
  if (jobselect) return;

  const items = (event.clipboardData ?? event.originalEvent.clipboardData).items;
  
  for (const item of items) {
    if (item.kind === "file") {
      const blob = item.getAsFile();
      const url = window.URL.createObjectURL(blob);
      await add_nodes(url);
    }
  }
};

// Handle image file drag and drop
const droparea = document.querySelector('html');

const droppable = () => droparea.style.border = 'solid red 5px';
const nodrop = () => droparea.style.border = '';
const prevent = (e) => e.preventDefault();

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => droparea.addEventListener(e, prevent));
['dragenter', 'dragover'].forEach(e => droparea.addEventListener(e, droppable));
['dragleave', 'drop'].forEach(e => droparea.addEventListener(e, nodrop));

const dropimages = async (e) => {
  if (jobselect) return;
  const data = e.dataTransfer;
  const files = [...data.files];
  
  for (const file of files) {
    if (file.type !== 'image/png') continue;
    const url = window.URL.createObjectURL(file);
    await add_nodes(url);
  }
};

droparea.addEventListener('drop', dropimages);

// Toggle between class select and class
const set_skills = async (job) => {
  const portraits = document.getElementById('jobs').childNodes;

  if (jobselect) {
    const s = files.classes[job]['files'].filter(name => !name.startsWith('0_'));
    document.getElementById('paste').style.display = '';
  
    // Add skill icons
    for (const skill of s) {
      const img = new Image();

      let selected = false;

      img.onclick = () => {
        img.style.border = selected ? '' : 'solid yellow';
        selected = !selected;
      };

      await new Promise((res) => {
        img.onload = () => res();
        img.src = `./assets/classes/${job}/${skill}`;
        img.title = `${skill.split('.png')[0].split('-').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}`;
        img.draggable = false;
        b.appendChild(img);
      });

      skills.push(img);
    }
  
    document.getElementById('boostclass').innerHTML = job.replaceAll('-', ' ');
    document.getElementById('boostcount').innerHTML = s.length;

    // Hide other classes
    for (const p of portraits) {
      if (p.src.split('portrait/')[1] !== `${job}.png`) p.style.display = 'none';
    }
  } else { 
    // Reset variables
    document.getElementById('boostclass').innerHTML = 'Select - Type \'demo\' to load an example.';
    document.getElementById('boostcount').innerHTML = '';
    document.getElementById('paste').style.display = 'none';
    while (b.firstChild) b.removeChild(b.firstChild);
    while (d.firstChild) d.removeChild(d.firstChild);
    while (t.firstChild) t.removeChild(t.firstChild);
    while (tri.firstChild) tri.removeChild(tri.firstChild);
    while (skills.length) skills.pop();
    while (nodes.length) nodes.pop();
    for (const p of portraits) p.style.display = '';
    node_count = 1;
  }

  jobselect = !jobselect;
};

// Show all valid trinode sets
const display_nodes = (n) => {
  const div = document.createElement('div');

  for (const v of n) {
    const node = document.getElementById(v).parentNode;
    const clone = node.cloneNode(true);
    div.appendChild(clone);
  }

  tri.appendChild(div);
};

// Recursive search through nodes. Filter while searching to optimize a bit. Rip my nodes not enough to test.
const rsearch = (skills, maxdepth, depth, sol, idx, start) => {
  if (depth > maxdepth) return display_nodes(idx);

  for (let i = start; i < nodes.length - maxdepth + depth; i++) {
    if (tri.childElementCount > 9) return;
    const n = nodes[i];
    let s = [...skills];

    let flag = false;

    // Slot 1 skill already selected
    for (let j = 0; j < sol.length; j++) {
      if (n[0] === sol[j][0]) {
        flag = true;
        break;
      }
    }

    if (flag) continue;

    // Check if skill is relevant including filler skills
    if (s.indexOf(n[0]) === -1) {         // Skill not needed or fully filled to 2
      if (s.indexOf('') === -1) continue; // No filler skills left
      s.splice(s.indexOf(''), 1);         // Use a filler skill slot
    } else {                        // Skill needed
      s.splice(s.indexOf(n[0]), 1); // Use skill slot
    }

    if (s.indexOf(n[1]) === -1) {
      if (s.indexOf('') === -1) continue;
      s.splice(s.indexOf(''), 1);
    } else {
      s.splice(s.indexOf(n[1]), 1);
    }

    if (s.indexOf(n[2]) === -1) {
      if (s.indexOf('') === -1) continue;
      s.splice(s.indexOf(''), 1);
    } else {
      s.splice(s.indexOf(n[2]), 1);
    }
    
    const sol2 = [...sol];
    const idx2 = [...idx];
    sol2.push(n);
    idx2.push(i);
    rsearch(s, maxdepth, depth + 1, sol2, idx2, i + 1);
  }
};

// Very inefficient brute force method of finding trinodes.
// There's probably a much better dp solution but this works and I am lazy.
const search = () => {
  while (tri.firstChild) tri.removeChild(tri.firstChild);

  // Selected skills to boost
  const selected = [];

  for (const img of b.childNodes) {
    if (img.style.border.length > 0) {
      selected.push(img.src.split('classes/')[1].split('/')[1].split('.')[0]);
    }
  }

  if (selected.length < 2) return tri.innerHTML = `<h2>Select at least 2 skills to boost.</h2>`;

  const s = [...selected, ...selected];
  
  // Add 'filler' skill slots
  while (s.length % 3 > 0) s.push('');

  const slots = document.getElementById('slots');
  let min = s.length / 3;
  if (slots.value < min) return slots.style.backgroundColor = 'red';
  slots.style.backgroundColor = 'white';

  while (s.length < 3 * slots.value) s.push('');

  rsearch(s, slots.value, 1, [], [], 0);

  if (tri.childElementCount === 0) {
    tri.innerHTML = `<h2>No set of ${slots.value} trinodes found to boost each selected skill at least 2 times.</h2>`;
  }
};

(async () => {
  files = await fetch('out.json').then(o => o.json());
  classes = files['class-portrait']['files'];

  document.getElementById('paste').style.display = 'none';
  document.getElementById('search').onclick = search;

  const j = document.getElementById('jobs');
  
  for (let i = 0; i < classes.length; i++) {
    const img = new Image();
    img.src = `./assets/class-portrait/${classes[i]}`;
    img.draggable = false;
    classes[i] = classes[i].replace('.png', '');
    img.onclick = () => set_skills(classes[i]);
    j.appendChild(img);
  }
})();
// Nice line count
