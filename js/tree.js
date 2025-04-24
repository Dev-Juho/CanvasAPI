class Tree {
    constructor(canvas, x, isOak = false) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = canvas.height * config.player.groundLevel - config.tree.height;
        this.width = config.tree.width;
        this.height = config.tree.height;
<<<<<<< HEAD
        this.maxHealth = isOak ? config.tree.oakHealth : config.tree.health;
        this.health = this.maxHealth;
        this.healthBarWidth = this.width;
        this.healthBarHeight = 15;
        this.healthSegments = 5;  // Terveyspalkki jaetaan 5 osaan
=======
        this.health = isOak ? config.tree.oakHealth : config.tree.health;
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
        this.isBeingChopped = false;
        this.chopTimer = 0;
        this.chopInterval = 0.5;
        this.isOak = isOak;
        this.shakeTimer = 0;
        this.chopSound = document.getElementById('chopSound');
<<<<<<< HEAD
        
        // Hajoamisanimaation ominaisuudet
        this.isFalling = false;
        this.fallTimer = 0;
        this.fallDuration = 1.0; // sekunteina
        this.fallAngle = 0;
        this.fallDirection = Math.random() < 0.5 ? -1 : 1; // Kaatuu satunnaisesti vasemmalle tai oikealle
        this.particles = [];
        
        // Puun yksityiskohdat
        this.branches = this.generateBranches();
        this.leaves = this.generateLeaves();
        this.barkPattern = this.generateBarkPattern();

        // Ladataan puun sprite-kuvat
        this.normalSprite = new Image();
        this.normalSprite.src = 'assets/tree_sprite_normaali.png';
        this.brokenSprite = new Image();
        this.brokenSprite.src = 'assets/tree_sprite_rikki.png';

        this.isBroken = false;  // Lisätään uusi tila puulle
        this.rotation = 0;
        this.rotationSpeed = 0.02;
    }
    
    generateBranches() {
        const branches = [];
        const numBranches = this.isOak ? 5 : 3;
        
        for (let i = 0; i < numBranches; i++) {
            const height = 0.3 + Math.random() * 0.4; // Puun korkeuden suhteessa
            const angle = (Math.random() - 0.5) * 0.8; // Kulma keskiviivasta
            const length = 0.2 + Math.random() * 0.3; // Oksen pituus puun korkeuden suhteessa
            const thickness = 0.05 + Math.random() * 0.1; // Oksen paksuus puun leveyden suhteessa
            
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
            const x = (Math.random() - 0.5) * 60; // Lehtien sijainti latvuksen ympärillä
            const y = -20 - Math.random() * 40; // Lehtien korkeus latvuksen ympärillä
            const size = 2 + Math.random() * 4; // Lehtien koko
            
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
            const height = Math.random() * this.height; // Viivan korkeus puun runkossa
            const length = 0.3 + Math.random() * 0.4; // Viivan pituus puun leveyden suhteessa
            const offset = (Math.random() - 0.5) * 0.2; // Viivan siirtymä keskiviivasta
            
            pattern.push({
                height,
                length,
                offset
            });
        }
        
        return pattern;
    }

    draw(cameraX) {
        if (this.isBroken) {
            this.ctx.save();
            this.ctx.translate(this.x - cameraX + this.width/2, this.y + this.height/2);
            this.ctx.rotate(this.rotation);
            this.ctx.drawImage(
                this.brokenSprite,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            );
            this.ctx.restore();
            return;
        }
        if (this.isFalling) {
            // Piirretään kaatunut puu
            this.ctx.save();
            this.ctx.translate(this.x - cameraX + this.width/2, this.y + this.height/2);
            this.ctx.rotate(this.fallAngle);
            
            if (this.brokenSprite.complete) {
                this.ctx.drawImage(
                    this.brokenSprite,
                    -this.width/2,
                    -this.height/2,
                    this.width,
                    this.height
                );
            }
            
            this.ctx.restore();
            
            // Piirretään hajoamispartikkelit
            this.particles.forEach(particle => {
                if (particle.isLeaf) {
                    // Piirretään lehti sprite-kuvasta
                    const leafSize = particle.size * 2;
                    this.ctx.save();
                    this.ctx.translate(particle.x - cameraX + leafSize/2, particle.y + leafSize/2);
                    this.ctx.rotate(particle.rotation);
                    if (this.brokenSprite.complete) {
                        this.ctx.drawImage(
                            this.brokenSprite,
                            0, 0, 20, 20, // Leikataan vain latvuksen osa kuvasta
                            -leafSize/2, -leafSize/2,
                            leafSize, leafSize
                        );
                    }
                    this.ctx.restore();
                } else {
                    // Piirretään puun pala sprite-kuvasta
                    if (this.brokenSprite.complete) {
                        this.ctx.drawImage(
                            this.brokenSprite,
                            20, 20, 20, 20, // Leikataan vain rungon osa kuvasta
                            particle.x - cameraX,
                            particle.y,
                            particle.size,
                            particle.size
                        );
                    }
                }
            });
        } else {
            // Normaali puun piirtäminen
            const offsetX = this.shakeTimer > 0 ? Math.sin(this.shakeTimer * 50) * 2 : 0;
            
            if (this.normalSprite.complete) {
                this.ctx.drawImage(
                    this.normalSprite,
                    this.x - cameraX + offsetX,
                    this.y,
                    this.width,
                    this.height
                );
            }

            // Piirretään health bar
            this.drawHealthBar(cameraX + offsetX);

            if (this.isBeingChopped) {
                this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                this.ctx.fillRect(this.x - cameraX + offsetX, this.y - 20, this.width, 10);
            }
        }
    }
    
    drawTreeDetails(x, y, width, height) {
        // Piirretään puun runko
        this.ctx.fillStyle = this.isOak ? '#5D4037' : '#8D6E63'; // Tummempi ruskea tammelle
        this.ctx.fillRect(x, y, width, height);
        
        // Piirretään kuoren tekstuuri
        this.drawBarkTexture(x, y, width, height);
        
        // Piirretään oksat
        this.drawBranches(x, y, width, height);
        
        // Piirretään latvus
        this.drawCrown(x, y, width, height);
    }
    
    drawBarkTexture(x, y, width, height) {
        this.ctx.strokeStyle = this.isOak ? '#3E2723' : '#5D4037'; // Tummempi viiva kuorelle
        this.ctx.lineWidth = 1;
        
        this.barkPattern.forEach(line => {
            const lineY = y + line.height;
            const lineLength = width * line.length;
            const lineOffset = width * line.offset;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x + lineOffset, lineY);
            this.ctx.lineTo(x + lineOffset + lineLength, lineY);
            this.ctx.stroke();
        });
    }
    
    drawBranches(x, y, width, height) {
        this.ctx.strokeStyle = this.isOak ? '#3E2723' : '#5D4037';
        
        this.branches.forEach(branch => {
            const branchY = y + height * branch.height;
            const branchLength = height * branch.length;
            const branchThickness = width * branch.thickness;
            
            this.ctx.lineWidth = branchThickness;
            
            // Vasen oksa
            this.ctx.beginPath();
            this.ctx.moveTo(x, branchY);
            this.ctx.lineTo(x - branchLength * Math.cos(branch.angle), branchY - branchLength * Math.sin(branch.angle));
            this.ctx.stroke();
            
            // Oikea oksa
            this.ctx.beginPath();
            this.ctx.moveTo(x + width, branchY);
            this.ctx.lineTo(x + width + branchLength * Math.cos(branch.angle), branchY - branchLength * Math.sin(branch.angle));
            this.ctx.stroke();
        });
    }
    
    drawCrown(x, y, width, height) {
        // Piirretään latvuksen pohja
        this.ctx.fillStyle = this.isOak ? '#1B5E20' : '#2E7D32'; // Tummempi vihreä tammelle
        this.ctx.beginPath();
        this.ctx.arc(x + width/2, y - 20, 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Piirretään lehdet
        this.ctx.fillStyle = this.isOak ? '#388E3C' : '#43A047'; // Vaaleampi vihreä lehdille
        
        this.leaves.forEach(leaf => {
            this.ctx.beginPath();
            this.ctx.arc(x + width/2 + leaf.x, y - 20 + leaf.y, leaf.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawHealthBar(cameraX) {
        const barX = this.x - cameraX;
        const barY = this.y - this.healthBarHeight - 5;  // 5 pikseliä puun yläpuolella
        
        // Piirretään tausta
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(barX, barY, this.healthBarWidth, this.healthBarHeight);
        
        // Piirretään segmentit
        const segmentWidth = this.healthBarWidth / this.healthSegments;
        const currentSegments = Math.ceil((this.health / this.maxHealth) * this.healthSegments);
        
        for (let i = 0; i < this.healthSegments; i++) {
            const segmentX = barX + (i * segmentWidth);
            
            // Määritä segmentin väri
            if (i < currentSegments) {
                // Aktiivinen segmentti
                this.ctx.fillStyle = i < 2 ? '#ff4444' :  // Punainen
                                   i < 3 ? '#ffaa44' :  // Oranssi
                                   i < 4 ? '#ffff44' :  // Keltainen
                                          '#44ff44';    // Vihreä
            } else {
                // Tyhjä segmentti
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            }
            
            // Piirrä segmentti pienellä välistyksellä
            this.ctx.fillRect(
                segmentX + 2, 
                barY + 2, 
                segmentWidth - 4, 
                this.healthBarHeight - 4
            );
=======
    }

    draw(cameraX) {
        const offsetX = this.shakeTimer > 0 ? Math.sin(this.shakeTimer * 50) * 2 : 0;
        this.ctx.fillStyle = this.isOak ? 'darkbrown' : 'brown';
        this.ctx.fillRect(this.x - cameraX + offsetX, this.y, this.width, this.height);
        this.ctx.fillStyle = this.isOak ? 'darkgreen' : 'green';
        this.ctx.beginPath();
        this.ctx.arc(this.x - cameraX + this.width/2 + offsetX, this.y - 20, 30, 0, Math.PI * 2);
        this.ctx.fill();

        if (this.isBeingChopped) {
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            this.ctx.fillRect(this.x - cameraX + offsetX, this.y - 20, this.width, 10);
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
        }
    }

    update(deltaTime) {
<<<<<<< HEAD
        if (this.isBroken) {
            this.rotation += this.rotationSpeed;
            return false;
        }

        if (this.isFalling) {
            this.fallTimer += deltaTime / 1000;
            this.fallAngle = (this.fallTimer / this.fallDuration) * Math.PI/2 * this.fallDirection;
            
            this.particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1;
                particle.life -= deltaTime / 1000;
                if (particle.isLeaf) {
                    particle.rotation += particle.rotationSpeed * deltaTime / 1000;
                }
                
                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                }
            });
            
            if (Math.random() < 0.3) {
                this.addParticle();
            }
            
            if (this.fallTimer >= this.fallDuration) {
                this.isBroken = true;
                this.isFalling = false;
                return true;
            }
            
            return false;
        }
        
        if (this.isBeingChopped) {
            this.chopTimer += deltaTime / 1000;
            this.shakeTimer = 0.2;
            
            if (this.chopTimer >= this.chopInterval) {
                this.chopTimer = 0;
                this.health = Math.max(0, this.health - config.tree.damagePerHit);
                
=======
        if (this.isBeingChopped) {
            this.chopTimer += deltaTime / 1000;
            this.shakeTimer = 0.2;
            if (this.chopTimer >= this.chopInterval) {
                this.chopTimer = 0;
                this.health -= 20;
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
                try {
                    this.chopSound.currentTime = 0;
                    this.chopSound.play();
                } catch (e) {
                    console.warn('Chop sound failed:', e);
                }
<<<<<<< HEAD
                
                if (this.health <= 0) {
                    this.startFalling();
                }
            }
        }
        
        if (this.shakeTimer > 0) {
            this.shakeTimer -= deltaTime / 1000;
        }
        
        return false;
    }
    
    startFalling() {
        this.isFalling = true;
        this.fallTimer = 0;
        
        // Luodaan alkuperäiset partikkelit
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
        // Yksinkertaisempi tarkistus pelaajan ja puun väliselle etäisyydelle
        const playerCenterX = player.x + player.width / 2;
        const treeCenterX = this.x + this.width / 2;
        const distance = Math.abs(playerCenterX - treeCenterX);
        
        // Pelaajan pitää olla puun vieressä (max puun leveys)
        return distance < this.width;
    }

    startChopping() {
        if (!this.isFalling) {
            this.isBeingChopped = true;
            this.chopTimer = this.chopInterval; // Aloitetaan heti ensimmäinen isku
        }
=======
                if (this.health <= 0) {
                    return true;
                }
            }
        }
        if (this.shakeTimer > 0) {
            this.shakeTimer -= deltaTime / 1000;
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
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
    }

    stopChopping() {
        this.isBeingChopped = false;
        this.chopTimer = 0;
    }
<<<<<<< HEAD

    restore() {
        this.isBroken = false;
        this.health = this.maxHealth;
        this.rotation = 0;
        this.isFalling = false;
        this.fallTimer = 0;
        this.particles = [];
        this.isBeingChopped = false;
        this.chopTimer = 0;
        this.shakeTimer = 0;
    }
=======
>>>>>>> 63138ecc7e6726c10ddae49eef4e0d9aa6592ba7
}
