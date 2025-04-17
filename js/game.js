const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = config.canvas.width;
canvas.height = config.canvas.height;

const player = new Player(canvas);
const inputHandler = new InputHandler(player);
const trees = [new Tree(canvas, 200), new Tree(canvas, 400), new Tree(canvas, 600)];
const bears = [new Bear(canvas)];

let gameState = 'forest';
let score = 0;
let lastTime = 0;
let keys = {};
let woodCount = 0;

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'f') {
        trees.forEach(tree => {
            if (tree.isHit(player)) {
                tree.startChopping();
            }
        });
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        player.stop();
    }
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
}

function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'forest') {
        trees.forEach((tree, index) => {
            tree.draw();
            if (tree.update(deltaTime)) {
                trees.splice(index, 1);
                woodCount += 1;
                score += 10;
            }
        });

        bears.forEach(bear => {
            bear.draw();
            bear.update();
            if (bear.isHit(player)) {
                console.log('Game Over!');
            }
        });
    }

    inputHandler.update();
    player.draw();
    player.update(deltaTime);
    drawUI();

    requestAnimationFrame(gameLoop);
}

gameLoop(0); 