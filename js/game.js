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
let trees = [];
let bears = [];
let moose = [];
let projectiles = [];
let brokenTrees = [];
let lastRestoreTime = 0;
const RESTORE_INTERVAL = 5000;

for (let i = 0; i < 5; i++) {
    trees.push(new Tree(canvas));
}

let gameState = 'forest';
let score = 0;
let woodCount = 0;
let lastTime = 0;
let bearSpawnTimer = 0;
let mooseSpawnTimer = 0;
let lastChopTime = 0;

config.layers.forEach(layer => {
    layer.image = new Image();
    layer.image.src = layer.src;
    layer.x = 0;
    layer.width = 0;
    layer.height = 0;
});

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
        trees.forEach(tree => {
            if (tree.isHit(player)) {
                tree.startChopping(player);
            }
        });
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'f') {
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
    player.velocityX = 0;
    player.isDead = false;

    score = 0;
    woodCount = 0;
    lastChopTime = 0;

    bears.length = 0;
    bears.push(new Bear(canvas));
    
    moose.length = 0;
    moose.push(new Moose(canvas));

    trees.length = 0;
    for (let i = 0; i < 5; i++) {
        trees.push(new Tree(canvas));
    }

    projectiles.length = 0;
    inputHandler.cameraX = 0;
    bearSpawnTimer = 0;
    mooseSpawnTimer = 0;

    gameState = 'forest';
}

function spawnTree() {
    const minX = inputHandler.cameraX + canvas.width;
    const maxX = inputHandler.cameraX + canvas.width * 2;
    
    if (trees.length > 0) {
        const lastTree = trees.reduce((max, tree) => tree.x > max.x ? tree : max, trees[0]);
        const tree = new Tree(canvas);
        tree.x = Math.max(lastTree.x + 800, minX);
        trees.push(tree);
    } else {
        const tree = new Tree(canvas);
        tree.x = minX;
        trees.push(tree);
    }
}

function gameLoop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.update(deltaTime);
    inputHandler.update();

    config.layers.forEach(layer => {
        if (layer.width > 0 && layer.image.complete) {
            const drawY = (canvas.height - layer.height) / 2;
            
            let layerX = -(inputHandler.cameraX * layer.speed) % layer.width;
            if (layerX > 0) layerX -= layer.width;

            let currentX = layerX;
            while (currentX < canvas.width) {
                ctx.drawImage(layer.image, currentX, drawY, layer.width, layer.height);
                currentX += layer.width;
            }
        }
    });

    for (let i = trees.length - 1; i >= 0; i--) {
        const tree = trees[i];
        tree.update(deltaTime);
        tree.draw(inputHandler.cameraX);
        
        if (tree.x < inputHandler.cameraX - canvas.width) {
            trees.splice(i, 1);
        }
    }

    if (trees.length === 0 || trees[trees.length - 1].x < inputHandler.cameraX + canvas.width * 1.5) {
        spawnTree();
    }

    for (let i = bears.length - 1; i >= 0; i--) {
        const bear = bears[i];
        bear.update(deltaTime, player);
        bear.draw(inputHandler.cameraX);
        
        if (bear.isHit(player)) {
            player.takeDamage(config.bear.damage);
        }
        
        if (bear.x < inputHandler.cameraX - canvas.width) {
            bears.splice(i, 1);
        }
    }

    if (bears.length < config.bear.maxBears) {
        if (bears.length === 0 || bears[bears.length - 1].x < inputHandler.cameraX + canvas.width * 1.5) {
            const bear = new Bear(canvas);
            if (bears.length === 0) {
                bear.x = inputHandler.cameraX + canvas.width * 1.2;
            } else {
                bear.x = bears[bears.length - 1].x + 1200;
            }
            bears.push(bear);
        }
    }

    for (let i = moose.length - 1; i >= 0; i--) {
        const m = moose[i];
        m.update(deltaTime, player);
        m.draw(inputHandler.cameraX);
        
        if (m.isHit(player)) {
            player.takeDamage(config.moose.damage);
        }
        
        if (m.x < inputHandler.cameraX - canvas.width) {
            moose.splice(i, 1);
        }
    }

    if (moose.length < config.moose.maxMoose) {
        if (moose.length === 0 || moose[moose.length - 1].x < inputHandler.cameraX + canvas.width * 1.5) {
            const newMoose = new Moose(canvas);
            if (moose.length === 0) {
                newMoose.x = inputHandler.cameraX + canvas.width * 1.5;
            } else {
                newMoose.x = moose[moose.length - 1].x + 1500;
            }
            moose.push(newMoose);
        }
    }

    player.draw(inputHandler.cameraX);
    drawUI();

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

