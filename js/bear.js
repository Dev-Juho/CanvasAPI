class Bear {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width * 0.75; 
        this.y = canvas.height * config.player.groundLevel - config.bear.height;
        this.width = config.bear.width;
        this.height = config.bear.height;
        this.speed = config.bear.speed;
        this.image = new Image();
        this.image.src = 'assets/karhu.png';
        this.facingRight = false;
        this.jumpedOver = false;
        this.direction = -1; 
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
        this.x += this.speed * this.direction;
        
        if (this.x + this.width < 0) {
            this.x = this.canvas.width;
            this.jumpedOver = false;        } else if (this.x > this.canvas.width) {
            this.x = -this.width;
            this.jumpedOver = false;
        }
    }

    isHit(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y + player.height > this.y &&
               player.y < this.y + this.height;
    }

    isJumpedOver(player) {
        if (!this.jumpedOver && 
            player.x + player.width > this.x && 
            player.x < this.x + this.width && 
            player.y + player.height < this.y) {
            this.jumpedOver = true;
            return true;
        }
        return false;
    }
}
