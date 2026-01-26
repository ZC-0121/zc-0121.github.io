// animation.js

// Variables to track state
let animationFrameId;
let timeoutId;
let isRunning = false;
let canvas, ctx, startElem;
let seekers = [];
let target = { x: 0, y: 0 };

// Configuration
const GRID_SIZE = 20;
const SPEED = 30;
const LINE_COLOR = '#222222';
const TARGET_SIZE = 20;

export function startAnimation() {
    // Prevent multiple instances running at once
    if (isRunning) return;
    
    canvas = document.getElementById('gridCanvas');
    if (!canvas) return; // Safety check
    
    ctx = canvas.getContext('2d');
    startElem = document.getElementById('banner-content');
    
    isRunning = true;
    
    // Add resize listener specific to animation
    window.addEventListener('resize', resize);
    
    // Initial setup
    resize();
    update();
}

export function stopAnimation() {
    isRunning = false;
    
    // Clean up listeners
    window.removeEventListener('resize', resize);
    
    // Cancel pending frames/timers
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (timeoutId) clearTimeout(timeoutId);
    
    // Clear the canvas so lines don't stay frozen on screen
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function resize() {
    if (!canvas || !canvas.parentElement) return;

    // Set canvas to exact pixel size of the banner
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    // Reset seekers
    seekers = [];
    spawnTarget();
    startSeeker();
    startSeeker();
    startSeeker();
    startSeeker();  
}

function spawnTarget() {
    const minX = canvas.width * 0.6; 
    const maxX = canvas.width - TARGET_SIZE - 20;
    const minY = 20;
    const maxY = canvas.height - TARGET_SIZE - 20;

    target.x = Math.floor((Math.random() * (maxX - minX) + minX) / GRID_SIZE) * GRID_SIZE;
    target.y = Math.floor((Math.random() * (maxY - minY) + minY) / GRID_SIZE) * GRID_SIZE;

    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 2;
    ctx.strokeRect(target.x, target.y, TARGET_SIZE, TARGET_SIZE);
}

function startSeeker() {
    if (!startElem) return;
    
    const rect = startElem.getBoundingClientRect();
    const bannerRect = canvas.parentElement.getBoundingClientRect();

    const startX = (rect.left - bannerRect.left) + (rect.width / 2);
    const startY = (rect.top - bannerRect.top) + (rect.height / 2);

    const gridX = Math.floor(startX / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.floor(startY / GRID_SIZE) * GRID_SIZE;

    seekers.push({
        current: { x: gridX, y: gridY },
        active: true
    });
}

function update() {
    if (!isRunning) return;

    seekers.forEach(seeker => {
        if (!seeker.active) return;

        const curr = seeker.current;
        
        // Check Collision
        if (curr.x >= target.x - 5 && curr.x <= target.x + TARGET_SIZE + 5 &&
            curr.y >= target.y - 5 && curr.y <= target.y + TARGET_SIZE + 5) {
            seeker.active = false;
            return;
        }

        // Movement Logic
        let moveX = 0;
        let moveY = 0;
        const distX = target.x - curr.x;
        const distY = target.y - curr.y;

        const goRandom = Math.random() < 0.1; 

        if (goRandom) {
            const r = Math.random();
            if (r < 0.5) moveX = (Math.random() < 0.5 ? -1 : 1) * GRID_SIZE;
            else moveY = (Math.random() < 0.5 ? -1 : 1) * GRID_SIZE;
        } else {
            if (Math.abs(distX) > Math.abs(distY)) {
                moveX = Math.sign(distX) * GRID_SIZE;
            } else {
                moveY = Math.sign(distY) * GRID_SIZE;
            }
        }

        const nextX = curr.x + moveX;
        const nextY = curr.y + moveY;

        ctx.beginPath();
        ctx.moveTo(curr.x, curr.y);
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 2;
        ctx.stroke();

        seeker.current = { x: nextX, y: nextY };
    });

    // Loop
    timeoutId = setTimeout(() => {
        animationFrameId = requestAnimationFrame(update);
    }, SPEED);
}