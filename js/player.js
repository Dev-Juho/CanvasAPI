class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = config.player.x;
        this.y = canvas.height * config.player.groundLevel - config.player.height;
        this.width = config.player.width;
        this.height = config.player.height;
        this.speed = config.player.speed;
        this.jumping = false;
        this.crouching = false;
        this.jumpForce = config.player.jumpForce;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = config.player.health;
        this.image = new Image();
        this.image.src = 'assets/suomalainen.png';
        this.image.onerror = () => console.warn('Failed to load player image');
        this.facingRight = true;
        this.groundY = canvas.height * config.player.groundLevel;
        this.lastHitByBear = 0;
        this.attackTimer = 0;
        this.opacity = 1;
        this.jumpID = new Set();
        this.isDead = false;

        this.jumpSound = document.getElementById('jumpSound');
        this.attackSound = document.getElementById('attackSound');
    }

    draw(cameraX) {
        if (!this.ctx) return;
        this.ctx.globalAlpha = this.opacity;
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
                this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
            }
        } catch (e) {
            console.warn('Player draw error:', e);
        }
        this.ctx.globalAlpha = 1;
    }

    update(deltaTime) {
        if (!this.canvas) return;
        this.groundY = this.canvas.height * config.player.groundLevel;

        this.x += this.velocityX * (deltaTime / 16.67);
        if (this.x < 0) this.x = 0;

        if (this.crouching) {
            this.height = config.player.crouchHeight;
            this.y = this.groundY - this.height;
            this.jumping = false;
            this.velocityY = 0;
        } else {
            this.height = config.player.height;
        }

        if (this.jumping) {
            this.velocityY += config.player.gravity * (deltaTime / 16.67);
            this.y += this.velocityY * (deltaTime / 16.67);
            if (this.y >= this.groundY - this.height) {
                this.y = this.groundY - this.height;
                this.jumping = false;
                this.velocityY = 0;
            }
        }

        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime / 1000;
            this.opacity = Math.abs(Math.sin(this.attackTimer * 20));
        } else {
            this.opacity = 1;
        }
    }

    jump() {
        if (!this.jumping && !this.crouching) {
            this.jumping = true;
            this.velocityY = -this.jumpForce;
            this.height = config.player.height;
            const jumpID = Date.now();
            this.jumpID.add(jumpID);
            setTimeout(() => this.jumpID.delete(jumpID), 1000);
            try {
                this.jumpSound.currentTime = 0;
                this.jumpSound.play();
            } catch (e) {
                console.warn('Jump sound failed:', e);
            }
        }
    }

    moveLeft() {
        try {
            this.facingRight = false;
            this.velocityX = -this.speed;
        } catch (e) {
            console.warn('Move left error:', e);
        }
    }

    moveRight() {
        try {
            this.facingRight = true;
            this.velocityX = this.speed;
        } catch (e) {
            console.warn('Move right error:', e);
        }
    }

    crouch(state) {
        try {
            this.crouching = state;
        } catch (e) {
            console.warn('Crouch error:', e);
        }
    }

    stop() {
        try {
            this.velocityX = 0;
        } catch (e) {
            console.warn('Stop error:', e);
        }
    }

    attack() {
        try {
            this.attackTimer = config.player.attackDuration;
            try {
                this.attackSound.currentTime = 0;
                this.attackSound.play();
            } catch (e) {
                console.warn('Attack sound failed:', e);
            }
        } catch (e) {
            console.warn('Attack error:', e);
        }
    }

    takeDamage(amount, score, type) {
        const now = Date.now();
        if (now - this.lastHitByBear >= 500) {
            this.health -= amount;
            this.lastHitByBear = now;
            score -= 20;
            if (this.health <= 0) {
                this.health = 0;
                this.isDead = true;
            }
        }
        return score;
    }
}
