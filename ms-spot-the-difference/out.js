const c = document.getElementById('spotdiff');

let cycle;
let cnum = 0;

const colour_match = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const get_pixel = (idata, x, y, w) => {
  let pos = y * w + x;
  pos = pos * 4;
  return [idata[pos], idata[pos + 1], idata[pos + 2], idata[pos + 3]];
};

const set_pixel = (idata, rgb, x, y, w) => {
  let pos = y * w + x;
  pos = pos * 4;
  idata[pos] = rgb[0];
  idata[pos + 1] = rgb[1];
  idata[pos + 2] = rgb[2];
  idata[pos + 3] = 255;
}

const spot_diff = async (blob) => {
  while (c.firstChild) c.removeChild(c.firstChild);

  clearInterval(cycle);

  const img = document.getElementById('preview');

  await new Promise(resolve => {
    img.onload = resolve;
    img.src = window.URL.createObjectURL(blob);
    img.style.display = 'none';
  });

  const canvas = document.createElement("canvas");

  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);

  const image = canvas.getContext("2d");
  const image_d = image.getImageData(0, 0, canvas.width, canvas.height).data;
  
  const subimg = new Image();

  await new Promise(resolve => {
    subimg.onload = resolve;
    subimg.src = 'a.png';
    subimg.style.display = 'block';
  });
  
  const subcanvas = document.createElement("canvas");
  
  subcanvas.width = subimg.width;
  subcanvas.height = subimg.height;
  subcanvas.getContext("2d").drawImage(subimg, 0, 0);

  const image2 = subcanvas.getContext("2d");
  const image2_d = image2.getImageData(0, 0, subcanvas.width, subcanvas.height).data;
  
  let streak = 0;
  let done = false;

  let coords = { x: 0, y: 0 };

  for (let y = 0; y < canvas.height; y++) {
    streak = 0;

    for (let x = 0; x <= (canvas.width - subcanvas.width); x++) {
      const canvas_pixel = get_pixel(image_d, x, y, canvas.width);
      const subcanvas_pixel = get_pixel(image2_d, streak, 0, subcanvas.width);

      if (colour_match(canvas_pixel, subcanvas_pixel)) {
        streak++;
      } else {
        streak = 0;
      }

      if (streak === subcanvas.width) {
        coords.x = x;
        coords.y = y;
        done = true;
        break;
      }
    }

    if (done) break;
  }

  const diff_width = 450;
  const diff_height = 450;

  const diff_y = 28;
  const diff_x1 = -256;
  const diff_x2 = 202;

  const left_img_data = image.getImageData(coords.x + diff_x1, coords.y + diff_y, diff_width, diff_height);
  const right_img_data = image.getImageData(coords.x + diff_x2, coords.y + diff_y, diff_width, diff_height);

  const left_canvas = document.createElement("canvas");
  const right_canvas = document.createElement("canvas");
  const diff_canvas_b = document.createElement("canvas");
  const diff_canvas = document.createElement("canvas");
  const diff_canvas2 = document.createElement("canvas");

  left_canvas.width = diff_width;
  left_canvas.height = diff_height;
  right_canvas.width = diff_width;
  right_canvas.height = diff_height;
  diff_canvas_b.width = diff_width;
  diff_canvas_b.height = diff_height;
  diff_canvas.width = diff_width;
  diff_canvas.height = diff_height;
  diff_canvas2.width = diff_width;
  diff_canvas2.height = diff_height;

  const left_ctx = left_canvas.getContext("2d");
  const right_ctx = right_canvas.getContext("2d");
  const diff_b_ctx = diff_canvas_b.getContext("2d");
  const diff_ctx = diff_canvas.getContext("2d");
  const diff_ctx2 = diff_canvas2.getContext("2d");

  right_ctx.putImageData(right_img_data, 0, 0);
  left_ctx.putImageData(left_img_data, 0, 0);
  diff_ctx.putImageData(left_img_data, 0, 0);
  diff_ctx2.putImageData(left_img_data, 0, 0);

  diff_b_ctx.fillStyle = 'black';
  diff_b_ctx.fillRect(0, 0, diff_width, diff_height);

  const r_data = left_ctx.getImageData(0, 0, left_canvas.width, left_canvas.height).data;
  const g_data = diff_ctx.getImageData(0, 0, left_canvas.width, left_canvas.height).data;
  const b_data = diff_ctx2.getImageData(0, 0, left_canvas.width, left_canvas.height).data;
  const a_data = diff_b_ctx.getImageData(0, 0, left_canvas.width, left_canvas.height).data;

  for (let y = 0; y < diff_height; y++) {
    for (let x = 0; x < diff_width; x++) {
      const left_px = get_pixel(left_img_data.data, x, y, left_canvas.width);
      const right_px = get_pixel(right_img_data.data, x, y, right_canvas.width);

      if (!colour_match(left_px, right_px)) {
        set_pixel(r_data, [255, 0, 0], x, y, left_canvas.width);
        set_pixel(g_data, [0, 255, 0], x, y, left_canvas.width);
        set_pixel(b_data, [0, 0, 255], x, y, left_canvas.width);
        set_pixel(a_data, right_px, x, y, left_canvas.width);
      }
    }
  }

  left_ctx.putImageData(new ImageData(r_data, left_canvas.width, left_canvas.height), 0, 0);
  diff_ctx.putImageData(new ImageData(g_data, left_canvas.width, left_canvas.height), 0, 0);
  diff_ctx2.putImageData(new ImageData(b_data, left_canvas.width, left_canvas.height), 0, 0);
  diff_b_ctx.putImageData(new ImageData(a_data, left_canvas.width, left_canvas.height), 0, 0);

  left_canvas.style.display = 'inline';
  diff_canvas.style.display = 'none';
  diff_canvas2.style.display = 'none';

  c.appendChild(left_canvas);
  c.appendChild(diff_canvas);
  c.appendChild(diff_canvas2);
  c.appendChild(diff_canvas_b);

  cycle = setInterval(() => {
    cnum = (cnum + 1) % 3;

    left_canvas.style.display = 'none';
    diff_canvas.style.display = 'none';
    diff_canvas2.style.display = 'none';

    switch (cnum) {
      case 0:
        left_canvas.style.display = 'inline';
        break;
      case 1:
        diff_canvas.style.display = 'inline';
        break;
      case 2:
        diff_canvas2.style.display = 'inline';
        break;
    }
  }, 1000);
};

document.onpaste = (event) => {
  const items = (event.clipboardData ?? event.originalEvent.clipboardData).items;
  for (const item of items) {
    if (item.kind === "file") {
      const blob = item.getAsFile();
      spot_diff(blob);
    }
  }
};
