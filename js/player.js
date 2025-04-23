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
        this.velocityY = 0;
        this.wood = 0;
        this.health = config.player.health; 
        this.image = new Image();
        this.image.src = 'assets/suomalainen.png';
        this.facingRight = true;
        this.groundY = canvas.height * config.player.groundLevel;
        this.layers = config.layers;
        
        this.jumpSound = new Audio('assets/pomppu.mp3');
    }

    draw() {
        if (this.image.complete) {
            if (!this.facingRight) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(
                    this.image,
                    -this.x - this.width, this.y, this.width, this.height
                );
                this.ctx.restore();
            } else {
                this.ctx.drawImage(
                    this.image,
                    this.x, this.y, this.width, this.height
                );
            }
        } else {
            this.ctx.fillStyle = 'blue';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update(deltaTime) {
        this.groundY = this.canvas.height * config.player.groundLevel;

        if (this.crouching) {
            this.height = config.player.crouchHeight;
            this.y = this.groundY - this.height;
            this.jumping = false;
            this.velocityY = 0;
        } else {
            this.height = config.player.height;
        }

        if (this.jumping) {
            this.velocityY += config.player.gravity;
            this.y += this.velocityY;

            if (this.y >= this.groundY - this.height) {
                this.y = this.groundY - this.height;
                this.jumping = false;
                this.velocityY = 0;
            }
        }
    }

    jump() {
        if (!this.jumping && !this.crouching) {
            this.jumping = true;
            this.velocityY = -this.jumpForce;
            this.height = config.player.height; 
            this.jumpSound.currentTime = 0; 
            this.jumpSound.play();
        }
    }

    moveLeft() {
        this.facingRight = false;
        this.layers.forEach(layer => {
            layer.x += this.speed * layer.speed;
            if (layer.width > 0) {
                if (layer.x > layer.width) {
                    layer.x -= layer.width * 2;
                }
            }
        });
    }

    moveRight() {
        this.facingRight = true;
        this.layers.forEach(layer => {
            layer.x -= this.speed * layer.speed;
            if (layer.width > 0) {
                if (layer.x < -layer.width) {
                    layer.x += layer.width * 2;
                }
            }
        });
    }

    crouch(state) {
        this.crouching = state;
    }

    stop() {
    }

    takeDamage(amount) { 
        this.health -= amount;
        if (this.health < 0) this.health = 0;
    }
}
