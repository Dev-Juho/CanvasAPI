const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let player, inputHandler, trees = [], bears = [], moose = [], projectiles = [], woodCount = 0, score = 0
let lastTime = 0, bearSpawnTimer = 0, mooseSpawnTimer = 0, lastChopTime = 0;
let gameState = 'gamestart';

const startscreen = document.getElementById('startscreen');
const startbutton = document.getElementById('startbutton');

startbutton.addEventListener('click', () => {
    gameState = 'forest';
    flashScreen(() => {
        startscreen.classList.add('hidden');
        canvas.classList.remove('hidden');
        
        resetGame();
        requestAnimationFrame(gameLoop);
    });
    
});
class Projectile {
    constructor(x, y, facingRight) {
        this.x = x;
        this.y = y;
        this.width = config.projectile.width;
        this.height = config.projectile.height;
        this.speed = 10;
        this.lifetime = 2;
        this.facingRight = facingRight;
    }
    update(deltaTime) {
        this.x += this.speed * (this.facingRight ? 1 : -1) * (deltaTime / 16.67);
        this.lifetime -= deltaTime / 1000;
    }
    draw(cameraX) {
        if (!ctx) return;
        try {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        } catch (e) {
            console.warn('Projectile draw error:', e);
        }
    }
    isHit(entity) {
        return this.x < entity.x + entity.width &&
               this.x + this.width > entity.x &&
               this.y < entity.y + entity.height &&
               this.y + this.height > entity.y;
    }
}

function resizeCanvas() {
    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;
}

