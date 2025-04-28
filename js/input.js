class InputHandler {
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
        this.keys = new Set();
        this.cameraX = 0;
        this.cameraSpeed = 0;

        document.addEventListener('keydown', (e) => {
            this.keys.add(e.key.toLowerCase());
        });

        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
            if (['a', 'd', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
                this.player.stop();
            }
            if (e.key.toLowerCase() === 's' || e.key.toLowerCase() === 'arrowdown') {
                this.player.crouch(false);
            }
        });
    }

    update(deltaTime) {
        if (!this.player || !this.canvas) return;
        try {
            if (this.keys.has('a') || this.keys.has('arrowleft')) {
                this.player.moveLeft();
            }
            if (this.keys.has('d') || this.keys.has('arrowright')) {
                this.player.moveRight();
            }
            if ((this.keys.has('w') || this.keys.has('arrowup') || this.keys.has(' ')) && !this.keys.has('s') && !this.keys.has('arrowdown')) {
                this.player.jump();
            }
            if (this.keys.has('s') || this.keys.has('arrowdown')) {
                this.player.crouch(true);
            }
            if (this.keys.has('g')) {
                this.player.attack();
            }

            const playerCenterX = this.player.x + this.player.width / 2;
            const canvasCenterX = this.canvas.width / 2;
            const leftEdge = this.canvas.width * 0.3;
            const rightEdge = this.canvas.width * 0.7;

            if (playerCenterX < this.cameraX + leftEdge) {
                this.cameraSpeed = -this.player.speed;
            } else if (playerCenterX > this.cameraX + rightEdge) {
                this.cameraSpeed = this.player.speed;
            } else {
                this.cameraSpeed = 0;
            }

            this.cameraX += this.cameraSpeed * (deltaTime / 16.67);
            if (this.cameraX < 0) this.cameraX = 0;
        } catch (e) {
            console.warn('Input handler update error:', e);
        }
    }
}
