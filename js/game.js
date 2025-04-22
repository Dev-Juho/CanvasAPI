const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas resizing
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize game objects
const player = new Player(canvas);
const inputHandler = new InputHandler(player);
const trees = [
    new Tree(canvas, canvas.width * 0.25),
    new Tree(canvas, canvas.width * 0.5),
    new Tree(canvas, canvas.width * 0.75)
];
const bears = [new Bear(canvas)];

let gameState = 'forest';
let score = 0;
let woodCount = 0;
let lastTime = 0;

// Initialize parallax layers
config.layers.forEach(layer => {
    layer.image = new Image();
    layer.image.src = layer.src;
    layer.x = 0;
    layer.width = 0;
    layer.height = 0;
});

// Input handling for tree chopping
document.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
        trees.forEach(tree => {
            if (tree.isHit(player)) {
                tree.startChopping();
            }
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'f') {
        trees.forEach(tree => {
            tree.stopChopping();
        });
    }
});

function drawUI() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Puuta: ${woodCount}`, 10, 30);
    ctx.fillText(`Pisteet: ${score}`, 10, 60);
    ctx.fillText(`Elämä: ${player.health}`, 10, 90); // Added health display
}

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw parallax layers
    config.layers.forEach(layer => {
        if (layer.width > 0 && layer.image.complete) {
            const drawY = (canvas.height - layer.height) / 2;
            ctx.drawImage(layer.image, layer.x, drawY, layer.width, layer.height);
            ctx.drawImage(layer.image, layer.x + layer.width, drawY, layer.width, layer.height);
            ctx.drawImage(layer.image, layer.x - layer.width, drawY, layer.width, layer.height);
        }
    });

    if (gameState === 'forest') {
        // Draw and update trees
        trees.forEach((tree, index) => {
            tree.draw();
            if (tree.update(deltaTime)) {
                trees.splice(index, 1);
                woodCount += 1;
                score += 10;
            }
        });

        // Draw and update bears
        bears.forEach(bear => {
            bear.draw();
            bear.update();
            if (bear.isHit(player)) {
                player.takeDamage(10); // Reduce health by 10
                score -= 20; // Reduce score by 20
                if (score < 0) score = 0;
                bear.x = canvas.width * 0.75; // Reset bear position
            }
        });

        // Check for game over
        if (player.health <= 0) {
            console.log('Game Over!');
            gameState = 'gameover'; // Stop updates
        }
    }

    if (gameState !== 'gameover') {
        inputHandler.update();
        player.draw();
        player.update(deltaTime);
        drawUI();
    }

    requestAnimationFrame(gameLoop);
}

// Wait for layer images to load before starting
let loadedImages = 0;
config.layers.forEach(layer => {
    layer.image.onload = () => {
        layer.width = layer.image.naturalWidth;
        layer.height = layer.image.naturalHeight;
        loadedImages++;
        if (loadedImages === config.layers.length) {
            gameLoop(0);
        }
    };
    layer.image.onerror = () => {
        console.error(`Failed to load image: ${layer.src}`);
    };
});