function drawUI() {
    try {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Puuta: ${woodCount}`, 10, 30);
        ctx.fillText(`Pisteet: ${score}`, 10, 60);
        ctx.fillText(`Elämä: ${player.health}`, 10, 90);
    } catch (e) {
        console.warn('UI draw error:', e);
    }
}

function resetGame() {
    try {
        player.health = config.player.health;
        player.x = config.player.x;
        player.y = canvas.height * config.player.groundLevel - player.height;
        player.jumping = false;
        player.crouching = false;
        player.velocityX = 0;
        player.velocityY = 0;
        player.isDead = false;
        score = 0;
        woodCount = 0;
        lastChopTime = 0;
        bears = [];
        moose = [];
        trees = [];
        projectiles = [];
        bears.push(new Bear(canvas));
        moose.push(new Moose(canvas));
        for (let i = 0; i < 5; i++) spawnTree();
        inputHandler.cameraX = 0;
        bearSpawnTimer = 0;
        mooseSpawnTimer = 0;
    } catch (e) {
        console.error('Reset game error:', e);
    }
}

function spawnTree() {
    try {
        const minX = inputHandler.cameraX + canvas.width * config.tree.minSpawnX;
        const maxX = inputHandler.cameraX + canvas.width * config.tree.maxSpawnX;
        if (trees.length > 0) {
            const lastTree = trees.reduce((max, tree) => tree.x > max.x ? tree : max, trees[0]);
            const tree = new Tree(canvas);
            tree.x = Math.max(lastTree.x + config.tree.minSpacing, minX);
            trees.push(tree);
        } else {
            const tree = new Tree(canvas);
            tree.x = minX + Math.random() * (maxX - minX);
            trees.push(tree);
        }
    } catch (e) {
        console.warn('Spawn tree error:', e);
    }
}

function gameLoop(timestamp) {
    try {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = Math.min(timestamp - lastTime, 100);
        lastTime = timestamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update(deltaTime);
        inputHandler.update(deltaTime);

        config.layers.forEach(layer => {
            if (layer.image.complete) {
                const layerX = -(inputHandler.cameraX * layer.speed) % layer.width;
                ctx.drawImage(layer.image, layerX, 0, layer.width, layer.height);
                ctx.drawImage(layer.image, layerX + layer.width, 0, layer.width, layer.height);
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
        
        if (gameState === 'forest'){
            bearSpawnTimer += deltaTime;

            if (bearSpawnTimer >= config.bear.spawnInterval && bears.length < config.bear.maxBears) {
                const bear = new Bear(canvas);
                bear.x = bears.length > 0 ? bears.reduce((max, b) => b.x > max.x ? b : max, bears[0]).x + 1200 : inputHandler.cameraX + canvas.width * 1.2;
                bears.push(bear);
                bearSpawnTimer = 0;
            }
            mooseSpawnTimer += deltaTime;
            if (mooseSpawnTimer >= config.moose.spawnInterval && moose.length < config.moose.maxMoose) {
                const mooseObj = new Moose(canvas);
                mooseObj.x = moose.length > 0 ? moose.reduce((max, m) => m.x > max.x ? m : max, moose[0]).x + 1500 : inputHandler.cameraX + canvas.width * 1.5;
                moose.push(mooseObj);
                mooseSpawnTimer = 0;
            }
        }
        

        for (let i = bears.length - 1; i >= 0; i--) {
            const bear = bears[i];
            bear.update(deltaTime, player);
            bear.draw(inputHandler.cameraX);
            if (bear.isHit(player)) {
                score = player.takeDamage(config.bear.damage, score, 'bear');
                try {
                    const bearHitSound = document.getElementById('bearHitSound');
                    bearHitSound.currentTime = 0;
                    bearHitSound.play();
                } catch (e) {
                    console.warn('Bear hit sound failed:', e);
                }
                if (player.health <= 0) {
                    gameState = 'gameover';
                    setTimeout(resetGame, 2000);
                }
            }
            if (bear.isJumpedOver(player)) {
                score += config.player.jumpOverPoints;
                bears.splice(i, 1);
                try {
                    const jumpSound = document.getElementById('jumpSound');
                    jumpSound.currentTime = 0;
                    jumpSound.play();
                } catch (e) {
                    console.warn('Jump sound failed:', e);
                }
                continue;
            }
            if (bear.x < inputHandler.cameraX - canvas.width) {
                bears.splice(i, 1);
            }
        }

        

        for (let i = moose.length - 1; i >= 0; i--) {
            const m = moose[i];
            m.update(deltaTime, player);
            m.draw(inputHandler.cameraX);
            if (m.isHit(player)) {
                score = player.takeDamage(config.moose.damage, score, 'moose');
                try {
                    const mooseHitSound = document.getElementById('mooseHitSound');
                    mooseHitSound.currentTime = 0;
                    mooseHitSound.play();
                } catch (e) {
                    console.warn('Moose hit sound failed:', e);
                }
                if (player.health <= 0) {
                    gameState = 'gameover';
                    setTimeout(resetGame, 2000);
                }
            }
            if (m.isJumpedOver(player)) {
                score += config.player.jumpOverPoints;
                moose.splice(i, 1);
                try {
                    const jumpSound = document.getElementById('jumpSound');
                    jumpSound.currentTime = 0;
                    jumpSound.play();
                } catch (e) {
                    console.warn('Jump sound failed:', e);
                }
                continue;
            }
            if (m.x < inputHandler.cameraX - canvas.width) {
                moose.splice(i, 1);
            }
        }

        if (player.attackTimer > 0 && projectiles.length === 0) {
            const projectileY = player.y + player.height / 2 - config.projectile.height / 2;
            projectiles.push(new Projectile(player.x, projectileY, player.facingRight));
            try {
                const attackSound = document.getElementById('attackSound');
                attackSound.currentTime = 0;
                attackSound.play();
            } catch (e) {
                console.warn('Attack sound failed:', e);
            }
        }
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            p.update(deltaTime);
            p.draw(inputHandler.cameraX);
            if (p.lifetime <= 0) {
                projectiles.splice(i, 1);
                continue;
            }
            for (let j = bears.length - 1; j >= 0; j--) {
                if (p.isHit(bears[j])) {
                    bears.splice(j, 1);
                    projectiles.splice(i, 1);
                    score += 50;
                    try {
                        const bearHitSound = document.getElementById('bearHitSound');
                        bearHitSound.currentTime = 0;
                        bearHitSound.play();
                    } catch (e) {
                        console.warn('Bear hit sound failed:', e);
                    }
                    break;
                }
            }
            for (let j = moose.length - 1; j >= 0; j--) {
                if (p.isHit(moose[j])) {
                    moose.splice(j, 1);
                    projectiles.splice(i, 1);
                    score += 50;
                    try {
                        const mooseHitSound = document.getElementById('mooseHitSound');
                        mooseHitSound.currentTime = 0;
                        mooseHitSound.play();
                    } catch (e) {
                        console.warn('Moose hit sound failed:', e);
                    }
                    break;
                }
            }
        }
        
        player.draw(inputHandler.cameraX);
        drawUI();

        if (woodCount >= config.score.victoryWood) {
            gameState = 'victory';
            ctx.fillStyle = 'black';
            ctx.font = '40px Arial';
            ctx.fillText('Now we can go to sauna and drink beer!', canvas.width / 2 - 200, canvas.height / 2);
            showVictoryVideo();
            return;
        }

        if (gameState === 'gameover') {
            ctx.fillStyle = 'black';
            ctx.font = '40px Arial';
            ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
            setTimeout(resetGame, 2000);
            return;
        }
        
    } catch (e) {
        console.error('Game loop error:', e);
    }
    requestAnimationFrame(gameLoop);
}

const videoContainer = document.getElementById('videocontainer');
const victoryvideo = document.getElementById('victoryvideo');
const endScreen = document.getElementById('endscreen');
const restartButton = document.getElementById('restartbutton');
function showVictoryVideo() {
    flashScreen(() => {
        canvas.classList.add('hidden');
        videoContainer.classList.remove('hidden');
        victoryvideo.play();
    });
    
}

victoryvideo.addEventListener('ended', () => {
    flashScreen(() => {
        videoContainer.classList.add('hidden');
        endScreen.classList.remove('hidden');
    });
    
});

restartButton.addEventListener('click', () => {
    gameState = 'gamestart';
    if (gameState === 'gamestart') {
        flashScreen(() => {
            endScreen.classList.add('hidden');
            startscreen.classList.remove('hidden');
        });
        
    }
});



let loadedImages = 0;
config.layers.forEach(layer => {
    layer.image = new Image();
    layer.image.src = layer.src;
    layer.image.onerror = () => console.warn(`Failed to load layer: ${layer.src}`);
    layer.image.onload = () => {
        layer.width = layer.image.width;
        layer.height = layer.image.height;
        loadedImages++;
        if (loadedImages === config.layers.length) {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            player = new Player(canvas);
            inputHandler = new InputHandler(player, canvas);
            resetGame();
            document.addEventListener('keydown', e => {
                if (e.key.toLowerCase() === 'f') {
                    for (let tree of trees) {
                        if (tree.isHit(player)) {
                            tree.startChopping(player);
                            break;
                        }
                    }
                }
            });
            document.addEventListener('keyup', e => {
                if (e.key.toLowerCase() === 'f') {
                    for (let tree of trees) {
                        tree.stopChopping();
                    }
                }
            });
            requestAnimationFrame(gameLoop);
        }
    };
});
function flashScreen(callback) {
    const flash = document.getElementById('screenflash');

    flash.classList.remove('hidden');

    void flash.offsetWidth;

    flash.classList.add('show');

    setTimeout(() => {
        if (typeof callback === 'function') callback();

        flash.classList.remove('show');
        
        setTimeout(() => {
            flash.classList.add('hidden');
        }, 500);
    }, 500);
}