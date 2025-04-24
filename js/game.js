const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Projectile {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.width = config.projectile.width;
        this.height = config.projectile.height;
        this.speed = config.projectile.speed;
        this.lifetime = config.projectile.lifetime;
        this.facingRight = facingRight;
    }

    update(deltaTime) {
        this.x += this.speed * (this.facingRight ? 1 : -1);
        this.lifetime -= deltaTime / 1000;
    }

    draw(cameraX) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
    }

    isHit(bear) {
        return this.x < bear.x + bear.width &&
               this.x + this.width > bear.x &&
               this.y < bear.y + bear.height &&
               this.y + this.height > bear.y;
    }
}

const player = new Player(canvas);
const inputHandler = new InputHandler(player, canvas);
const trees = [
    new Tree(canvas, canvas.width * 0.25),
    new Tree(canvas, canvas.width * 0.5, true),
    new Tree(canvas, canvas.width * 0.75)
];
const bears = [new Bear(canvas)];
const projectiles = [];
let brokenTrees = 0;
let lastRestoreTime = 0;
const RESTORE_INTERVAL = 5000;

let gameState = 'forest';
let score = 0;
let woodCount = 0;
let lastTime = 0;
let bearSpawnTimer = 0;
let chopStreak = 0;
let lastChopTime = 0;

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
    ctx.fillText(`Chop Streak: ${chopStreak}`, 10, 120);
}

function resetGame() {
    player.health = config.player.health;
    player.x = config.player.x;
    player.y = canvas.height * config.player.groundLevel - config.player.height;
    player.jumping = false;
    player.crouching = false;
    player.velocityY = 0;
    player.velocityX = 0;
    player.wood = 0;
    player.jumpID.clear();

    score = 0;
    woodCount = 0;
    chopStreak = 0;
    lastChopTime = 0;

    bears.length = 0;
    bears.push(new Bear(canvas));

    trees.length = 0;
    trees.push(
        new Tree(canvas, canvas.width * 0.25),
        new Tree(canvas, canvas.width * 0.5, true),
        new Tree(canvas, canvas.width * 0.75)
    );

    projectiles.length = 0;
    inputHandler.cameraX = 0;
    bearSpawnTimer = 0;

    gameState = 'forest';
}

function spawnTree() {
    const x = canvas.width * (config.tree.minSpawnX + Math.random() * (config.tree.maxSpawnX - config.tree.minSpawnX));
    const isOak = Math.random() < 0.3;
    trees.push(new Tree(canvas, x, isOak));
}

function restoreTree() {
    const currentTime = Date.now();
    if (currentTime - lastRestoreTime < RESTORE_INTERVAL) {
        return;
    }

    for (let tree of trees) {
        if (tree.isBroken) {
            tree.restore();
            brokenTrees--;
            lastRestoreTime = currentTime;
            break;
        }
    }
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
            let layerX = layer.x - inputHandler.cameraX * layer.speed;
            while (layerX > layer.width) layerX -= layer.width * 2;
            while (layerX < -layer.width) layerX += layer.width * 2;
            ctx.drawImage(layer.image, layerX, drawY, layer.width, layer.height);
            ctx.drawImage(layer.image, layerX + layer.width, drawY, layer.width, layer.height);
            ctx.drawImage(layer.image, layerX - layer.width, drawY, layer.width, layer.height);
        }
    });

    bearSpawnTimer += deltaTime / 1000;
    if (bearSpawnTimer >= config.bear.spawnInterval && bears.length < config.bear.maxBears) {
        bears.push(new Bear(canvas));
        bearSpawnTimer = 0;
    }

    bears.forEach((bear, index) => {
        bear.update(deltaTime);
        bear.draw(inputHandler.cameraX);
        if (bear.isJumpedOver(player)) {
            score += config.player.jumpOverPoints;
            bear.isFleeing = true;
            bear.direction = 1;
            bear.facingRight = true;
        }
        if (bear.x > canvas.width * 2 && bear.isFleeing) {
            bears.splice(index, 1);
            return;
        }
        if (bear.isHit(player) && !bear.isFleeing && !player.jumpID.size) {
            score = player.takeDamage(10, score);
            if (player.health <= 0) {
                gameState = 'gameover';
                setTimeout(resetGame, 2000);
            }
        }
    });

    projectiles.forEach((projectile, pIndex) => {
        projectile.update(deltaTime);
        projectile.draw(inputHandler.cameraX);
        if (projectile.lifetime <= 0) {
            projectiles.splice(pIndex, 1);
            return;
        }
        bears.forEach((bear, bIndex) => {
            if (projectile.isHit(bear)) {
                bears.splice(bIndex, 1);
                projectiles.splice(pIndex, 1);
                score += 50;
                try {
                    const bearHitSound = document.getElementById('bearHitSound');
                    bearHitSound.currentTime = 0;
                    bearHitSound.play();
                } catch (e) {
                    console.warn('Bear hit sound failed:', e);
                }
            }
        });
    });

    if (gameState === 'forest') {
        for (let i = trees.length - 1; i >= 0; i--) {
            const tree = trees[i];
            tree.draw(inputHandler.cameraX);
            if (tree.update(deltaTime)) {
                brokenTrees++;
                woodCount += 1;
                chopStreak++;
                score += chopStreak * 10;
            }
        }

        if (brokenTrees > 0) {
            restoreTree();
        }
    }

    if (gameState !== 'gameover') {
        player.draw(inputHandler.cameraX);
        drawUI();
    } else {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Game starts again in 2 seconds...', canvas.width / 2 - 150, canvas.height / 2 + 40);
    }

    if (player.attackTimer > 0 && projectiles.length === 0) {
        const projectileY = player.y + player.height / 2 - config.projectile.height / 2;
        projectiles.push(new Projectile(player.x, projectileY, player.facingRight));
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
