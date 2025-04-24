class InputHandler {
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
        this.keys = {};
        this.cameraX = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if ((e.key === 'ArrowUp' || e.key === 'w') && !this.player.jumping && !this.player.crouching) {
                this.player.jump();
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
                this.player.crouch(true);
            }
            if (e.key === ' ') {
                this.player.attack();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            
            if (e.key === 'ArrowDown' || e.key === 's') {
                this.player.crouch(false);
            }
            if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight'] && 
                !this.keys['a'] && !this.keys['d']) {
                this.player.stop();
            }
        });
    }

    update() {
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.moveRight();
        }

        const cameraLeftEdge = this.cameraX + this.canvas.width * 0.25;
        const cameraRightEdge = this.cameraX + this.canvas.width * 0.75;
        if (this.player.x < cameraLeftEdge) {
            this.cameraX = this.player.x - this.canvas.width * 0.25;
        } else if (this.player.x > cameraRightEdge) {
            this.cameraX = this.player.x - this.canvas.width * 0.75;
        }
        if (this.cameraX < 0) this.cameraX = 0;
    }
}
