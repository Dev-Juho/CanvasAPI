class Bear {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width * (0.2 + Math.random() * 0.6);
        this.y = canvas.height * config.player.groundLevel - config.bear.height;
        this.width = config.bear.width;
        this.height = config.bear.height;
        this.speed = config.bear.speedMin + Math.random() * (config.bear.speedMax - config.bear.speedMin);
        this.image = new Image();
        this.image.src = 'assets/karhu.png';
        this.image.onerror = () => console.warn('Failed to load bear image');
        this.facingRight = Math.random() < 0.5;
        this.direction = this.facingRight ? 1 : -1;
        this.directionTimer = 0;
        this.jumpIDs = new Set();
    }

    draw(cameraX) {
        if (!this.ctx) return;
        try {
            if (this.image.complete) {
                if (this.facingRight) {
                    this.ctx.save();
                    this.ctx.scale(-1, 1);
                    this.ctx.drawImage(
                        this.image,
                        -this.x + cameraX - this.width, this.y, this.width, this.height
                    );
                    this.ctx.restore();
                } else {
                    this.ctx.drawImage(
                        this.image,
                        this.x - cameraX, this.y, this.width, this.height
                    );
                }
            } else {
                this.ctx.fillStyle = 'gray';
                this.ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            }
        } catch (e) {
            console.warn('Bear draw error:', e);
        }
    }

    update(deltaTime, player) {
        if (!this.canvas || !player) return;
        this.directionTimer += deltaTime;
        if (this.directionTimer >= config.bear.directionChangeInterval) {
            this.direction = Math.random() < 0.5 ? 1 : -1;
            this.facingRight = this.direction === 1;
            this.directionTimer = 0;
        }
        this.x += this.speed * this.direction * (deltaTime / 16.67);
        if (this.x < inputHandler.cameraX - this.canvas.width) {
            this.x = inputHandler.cameraX - this.canvas.width;
            this.direction = 1;
            this.facingRight = true;
        } else if (this.x > inputHandler.cameraX + this.canvas.width * 2) {
            this.x = inputHandler.cameraX + this.canvas.width * 2;
            this.direction = -1;
            this.facingRight = false;
        }
    }

    isHit(player) {
        if (!player) return false;
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y + player.height > this.y &&
               player.y < this.y + this.height;
    }

    isJumpedOver(player) {
        if (!player) return false;
        if (player.jumping &&
            player.x + player.width > this.x &&
            player.x < this.x + this.width &&
            player.y + player.height < this.y) {
            for (let id of player.jumpID) {
                if (!this.jumpIDs.has(id)) {
                    this.jumpIDs.add(id);
                    return true;
                }
            }
        }
        return false;
    }
}
