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
<<<<<<< HEAD
            this.keys[e.key.toLowerCase()] = true;
            
            if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && !this.player.jumping && !this.player.crouching) {
                this.player.jump();
            }
            if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
=======
            this.keys[e.key] = true;
            
            if ((e.key === 'ArrowUp' || e.key === 'w') && !this.player.jumping && !this.player.crouching) {
                this.player.jump();
            }
            if (e.key === 'ArrowDown' || e.key === 's') {
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
                this.player.crouch(true);
            }
            if (e.key === ' ') {
                this.player.attack();
            }
        });

        document.addEventListener('keyup', (e) => {
<<<<<<< HEAD
            this.keys[e.key.toLowerCase()] = false;
            
            if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
                this.player.crouch(false);
            }
            if (!this.keys['arrowleft'] && !this.keys['arrowright'] && 
=======
            this.keys[e.key] = false;
            
            if (e.key === 'ArrowDown' || e.key === 's') {
                this.player.crouch(false);
            }
            if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight'] && 
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
                !this.keys['a'] && !this.keys['d']) {
                this.player.stop();
            }
        });
    }

    update() {
<<<<<<< HEAD
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.moveLeft();
        }
        if (this.keys['arrowright'] || this.keys['d']) {
=======
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
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
