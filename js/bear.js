class Bear {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width * (0.2 + Math.random() * 0.6);
        this.y = canvas.height * config.player.groundLevel - config.bear.height;
        this.width = config.bear.width;
        this.height = config.bear.height;
        this.speed = config.bear.speed;
        this.image = new Image();
        this.image.src = 'assets/karhu.png';
        this.facingRight = Math.random() < 0.5;
        this.direction = this.facingRight ? 1 : -1;
        this.isFleeing = false;
        this.directionTimer = 0;
    }

    draw(cameraX) {
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
            this.ctx.fillStyle = 'brown';
            this.ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        }
    }

    update(deltaTime) {
        const speed = this.isFleeing ? this.speed * config.bear.fleeSpeedMultiplier : this.speed;
        this.x += speed * this.direction;

        if (!this.isFleeing) {
            this.directionTimer += deltaTime / 1000;
            if (this.directionTimer >= config.bear.directionChangeInterval || 
                this.x <= 0 || this.x >= this.canvas.width * 2) {
                this.direction = Math.random() < 0.5 ? 1 : -1;
                this.facingRight = this.direction === 1;
                this.directionTimer = 0;
            }
        }
    }

    isHit(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y + player.height > this.y &&
               player.y < this.y + this.height;
    }

    isJumpedOver(player) {
        if (player.jumping && 
            player.x + player.width > this.x && 
            player.x < this.x + this.width && 
            player.y + player.height < this.y) {
            for (let id of player.jumpID) {
                if (!this.jumpIDs || !this.jumpIDs.has(id)) {
                    this.jumpIDs = this.jumpIDs || new Set();
                    this.jumpIDs.add(id);
                    return true;
                }
            }
        }
        return false;
    }
}
