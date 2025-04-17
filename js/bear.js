class Bear {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = canvas.width;                     
        this.y = canvas.height - 100;
        this.width = config.bear.width;
        this.height = config.bear.height;
        this.speed = config.bear.speed;
    }

    draw() {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
        if (this.x < -this.width) {
            this.x = this.canvas.width;
        }
    }

    isHit(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }
} 