class Tree {
    constructor(canvas, x, isOak = false) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = canvas.height * config.player.groundLevel - config.tree.height;
        this.width = config.tree.width;
        this.height = config.tree.height;
        this.health = isOak ? config.tree.oakHealth : config.tree.health;
        this.isBeingChopped = false;
        this.chopTimer = 0;
        this.chopInterval = 0.5;
        this.isOak = isOak;
        this.shakeTimer = 0;
        this.chopSound = document.getElementById('chopSound');
    }

    draw(cameraX) {
        const offsetX = this.shakeTimer > 0 ? Math.sin(this.shakeTimer * 50) * 2 : 0;
        this.ctx.fillStyle = this.isOak ? 'darkbrown' : 'brown';
        this.ctx.fillRect(this.x - cameraX + offsetX, this.y, this.width, this.height);
        this.ctx.fillStyle = this.isOak ? 'darkgreen' : 'green';
        this.ctx.beginPath();
        this.ctx.arc(this.x - cameraX + this.width/2 + offsetX, this.y - 20, 30, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.isBeingChopped) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fillRect(this.x - cameraX + offsetX, this.y - 20, this.width, 10);
        }
    }

    update(deltaTime) {
        if (this.isBeingChopped) {
            this.chopTimer += deltaTime / 1000;
            this.shakeTimer = 0.2;
            if (this.chopTimer >= this.chopInterval) {
                this.chopTimer = 0;
                this.health -= 20;
                try {
                    this.chopSound.currentTime = 0;
                    this.chopSound.play();
                } catch (e) {
                    console.warn('Chop sound failed:', e);
                }
                if (this.health <= 0) {
                    return true;
                }
            }
        }
        if (this.shakeTimer > 0) {
            this.shakeTimer -= deltaTime / 1000;
        }
        return false;
    }

    isHit(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }

    startChopping() {
        this.isBeingChopped = true;
    }

    stopChopping() {
        this.isBeingChopped = false;
        this.chopTimer = 0;
    }
}
