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
        jumpForce: 12,
        gravity: 0.5,
        x: 50,
        groundLevel: 0.9,
        health: 100 // Added for bear collisions
    },
    tree: {
        width: 40,
        height: 100,
        health: 100
    },
    bear: {
        width: 60,
        height: 80,
        speed: 3
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
