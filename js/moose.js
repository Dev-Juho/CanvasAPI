class Moose {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width * (0.2 + Math.random() * 0.6);
        this.y = canvas.height * config.player.groundLevel - config.moose.height;
        this.width = config.moose.width;
        this.height = config.moose.height;
        this.speed = config.moose.speed;
        this.image = new Image();
        this.image.src = 'assets/hirvi.png';
        this.facingRight = Math.random() < 0.5;
        this.direction = this.facingRight ? 1 : -1;
        this.isFleeing = false;
        this.directionTimer = 0;
        this.jumpIDs = new Set();
        this.chargeTimer = 0;
        this.isCharging = false;
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

    update(deltaTime, player) {
        this.chargeTimer += deltaTime / 1000;
        
        const distanceToPlayer = Math.abs(this.x - player.x);
        if (distanceToPlayer < config.moose.chargeDistance && this.chargeTimer >= config.moose.chargeInterval) {
            this.isCharging = true;
            this.chargeTimer = 0;
        }

        let currentSpeed = this.speed;
        if (this.isCharging) {
            currentSpeed = this.speed * config.moose.chargeSpeedMultiplier;
            if (this.chargeTimer >= config.moose.chargeDuration) {
                this.isCharging = false;
            }
        }

        this.x += currentSpeed * this.direction;

        if (!this.isCharging) {
            this.directionTimer += deltaTime / 1000;
            if (this.directionTimer >= config.moose.directionChangeInterval) {
                this.direction = Math.random() < 0.5 ? 1 : -1;
                this.facingRight = this.direction === 1;
                this.directionTimer = 0;
            }
        }

        if (this.x < 0) {
            this.x = 0;
            this.direction = 1;
            this.facingRight = true;
        } else if (this.x > this.canvas.width * 2) {
            this.x = this.canvas.width * 2;
            this.direction = -1;
            this.facingRight = false;
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
                if (!this.jumpIDs.has(id)) {
                    this.jumpIDs.add(id);
                    return true;
                }
            }
        }
        return false;
    }
} 