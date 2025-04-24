const config = {
    canvas: {
        width: window.innerWidth,
        height: window.innerHeight,
        fallbackWidth: 800,
        fallbackHeight: 600
    },
    player: {
        width: 48,
        height: 48,
        crouchHeight: 24,
        speed: 5,
        jumpForce: 15,
        gravity: 0.5,
        x: 50,
        groundLevel: 0.9,
        health: 100,
        attackDuration: 0.2,
        jumpOverPoints: 25
    },
    tree: {
        width: 80,
        height: 200,
        health: 100,
        damagePerHit: 20,
        oakHealth: 150,
        minSpawnX: 0.1,
        maxSpawnX: 1.9
    },
    bear: {
        width: 60,
        height: 80,
        speed: 2.7,
        spawnInterval: 10,
        maxBears: 3,
        directionChangeInterval: 5,
        fleeSpeedMultiplier: 2,
        damage: 50
    },
    moose: {
        width: 100,
        height: 120,
        speed: 2.0,
        spawnInterval: 15,
        maxMoose: 2,
        directionChangeInterval: 7,
        damage: 75,
        chargeDistance: 300,
        chargeInterval: 5,
        chargeDuration: 2,
        chargeSpeedMultiplier: 3
    },
    projectile: {
        width: 50,
        height: 20,
        speed: 10,
        lifetime: 2
    },
    score: {
        chopInterval: 5,
        multipliers: [1, 1.5, 2]
    },
    layers: [
        { src: 'assets/layer1.png', speed: 0.1 },
        { src: 'assets/layer2.png', speed: 0.2 },
        { src: 'assets/layer3.png', speed: 0.3 },
        { src: 'assets/layer4.png', speed: 0.4 },
        { src: 'assets/layer5.png', speed: 0.5 },
        { src: 'assets/layer6.png', speed: 0.6 },
        { src: 'assets/layer7.png', speed: 0.7 },
        { src: 'assets/layer8.png', speed: 0.8 },
        { src: 'assets/layer9.png', speed: 0.9 },
        { src: 'assets/layer10.png', speed: 1.0 },
        { src: 'assets/layer11.png', speed: 1.1 },
        { src: 'assets/layer12.png', speed: 1.2 },
        { src: 'assets/layer13.png', speed: 1.3 },
        { src: 'assets/layer14.png', speed: 1.4 },
        { src: 'assets/layer15.png', speed: 1.5 },
        { src: 'assets/layer16.png', speed: 1.6 },
        { src: 'assets/layer17.png', speed: 1.7 },
        { src: 'assets/layer18.png', speed: 1.8 },
        { src: 'assets/layer19.png', speed: 1.9 },
        { src: 'assets/layer20.png', speed: 2.0 }
    ]
};
