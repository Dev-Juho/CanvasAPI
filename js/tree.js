class Tree {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = config.tree.width;
        this.height = config.tree.height;
        this.x = Math.random() * (canvas.width * config.tree.maxSpawnX - canvas.width * config.tree.minSpawnX) + canvas.width * config.tree.minSpawnX;
        this.y = canvas.height * config.player.groundLevel - this.height;
        this.health = config.tree.health;
        this.maxHealth = config.tree.health;
        this.damagePerHit = config.tree.damagePerHit;
        this.broken = false;
        this.normalSprite = new Image();
        this.normalSprite.src = 'assets/tree_sprite_normaali.png';
        this.normalSprite.onerror = () => console.warn('Failed to load normal tree sprite');
        this.brokenSprite = new Image();
        this.brokenSprite.src = 'assets/tree_sprite_rikki.png';
        this.brokenSprite.onerror = () => console.warn('Failed to load broken tree sprite');
    }

    draw(cameraX) {
        if (!this.ctx || this.broken) return;
        try {
            this.ctx.drawImage(
                this.normalSprite,
                this.x - cameraX,
                this.y,
                this.width,
                this.height
            );
            this.drawHealthBar(cameraX);
        } catch (e) {
            console.warn('Tree draw error:', e);
        }
    }

    update(deltaTime) {
        // No respawn or update logic needed
        return false;
    }

    takeDamage(amount, player) {
        if (!this.broken) {
            this.health -= amount;
            if (this.health <= 0) {
                this.health = 0;
                this.broken = true;
                if (player) {
                    woodCount += config.score.woodPerTree;
                    score += config.tree.scorePerTree;
                }
            }
        }
    }

    drawHealthBar(cameraX) {
        if (this.broken) return;
        const barWidth = 50;
        const barHeight = 5;
        const x = this.x - cameraX + (this.width - barWidth) / 2;
        const y = this.y - 10;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y, barWidth, barHeight);

        const healthPercent = this.health / this.maxHealth;
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }

    isHit(player) {
        if (!player) return false;
        const playerCenterX = player.x + player.width / 2;
        const treeCenterX = this.x + this.width / 2;
        const distance = Math.abs(playerCenterX - treeCenterX);
        return distance < this.width;
    }

    startChopping(player) {
        if (!this.broken) {
            this.takeDamage(this.damagePerHit, player);
            try {
                const chopSound = document.getElementById('chopSound');
                chopSound.currentTime = 0;
                chopSound.play();
            } catch (e) {
                console.warn('Chop sound failed:', e);
            }
        }
    }

    stopChopping() {
        // No state to reset
    }
}
