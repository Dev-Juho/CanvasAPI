class Bear {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width * 0.75; // Start at 75% of canvas width
        this.y = canvas.height * config.player.groundLevel - config.bear.height; // Align with ground
        this.width = config.bear.width;
        this.height = config.bear.height;
        this.speed = config.bear.speed;
        this.image = new Image();
        this.image.src = 'assets/karhu.png';
        this.facingRight = false;
    }

    draw() {
        if (this.image.complete) {
            if (this.facingRight) {
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
            this.ctx.fillStyle = 'brown';
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        // Move toward player (x: 50)
        if (this.x > config.player.x + config.player.width) {
            this.x -= this.speed;
            this.facingRight = false;
        } else if (this.x < config.player.x - this.width) {
            this.x += this.speed;
            this.facingRight = true;
        }
    }

    isHit(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
}
