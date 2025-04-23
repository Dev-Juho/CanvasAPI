class InputHandler {
    constructor(player) {
        this.player = player;
        this.keys = {};
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
    }
}
