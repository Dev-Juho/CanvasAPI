const config = {
    canvas: {
        width: Math.min(window.innerWidth, 1920),
        height: Math.min(window.innerHeight, 1080)
    },
    player: {
        x: 50,
        width: 48,
        height: 48,
        crouchHeight: 24,
        speed: 4,
        jumpForce: 15,
        gravity: 0.5,
        health: 100,
        attackDuration: 0.2,
        jumpOverPoints: 25,
        groundLevel: 0.9
    },
    bear: {
        width: 64,
        height: 48,
        speedMin: 2.0,
        speedMax: 3.5,
        damage: 20,
        directionChangeInterval: 3000,
        minSpawnX: 0.2,
        maxSpawnX: 0.8,
        spawnInterval: 3000,
        maxBears: 5
    },
    moose: {
        width: 100,
        height: 120,
        speedMin: 2.0,
        speedMax: 3.5,
        damage: 35,
        chargeDistance: 300,
        chargeInterval: 2000,
        chargeDuration: 2500,
        chargeSpeedMultiplier: 3,
        directionChangeInterval: 7000,
        jumpForce: 12,
        gravity: 0.5,
        jumpInterval: 3000,
        spawnInterval: 4000,
        maxMoose: 4
    },
    tree: {
        width: 50,
        height: 150,
        health: 100,
        damagePerHit: 20,
        scorePerTree: 25,
        minSpawnX: 0.2,
        maxSpawnX: 0.8,
        minSpacing: 600,
        maxSpacing: 900
    },
    projectile: {
        width: 50,
        height: 20
    },
    score: {
        woodPerTree: 10,
        victoryWood: 100
    },
    layers: Array.from({ length: 20 }, (_, i) => ({
        src: `assets/layer${i + 1}.png`,
        speed: 0.1 + i * 0.05
    }))
};
