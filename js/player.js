class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = 50;
        this.y = canvas.height - 100;
        this.width = config.player.width;
        this.height = config.player.height;
        this.speed = config.player.speed;
        this.jumping = false;
        this.jumpForce = 15;
        this.velocityY = 0;
        this.wood = 0;
        this.image = new Image();
        this.image.src = 'assets/suomalainen.png';
        this.facingRight = true;
        this.groundY = canvas.height - 100;
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
        if (this.jumping) {
            this.velocityY += config.player.gravity;
            this.y += this.velocityY;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.jumping = false;
                this.velocityY = 0;
            }
        }
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.velocityY = -this.jumpForce;
        }
    }

    moveLeft() {
        this.x = Math.max(0, this.x - this.speed);
        this.facingRight = false;
    }

    moveRight() {
        this.x = Math.min(this.canvas.width - this.width, this.x + this.speed);
        this.facingRight = true;
    }

    stop() {
        // Ei tarvita mitään toimintoa pysähtymisessä
    }
} 