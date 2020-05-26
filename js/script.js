const fire = {
    arr: [],
    width: 0,
    height: 0
};

const canvas = {
    el: null,
    ctx: null,
    pxSize: 10
};

let __debugTime = false;

window.onresize = resizeCanvas;

function setup() {
    canvas.el = document.getElementById('canvas');
    canvas.ctx = canvas.el.getContext('2d');
    resizeCanvas();
    createData();
    renderFire();
    changeHue();
    setInterval(calculateFire, 20);
    setInterval(changeHue, 60 * 1000);
}

function createData() {
    fire.arr = [];
    const n = fire.width * fire.height;
    for (let i = 0; i < n; i++) {
        fire.arr[i] = 0;
    }
    createFireBase();

    function createFireBase() {
        for (let i = 0; i < fire.width; i++) {
            fire.arr[fire.width * fire.height - fire.width + i] = 36;
        }
    }
}

function calculateFire() {
    for (let i = 0; i < fire.width; i++) {
        for (let j = 0; j < fire.height; j++) {
            updateFireIntensity(fire.width * j + i);
        }
    }
    renderFire();

    function updateFireIntensity(pos) {
        const n = pos + fire.width;
        if (n >= fire.width * fire.height) return;
        const decay = Math.floor(Math.random() * 2);
        const val = fire.arr[n] - decay;
        fire.arr[pos - decay > 0 ? pos - decay : 0] = val < 0 ? 0 : val;
    }
}

function renderFire() {
    for (let i = 0; i < fire.height; i++) {
        for (let j = 0; j < fire.width; j++) {
            const index = fire.arr[i * fire.width + j];
            const color = palette[index];
            canvas.ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
            canvas.ctx.fillRect(j * canvas.pxSize, i * canvas.pxSize, canvas.pxSize, canvas.pxSize);
        }
    }
}

function resizeCanvas() {
    canvas.el.width = window.innerWidth;
    canvas.el.height = window.innerHeight - 40;
    fire.width = Math.ceil(window.innerWidth / 10);
    fire.height = Math.ceil((window.innerHeight - 40) / 10);
    createData();
}

function changeHue() {
    if (__debugTime) return;
    const d = new Date();
    const t = d.getHours() * 60 + d.getMinutes();
    canvas.el.style.filter = `hue-rotate(${((t * 180) / 720) - 180}deg)`;
}

function setHour(hour, minutes) {
    if (hour === undefined || !minutes === undefined) {
        __debugTime = false;
        return;
    }
    __debugTime = true;
    const t = hour * 60 + minutes;
    canvas.el.style.filter = `hue-rotate(${((t * 180) / 720) - 180}deg)`;
}