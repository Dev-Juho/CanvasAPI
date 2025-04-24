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
            this.keys[e.key.toLowerCase()] = true;
            
            if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && !this.player.jumping && !this.player.crouching) {
                this.player.jump();
            }
            if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
                this.player.crouch(true);
            }
            if (e.key === ' ' || e.key.toLowerCase() === 'f') {
                this.player.attack();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            
            if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
                this.player.crouch(false);
            }
            if (!this.keys['arrowleft'] && !this.keys['arrowright'] && 
                !this.keys['a'] && !this.keys['d']) {
                this.player.stop();
            }
        });
    }

    update() {
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.moveLeft();
        }
        if (this.keys['arrowright'] || this.keys['d']) {
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
