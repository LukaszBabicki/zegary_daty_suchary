function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('clock').innerText = `Czas: ${hours}:${minutes}:${seconds}`;
}

function updateDates() {
    const now = new Date();
    const utc = now.toUTCString();
    const local = now.toString();
    document.getElementById('dates').innerHTML = `
        <p>Czas lokalny: ${local}</p>
        <p>Czas UTC: ${utc}</p>
    `;
}

async function fetchJoke() {
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
        const data = await response.json();
        document.getElementById('joke').innerText = data.joke;
    } catch (error) {
        document.getElementById('joke').innerText = 'Nie udało się pobrać suchara.';
    }
}

function drawClock(canvasId, time) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius);
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius, hour, minute, second);
    ctx.translate(-radius, -radius);
}

function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius * 0.15 + 'px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius, hour, minute, second) {
    let hourHand = (hour % 12) * Math.PI / 6 + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
    drawHand(ctx, hourHand, radius * 0.5, radius * 0.07);
    let minuteHand = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minuteHand, radius * 0.8, radius * 0.07);
    let secondHand = (second * Math.PI / 30);
    drawHand(ctx, secondHand, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function updateAnalogClocks() {
    const now = new Date();
    drawClock('local-clock', now);
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    drawClock('utc-clock', utcNow);
}

let pingInterval;

function startPing() {
    if (pingInterval) return;

    const output = document.getElementById('ping-output');
    output.innerText = ''; // Clear previous output

    pingInterval = setInterval(() => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ip = '8.8.8.8';
                const pingStart = Date.now();

                fetch(`https://api.allorigins.win/raw?url=http://${ip}`)
                    .then(() => {
                        const pingEnd = Date.now();
                        const pingTime = pingEnd - pingStart;
                        output.innerText += `Ping: ${pingTime} ms\n`;
                    })
                    .catch(() => {
                        output.innerText += 'Ping: błąd\n';
                    });
            })
            .catch(() => {
                output.innerText += 'Ping: błąd\n';
            });
    }, 3000);
}

function stopPing() {
    clearInterval(pingInterval);
    pingInterval = null;
}

setInterval(updateClock, 1000);
setInterval(updateDates, 1000);
setInterval(updateAnalogClocks, 1000);
updateClock();
updateDates();
updateAnalogClocks();
fetchJoke();
