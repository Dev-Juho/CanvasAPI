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
        this.oakHealth = config.tree.oakHealth;
        this.broken = false;
        this.falling = false;
        this.fallSpeed = 0;
        this.particles = [];
        this.branches = this.generateBranches();
        this.leaves = this.generateLeaves();
        this.barkPattern = this.generateBarkPattern();
        this.normalSprite = new Image();
        this.normalSprite.src = 'assets/tree_sprite_normaali.png';
        this.brokenSprite = new Image();
        this.brokenSprite.src = 'assets/tree_sprite_rikki.png';
        this.rotation = 0;
        this.rotationSpeed = 0.02;
        this.isOak = Math.random() < 0.3;
        if (this.isOak) {
            this.health = config.tree.oakHealth;
            this.maxHealth = config.tree.oakHealth;
        }
        this.hasGivenRewards = false;
        this.isBeingChopped = false;
    }
    
    generateBranches() {
        const branches = [];
        const numBranches = this.isOak ? 5 : 3;
        
        for (let i = 0; i < numBranches; i++) {
            const height = 0.3 + Math.random() * 0.4;
            const angle = (Math.random() - 0.5) * 0.8;
            const length = 0.2 + Math.random() * 0.3;
            const thickness = 0.05 + Math.random() * 0.1;
            
            branches.push({
                height,
                angle,
                length,
                thickness
            });
        }
        
        return branches;
    }
    
    generateLeaves() {
        const leaves = [];
        const numLeaves = this.isOak ? 40 : 30;
        
        for (let i = 0; i < numLeaves; i++) {
            const x = (Math.random() - 0.5) * 60;
            const y = -20 - Math.random() * 40;
            const size = 2 + Math.random() * 4;
            
            leaves.push({
                x,
                y,
                size
            });
        }
        
        return leaves;
    }
    
    generateBarkPattern() {
        const pattern = [];
        const numLines = this.isOak ? 8 : 5;
        
        for (let i = 0; i < numLines; i++) {
            const height = Math.random() * this.height;
            const length = 0.3 + Math.random() * 0.4;
            const offset = (Math.random() - 0.5) * 0.2;
            
            pattern.push({
                height,
                length,
                offset
            });
        }
        
        return pattern;
    }

    draw(cameraX) {
        if (this.falling) {
            this.ctx.save();
            this.ctx.translate(this.x - cameraX + this.width/2, this.y + this.height/2);
            this.ctx.rotate(this.fallAngle);
            this.ctx.drawImage(
                this.brokenSprite,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(
                this.broken ? this.brokenSprite : this.normalSprite,
                this.x - cameraX,
                this.y,
                this.width,
                this.height
            );
        }

        this.drawHealthBar(cameraX);

        for (let particle of this.particles) {
            particle.draw(cameraX);
        }
    }

    update(deltaTime) {
        if (this.broken) {
            this.restoreTime += deltaTime;
            if (this.restoreTime >= config.tree.restoreTime) {
                this.restore();
                return false;
            }
            return false;
        }
        if (this.falling) {
            this.fallTimer += deltaTime;
            if (this.fallTimer >= this.fallDuration) {
                this.falling = false;
                this.fallTimer = 0;
            }
            return false;
        }
        return false;
    }

    takeDamage(amount, player) {
        if (!this.broken && !this.falling) {
            this.health -= amount;
            if (this.health <= 0) {
                this.health = 0;
                this.broken = true;
                this.falling = true;
                this.fallSpeed = 0;
                if (!this.hasGivenRewards && player) {
                    this.hasGivenRewards = true;
                    woodCount += this.isOak ? 2 : 1;
                    score += this.isOak ? 50 : 25;
                }
            }
        }
    }

    restore() {
        if (this.broken && !this.falling) {
            this.health = this.maxHealth;
            this.broken = false;
            this.hasGivenRewards = false;
            return true;
        }
        return false;
    }

    drawTreeDetails(x, y, width, height) {
        const ctx = this.canvas.getContext('2d');
        
        ctx.fillStyle = this.isOak ? '#5D4037' : '#8D6E63';
        ctx.fillRect(x, y, width, height);
        
        this.drawBarkTexture(x, y, width, height);
        
        this.drawBranches(x, y, width, height);
        
        this.drawCrown(x, y, width, height);
    }
    
    drawBarkTexture(x, y, width, height) {
        const ctx = this.canvas.getContext('2d');
        ctx.strokeStyle = this.isOak ? '#3E2723' : '#5D4037';
        ctx.lineWidth = 1;
        
        this.barkPattern.forEach(line => {
            const lineY = y + line.height;
            const lineLength = width * line.length;
            const lineOffset = width * line.offset;
            
            ctx.beginPath();
            ctx.moveTo(x + lineOffset, lineY);
            ctx.lineTo(x + lineOffset + lineLength, lineY);
            ctx.stroke();
        });
    }
    
    drawBranches(x, y, width, height) {
        const ctx = this.canvas.getContext('2d');
        ctx.strokeStyle = this.isOak ? '#3E2723' : '#5D4037';
        
        this.branches.forEach(branch => {
            const branchY = y + height * branch.height;
            const branchLength = height * branch.length;
            const branchThickness = width * branch.thickness;
            
            ctx.lineWidth = branchThickness;
            
            ctx.beginPath();
            ctx.moveTo(x, branchY);
            ctx.lineTo(x - branchLength * Math.cos(branch.angle), branchY - branchLength * Math.sin(branch.angle));
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + width, branchY);
            ctx.lineTo(x + width + branchLength * Math.cos(branch.angle), branchY - branchLength * Math.sin(branch.angle));
            ctx.stroke();
        });
    }
    
    drawCrown(x, y, width, height) {
        const ctx = this.canvas.getContext('2d');
        ctx.fillStyle = this.isOak ? '#1B5E20' : '#2E7D32';
        ctx.beginPath();
        ctx.arc(x + width/2, y - 20, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = this.isOak ? '#388E3C' : '#43A047';
        
        this.leaves.forEach(leaf => {
            ctx.beginPath();
            ctx.arc(x + width/2 + leaf.x, y - 20 + leaf.y, leaf.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    drawHealthBar(cameraX) {
        const barWidth = 50;
        const barHeight = 5;
        const x = this.x - cameraX + (this.width - barWidth) / 2;
        const y = this.y - 10;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        const healthPercent = this.health / (this.isOak ? config.tree.oakHealth : config.tree.health);
        this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }

    startFalling() {
        this.falling = true;
        this.fallTimer = 0;
        
        for (let i = 0; i < 20; i++) {
            this.addParticle();
        }
    }
    
    addParticle() {
        const isLeaf = Math.random() < 0.7;
        const particle = {
            x: this.x + Math.random() * this.width,
            y: this.y - 20 + Math.random() * 40,
            size: isLeaf ? 8 + Math.random() * 8 : 4 + Math.random() * 4,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2,
            life: 0.5 + Math.random() * 1.0,
            isLeaf: isLeaf,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 4
        };
        this.particles.push(particle);
    }

    isHit(player) {
        const playerCenterX = player.x + player.width / 2;
        const treeCenterX = this.x + this.width / 2;
        const distance = Math.abs(playerCenterX - treeCenterX);
        
        return distance < this.width;
    }

    startChopping(player) {
        if (!this.broken && !this.falling && !this.isBeingChopped) {
            this.isBeingChopped = true;
            this.takeDamage(this.damagePerHit, player);
            
            const chopSound = document.getElementById('chopSound');
            try {
                chopSound.currentTime = 0;
                chopSound.play();
            } catch (e) {
                console.warn('Chop sound failed:', e);
            }
        }
    }

    stopChopping() {
        this.isBeingChopped = false;
    }
}
