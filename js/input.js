class InputHandler {
    constructor(player) {
        this.player = player;
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === 'ArrowUp' && !this.player.jumping && !this.player.crouching) {
                this.player.jump();
            }
            if (e.key === 'ArrowDown') {
                this.player.crouch(true);
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            
            if (e.key === 'ArrowDown') {
                this.player.crouch(false);
            }
            if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight']) {
                this.player.stop();
            }
        });
    }

    update() {
        if (this.keys['ArrowLeft']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight']) {
            this.player.moveRight();
        }
    }
}
