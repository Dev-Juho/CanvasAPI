class Tree {
    constructor(canvas, x) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = canvas.height * config.player.groundLevel - config.tree.height; // Align with ground
        this.width = config.tree.width;
        this.height = config.tree.height;
        this.health = config.tree.health;
        this.isBeingChopped = false;
        this.chopTimer = 0;
        this.chopInterval = 0.5;
    }

    draw() {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = 'green';
        this.ctx.beginPath();
        this.ctx.arc(this.x + this.width/2, this.y - 20, 30, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.isBeingChopped) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fillRect(this.x, this.y - 20, this.width, 10);
        }
    }

    update(deltaTime) {
        if (this.isBeingChopped) {
            this.chopTimer += deltaTime;
            if (this.chopTimer >= this.chopInterval) {
                this.chopTimer = 0;
                this.health -= 20;
                if (this.health <= 0) {
                    return true;
                }
            }
        }
        return false;
    }

    isHit(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y < this.y + this.height &&
               player.y + player.height > this.y;
    }

    startChopping() {
        this.isBeingChopped = true;
    }

    stopChopping() {
        this.isBeingChopped = false;
        this.chopTimer = 0;
    }
}
