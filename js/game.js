const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// peli objektiem alustus
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

config.layers.forEach(layer => {
    layer.image = new Image();
    layer.image.src = layer.src;
    layer.x = 0;
    layer.width = 0;
    layer.height = 0;
});

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
    ctx.fillText(`Elämä: ${player.health}`, 10, 90);
}

function resetGame() {
    player.health = config.player.health;
    player.x = config.player.x;
    player.y = canvas.height * config.player.groundLevel - config.player.height;
    player.jumping = false;
    player.crouching = false;
    player.velocityY = 0;
    player.wood = 0;

    score = 0;
    woodCount = 0;

    bears.length = 0;
    bears.push(new Bear(canvas));

    trees.length = 0;
    trees.push(
        new Tree(canvas, canvas.width * 0.25),
        new Tree(canvas, canvas.width * 0.5),
        new Tree(canvas, canvas.width * 0.75)
    );

    gameState = 'forest';
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(deltaTime);
    inputHandler.update();
    
    config.layers.forEach(layer => {
        if (layer.width > 0 && layer.image.complete) {
            const drawY = (canvas.height - layer.height) / 2;
            ctx.drawImage(layer.image, layer.x, drawY, layer.width, layer.height);
            ctx.drawImage(layer.image, layer.x + layer.width, drawY, layer.width, layer.height);
            ctx.drawImage(layer.image, layer.x - layer.width, drawY, layer.width, layer.height);
        }
    });

    bears.forEach(bear => {
        bear.update();
        bear.draw();
        if (bear.isJumpedOver(player)) {
            score += 1; // pisteen lisäys, nyt 1
        }
        if (bear.isHit(player)) {
            player.takeDamage(1); // voisiko tämän koko jutun optimisoda?
            if (player.health <= 0) {
                gameState = 'gameover';
                setTimeout(resetGame, 2000);
            }
        }
    });

    if (gameState === 'forest') {
        trees.forEach((tree, index) => {
            tree.draw();
            if (tree.update(deltaTime)) {
                trees.splice(index, 1);
                woodCount += 1;
                score += 10;
            }
        });
    }

    if (gameState !== 'gameover') {
        player.draw();
        drawUI();
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Game starts again in 2 seconds...', canvas.width / 2 - 150, canvas.height / 2 + 40);
    }

    requestAnimationFrame(gameLoop);
}

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
