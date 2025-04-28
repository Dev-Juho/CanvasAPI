class Moose {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width * (0.2 + Math.random() * 0.6);
        this.y = canvas.height * config.player.groundLevel - config.moose.height;
        this.width = config.moose.width;
        this.height = config.moose.height;
        this.speed = config.moose.speedMin + Math.random() * (config.moose.speedMax - config.moose.speedMin);
        this.image = new Image();
        this.image.src = 'assets/hirvi.png';
        this.image.onerror = () => console.warn('Failed to load moose image');
        this.facingRight = Math.random() < 0.5;
        this.direction = this.facingRight ? 1 : -1;
        this.directionTimer = 0;
        this.chargeTimer = 0;
        this.chargeDuration = 0;
        this.isCharging = false;
        this.jumpTimer = 0;
        this.jumping = false;
        this.velocityY = 0;
        this.jumpIDs = new Set();
    }

    draw(cameraX) {
        if (!this.ctx) return;
        try {
            if (this.image.complete) {
                if (!this.facingRight) {
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
        } catch (e) {
            console.warn('Moose draw error:', e);
        }
    }

    update(deltaTime, player) {
        if (!this.canvas || !player) return;

        this.directionTimer += deltaTime;
        this.chargeTimer += deltaTime;
        this.jumpTimer += deltaTime;

        if (this.directionTimer >= config.moose.directionChangeInterval) {
            this.direction = Math.random() < 0.5 ? 1 : -1;
            this.facingRight = this.direction === 1;
            this.directionTimer = 0;
        }

        const playerCenterX = player.x + player.width / 2;
        const mooseCenterX = this.x + this.width / 2;
        const distance = Math.abs(playerCenterX - mooseCenterX);

        if (this.chargeTimer >= config.moose.chargeInterval && distance < config.moose.chargeDistance && !this.isCharging) {
            this.isCharging = true;
            this.chargeDuration = 0;
            this.facingRight = playerCenterX > mooseCenterX;
            this.direction = this.facingRight ? 1 : -1;
        }

        if (this.isCharging) {
            this.chargeDuration += deltaTime;
            if (this.chargeDuration >= config.moose.chargeDuration) {
                this.isCharging = false;
                this.chargeTimer = 0;
            }
            this.x += this.speed * config.moose.chargeSpeedMultiplier * this.direction * (deltaTime / 16.67);
        } else {
            this.x += this.speed * this.direction * (deltaTime / 16.67);
        }

        if (this.jumpTimer >= config.moose.jumpInterval && !this.jumping && Math.random() < 0.5) {
            this.jump();
        }

        if (this.jumping) {
            this.velocityY += config.moose.gravity * (deltaTime / 16.67);
            this.y += this.velocityY * (deltaTime / 16.67);
            if (this.y >= this.canvas.height * config.player.groundLevel - this.height) {
                this.y = this.canvas.height * config.player.groundLevel - this.height;
                this.jumping = false;
                this.velocityY = 0;
            }
        }

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

    jump() {
        try {
            this.jumping = true;
            this.velocityY = -config.moose.jumpForce;
        } catch (e) {
            console.warn('Moose jump error:', e);
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
