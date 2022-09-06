// Variables y funcionnes comunes
let level = 1;
let playerQuantity = 1;
let player = "";
let secondPlayer = "";
let platforms = "";
let stars = "";
let bomb = "";
let textScore = "";
let textScoreP2 = "";
let textTimeGame = "";
let textGameLevel = "";
let textGameMode = "";
let gameTime = 0; 
let musicStart = true;

let arrayLevels = ['Easy.', 'Medium.', 'Hard.'];
let gameLevel = "Easy.";
let arrayModes = ['1 Player.', '2 Players.']
let gameMode = "1 Player.";

/* MOBIEL CONTROLS */
let goLeftP1 = false;
let goRightP1 = false;
let goUpP1 = false;

let goLeftP2 = false;
let goRightP2 = false; 
let goUpP2 = false;
/* --- */

// let salto_fuerza = 0; /* para el salto con carga */

// Clases
/* Escena principal del videojuego */
class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    }

    preload(){}
 
    create(){
        //Aquí va la logia del juego. Eventos, coliciones, etc.
        //Tambine se ejectua una única vez, pero despues de preload.

        if (musicStart){
            musicStart = false;
            const music = this.sound.add('background_music');
            music.play({
                volume: .3,
                loop: true
            })
        }

        /* vertical position, horizontal position, name image.
        * setScale(2) indica que la imagen tnedrá el doble de su tamaño (1 es su valor por defecto y 0 desaparece la imagen).
        */
        this.add.image(400, 265, 'jungla_fondo').setScale(.8);
        platforms = this.physics.add.staticGroup();
        platforms.create(190, 498, 'ground'); 
        platforms.create(380, 498, 'ground'); 
        platforms.create(570, 498, 'ground'); 
        platforms.create(950, 498, 'ground'); 

        platforms.create(190, 528, 'ground'); 
        platforms.create(380, 528, 'ground'); 
        platforms.create(570, 528, 'ground'); 
        platforms.create(950, 528, 'ground'); 

        /* MOBILE CONTROLLLS */ 
        if (screen.width <= 900){
            this.add.image(155, 390, 'controlsPlayer1').setScale(.8).setDepth(1).alpha = 0.6;
            this.add.image(700, 390, 'jump').setScale(.3).setDepth(1).alpha = 0.6;
            /* vertical, horizontal, alto, ancho */
                let leftZonep1 = this.add.zone(22, 345, 80, 80);
                leftZonep1.setOrigin(0);
                leftZonep1.setInteractive();
                // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(leftZonep1);

                let rightZonep1 = this.add.zone(206, 345, 80, 80);
                rightZonep1.setOrigin(0);
                rightZonep1.setInteractive();
                // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(rightZonep1);

                let upZonep1 = this.add.zone(640, 328, 120, 125);
                upZonep1.setOrigin(0);
                upZonep1.setInteractive();
                // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(upZonep1);
            /* --- */

            /* EVENTS */
                leftZonep1.on('pointerdown', () => goLeftP1 = true);
                leftZonep1.on('pointerup', () => goLeftP1 = false);
                leftZonep1.on('pointerout', () => goLeftP1 = false);

                rightZonep1.on('pointerdown', () => goRightP1 = true);
                rightZonep1.on('pointerup', () => goRightP1 = false);
                rightZonep1.on('pointerout', () => goRightP1 = false);

                upZonep1.on('pointerdown', () => goUpP1 = true);
                upZonep1.on('pointerup', () => goUpP1 = false);
                upZonep1.on('pointerout', () => goUpP1 = false);
            /* --- */
        }
        /* --- */ 

        // Crea el objeto con un JSON
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11, 
            setXY: { x:100, y: 0, stepX: 50}
        });
        // Crear grupo bombas
        let bombs = this.physics.add.group();

        // Bounce para cada uno de los elementos del grupo stars
        stars.children.iterate((child) => {
            child.setBounce(0.5);
        });                
        
        // plataformas flotantes
        if (level === 1){
            platforms.create(400, 365, 'ground'); 
            platforms.create(100, 165, 'ground');
            platforms.create(700, 165, 'ground');
        }else if (level === 2){
            platforms.create(400, 395, 'ground'); 
            platforms.create(400, 265, 'ground');
            platforms.create(400, 135, 'platform1');
        }else if (level === 3){
            platforms.create(400, 365, 'platform1'); 
            platforms.create(100, 165, 'platform1');
            platforms.create(700, 165, 'platform1');
        }
        
        //Añade el sprite
        player = this.physics.add.sprite(400, 256, 'penguin').setScale(1.5);
        // Impide que el jugador salga de la pantalla (no funciona con grupos de elementos)
        player.setCollideWorldBounds(true);
        // Rebote (no funciona con grupos de elementos)
        player.setBounce(0.5);
        player.score = 0;
        player.setName = '1';

        if (playerQuantity === 2){
            secondPlayer = this.physics.add.sprite(700, 256, 'secondPlayer');
            secondPlayer.setCollideWorldBounds(true);
            secondPlayer.setBounce(0.5);
            secondPlayer.score = 0;
            secondPlayer.setName = '2';

            // Time
            gameTime = 60;
            textTimeGame = this.add.text(400, 16, gameTime, {fontFamily: 'font1', fontSize: "32px", fill: '#000'})
            this.refreshTime();
        }

        /*Nombre, frames, velocidad de animacion, se repite infinito */
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('penguin', {start: 9, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'penguin', frame: 7}],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('penguin', {start: 3, end:5}),
            frameRate: 10,
            repeat: -1
        });

        textScore = this.add.text(30, 16, "Score: "+player.score, {fontSize: "32px", fill: '#000'});
        // Animaciones
        if (playerQuantity === 2){
            /*Nombre, frames, velocidad de animacion, se repite infinito */
            this.anims.create({
                key: 'secondLeft',
                frames: this.anims.generateFrameNumbers('secondPlayer', {start: 0, end:3}),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'secondTurn',
                frames: [{key: 'secondPlayer', frame: 4}],
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'secondRight',
                frames: this.anims.generateFrameNumbers('secondPlayer', {start: 5, end: 8}),
                frameRate: 10,
                repeat: -1
            });

            textScoreP2 = this.add.text(555, 16, "Score P2: "+secondPlayer.score, {fontSize: "32px", fill: '#000'});
        }

        // Colisiones
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(secondPlayer, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(bombs, bombs);
        this.physics.add.collider(player, secondPlayer);
        /*
            * Overlap es cuando un objeto está encima del otro.
            * @objeto 1, @objeto 2, funcion (evento), funcion (antes de, ejemplo colision con, mientras que),
            * context: this
        */
        this.physics.add.overlap(player, stars, playerCollecStar, null, this);
        this.physics.add.collider(player, bombs, playerCollideBomb, null, this);
        this.physics.add.collider(secondPlayer, bombs, secondPlayerCollideBomb, null, this);

        if (playerQuantity == 2){
            this.physics.add.overlap(secondPlayer, stars, secondPlayerCollecStar, null, this);
        }
        
        function playerCollecStar (player, star){
            const getStar = this.sound.add('getStar');
            getStar.play({
                volume: .5,
                loop: false
            });
            player.score += 10;
            textScore.setText("Score: "+player.score);
            reestartStars(star);
        }

        function secondPlayerCollecStar (secondPlayer, star){
            secondPlayer.score += 10;
            textScoreP2.setText("Score P2: "+secondPlayer.score);
            reestartStars(star);
        }

        function reestartStars (star){
            star.disableBody(true, true);
            // Cuenta el numero de estrllas activas en pantalla.
            if (stars.countActive(true) === 0){ 
                    /*  Crear bomba
                        * x, y, sprite
                    */
                    let bomb = bombs.create(Phaser.Math.Between(0, 800), 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    /* x velocity value, y velocity value  */
                    bomb.setVelocity(Phaser.Math.Between(-400*level, 400*level) , 20);
                    // ----
                    stars.children.iterate((child) => {
                    /*
                        * reset: true, resetea tambien el body (lo vuelve a crear).
                        * x: posicion en x.
                        * y: posicion en y.
                        * enableGameObject: true, habilita el body, false, lo deja visible pero sin colociones.
                        * showGameObject: true, muestra el objeto, false lo deja oculto.
                    */
                    child.enableBody(false, child.x, 0, true, true);
                })
            }   
        }

        function playerCollideBomb (player, bombs){
            endGame(player, this);
        }

        function secondPlayerCollideBomb (secondPlayer, bombs){
            endGame(secondPlayer, this);
        }

        function endGame(player,context){

            /* sound */
                const crash = context.sound.add('crash');
                crash.play({
                    volume: .5,
                    loop: false
                });
            /* --- */


            if (playerQuantity == 1){
                context.physics.pause();
                player.setTint(0xFF3A0F);
                player.anims.play('turn');
                /***/
                context.time.addEvent({
                    delay: 500,
                    loop: false,
                    callback: () => {
                        context.scene.start("endScene");
                    } 
                });
            }else {
                // player.setTint(0xFF3A0F);
                if (player.score -50 > 0){
                    player.score -= 50;
                    if (player.setName == '1'){
                        textScore.setText("Score: "+player.score);
                    }else if (player.setName == '2'){
                        textScoreP2.setText("Score P2: "+player.score);
                    }
                }else{
                    player.score = 0;
                    if (player.setName === '1'){
                        textScore.setText("Score: 0");
                    }else if (player.setName === '2'){
                        textScoreP2.setText("Score P2: 0");
                    }
                }
            }
        }
    }

    refreshTime() {
        gameTime--;
        textTimeGame.setText(gameTime);
        
        if (gameTime === 0){
                this.physics.pause();
                player.setTint(0xFF3A0F);
                secondPlayer.setTint(0xFF3A0F);
                player.anims.play('turn');
                secondPlayer.anims.play('turn');
                /***/
                this.time.addEvent({
                    delay: 1000,
                    loop: false,
                    callback: () => {
                        this.scene.start("endScene");
                    } 
                });
        }else {
            // Se llama a sí misma cada seugndo
            this.time.delayedCall(1000, this.refreshTime, [], this);
        }

    }

    // Se ejecuta una y otra vez en un bucle infinito. Util para comprobaciones de teclado.
    update(){
        if (playerQuantity === 1){
            var scanner = this.input.keyboard.createCursorKeys();

            if (scanner.left.isDown || goLeftP1){
                player.setVelocityX(-160);
                player.anims.play('left', true);
            }else if (scanner.right.isDown || goRightP1){
                player.setVelocityX(160);
                player.anims.play('right', true);
            }else {
                player.setVelocityX(0);
                player.anims.play('turn', true);
            }
            
            if ((scanner.up.isDown || goUpP1) && player.body.touching.down){
                player.setVelocityY(-450);
                /* Salto con fuerza (solo funciona con isDown)
                    if (salto_fuerza >= 900){
                        player.setVelocityY(900);
                    }else{
                        player.setVelocityY(salto_fuerza+=50);
                    }     
                    }else{
                        salto_fuerza = 0;
                }*/
            }
        }else if (playerQuantity === 2){

            // Player one
            var scanner = this.input.keyboard.createCursorKeys();

            if (scanner.left.isDown){
                player.anims.play('left', true);
                player.setVelocityX(-160);
            }else if (scanner.right.isDown){
                player.anims.play('right', true);
                player.setVelocityX(160);
            }else {
                player.anims.play('turn', true);
                player.setVelocityX(0);
            }
            if (scanner.up.isUp && player.body.touching.down){
                player.setVelocityY(900);
            }

            // Second player
            let KeyLeft = this.input.keyboard.addKey('A');
            let KeyRight = this.input.keyboard.addKey('D');
            let KeyUp = this.input.keyboard.addKey('W');

            if (KeyLeft.isDown){
                secondPlayer.anims.play('secondLeft', true);
                secondPlayer.setVelocityX(-160);
            }else if (KeyRight.isDown){
                secondPlayer.anims.play('secondRight', true);
                secondPlayer.setVelocityX(160);
            }else {
                secondPlayer.anims.play('secondTurn', true);
                secondPlayer.setVelocityX(0);
            }
            /* -- */

            if (KeyUp.isUp && secondPlayer.body.touching.down){
                secondPlayer.setVelocityY(900);
            }
        }
    }
}

/* Menú del juego */
class MenuScene extends Phaser.Scene {
    constructor(){
        super('menuScene');
    }

    preload(){
        // Carga assets de la escena. Se ejecuta en primer lugar y una única vez
        // this.load.setPath = "../";

        let progressBar = this.add.graphics();
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let percentText = this.add.text((width/2)-50, (height/2)-5, 'Cargando... %0', {font: '18px monospace', fill: '#ffffff'});
        let assetText = this.add.text(20, 500, '', {font: '18px monospace', fill: '#ffffff'});


        /* trae data del progreso de carga */
        this.load.on('progress', function (value){
            percentText.setText("Cargando... "+parseInt(value * 100)+ "%");
            progressBar.clear();
            progressBar.fillStyle(0xfffff, 1);
            progressBar.fillRect(0, 280, parseInt(value) * width, 10);
        });

        /* trae data de los assets que cargan */
        this.load.on('fileprogress', function (file){
            assetText.setText("Cargando: " + file.key);

        })

        this.load.on('complete', function (){
            progressBar.destroy();
            percentText.destroy();
            assetText.destroy();
        })

        this.load.image("jungla_fondo", "img/BG.png");
        this.load.image("platform1", "img/platform1.png");
        this.load.image("ground", "img/platform4.png");
        this.load.image("star", "img/star.png");
        this.load.image("bomb", "img/bomb.png");
        this.load.image("controlsPlayer1", "img/Player1.png");
        this.load.image("controlsPlayer2", "img/Player2.png");
        this.load.image("backButton", "img/Player2.png");
        this.load.image("JumpingMonkey", "img/JumpingMonkey.png");
        this.load.image("menu_buttons", "img/buttons.png");
        this.load.image("level_buttons", "img/levelButtons.png");
        this.load.image("mode_buttons", "img/modeButtons.png");
        this.load.image("player1", "img/Player1text.png");
        this.load.image("player2", "img/Player2text.png");

        this.load.audio("background_music", "./sounds/Banana_Craziness.mp3");
        this.load.audio("getStar", "./sounds/Rise06.mp3");
        this.load.audio("crash", "./sounds/bzzzt.wav");

        this.load.spritesheet("dude", "img/dude.png", {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet("secondPlayer", "img/secondPlayer.png", {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet("penguin", "img/penguin_.png", {frameWidth: 24, frameHeight: 32});
    }

    create(){
        this.add.image(400, 265, 'jungla_fondo').setScale(.8);
        this.add.image(400, 65, 'JumpingMonkey');
        this.add.image(400, 315, 'menu_buttons').setScale(.9);

        textGameLevel = this.add.text(20, 480, "Level: "+gameLevel, {fontSize: '16px', fill: '#fff'});
        textGameMode = this.add.text(20, 500, "Mode: "+gameMode, {fontSize: '16px', fill: '#fff'});

        /* vertical, horizontal, alto, ancho */
            let startButton = this.add.zone(315, 135, 168, 80);
            startButton.setOrigin(0);
            startButton.setInteractive();

            let levelButton = this.add.zone(315, 228, 168, 80);
            levelButton.setOrigin(0);
            levelButton.setInteractive();
            // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(levelButton);

            let modeButton = this.add.zone(315, 320, 168, 80);
            modeButton.setOrigin(0);
            modeButton.setInteractive();

            let controlsButton = this.add.zone(315, 413, 168, 80);
            controlsButton.setOrigin(0);
            controlsButton.setInteractive();
        /* --- */

        /* EVENTS */
            startButton.once('pointerdown', () => redirectScene('gameScene', this));
            levelButton.once('pointerdown', () => redirectScene('levelScene', this));
            modeButton.once('pointerdown', () => redirectScene('modeScene', this));
            controlsButton.once('pointerdown', () => redirectScene('controllsScene', this));
        /* --- */

        function redirectScene(scene, context){
            context.time.addEvent({
                delay: 100,
                loop: false,
                callback: () => {
                    context.scene.start(scene);
                } 
            });
        }
    }

    update(){

    }
}

/* Niveles de dificultas */
class LevelScene extends Phaser.Scene {
    constructor(){
        super('levelScene');
    }

    preload(){
        this.add.image(400, 265, 'jungla_fondo').setScale(.8);
        this.add.image(400, 65, 'JumpingMonkey');
        this.add.image(400, 315, 'level_buttons').setScale(.9);

        textGameLevel = this.add.text(20, 480, "Level: "+gameLevel, {fontSize: '16px', fill: '#fff'});
        textGameMode = this.add.text(20, 500, "Mode: "+gameMode, {fontSize: '16px', fill: '#fff'});

        /* vertical, horizontal, alto, ancho */
            let easyButton = this.add.zone(315, 135, 168, 80);
            easyButton.setOrigin(0);
            easyButton.setInteractive();

            let mediumButton = this.add.zone(315, 228, 168, 80);
            mediumButton.setOrigin(0);
            mediumButton.setInteractive();

            let hardButton = this.add.zone(315, 320, 168, 80);
            hardButton.setOrigin(0);
            hardButton.setInteractive();
            // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(modeButton);

            let backButton = this.add.zone(315, 413, 168, 80);
            backButton.setOrigin(0);
            backButton.setInteractive();
        /* --- */

        /* EVENTS */
            easyButton.on('pointerdown', () => {changeLevel(1)});
            mediumButton.on('pointerdown', () => {changeLevel(2)});
            hardButton.on('pointerdown', () => {changeLevel(3)});
            backButton.on('pointerdown', () => this.scene.start('menuScene'));
        /* --- */

        function changeLevel (level_){
            level = level_;
            gameLevel = arrayLevels[level_-1];
            textGameLevel.setText("Level: "+gameLevel);
            // this.add.text(20, 480, "Level: "+gameLevel, {fontSize: '16px', fill: '#fff'});            
        }
    }

    create(){

    }

    update(){

    }
}

/* Mode */
class ModeScene extends Phaser.Scene {
    constructor(){
        super('modeScene');
    }

    preload(){
        this.add.image(400, 265, 'jungla_fondo').setScale(.8);
        this.add.image(400, 65, 'JumpingMonkey');
        this.add.image(400, 315, 'mode_buttons').setScale(.9);

        textGameLevel = this.add.text(20, 480, "Level: "+gameLevel, {fontSize: '16px', fill: '#fff'});
        textGameMode = this.add.text(20, 500, "Mode: "+gameMode, {fontSize: '16px', fill: '#fff'});

        /* vertical, horizontal, alto, ancho */
            let player1Button = this.add.zone(315, 185, 168, 80);
            player1Button.setOrigin(0);
            player1Button.setInteractive();

            let player2Button = this.add.zone(315, 275, 168, 80);
            player2Button.setOrigin(0);
            player2Button.setInteractive();

            let backButton = this.add.zone(315, 368, 168, 80);
            backButton.setOrigin(0);
            backButton.setInteractive();
            // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(backButton);
        /* --- */

        /* EVENTS */
            player1Button.on('pointerdown', () => {changeMode(1)});
            player2Button.on('pointerdown', () => {changeMode(2)});
            backButton.on('pointerdown', () => this.scene.start('menuScene'));
        /* --- */

        function changeMode (level){
            playerQuantity = level;
            gameMode = arrayModes[level-1];
            textGameMode.setText("Mode: "+gameMode);     
        }
    }

    create(){

    }

    update(){

    }
}

/* Controles de teclado o ratón */
class ControllsScene extends Phaser.Scene {
    constructor(){
        super('controllsScene');
    }

    preload(){
       
    }

    create(){
        this.add.image(400, 265, 'jungla_fondo').setScale(.8);
        this.add.image(400, 65, 'JumpingMonkey');

        this.add.image(180, 470, 'player1');
        this.add.image(180, 265, 'controlsPlayer1');

        this.add.image(620, 265, 'controlsPlayer2');
        this.add.image(620, 470, 'player2');

        let backZone = this.add.zone(0, 0, 800, 530);
        backZone.setOrigin(0);
        backZone.setInteractive();
        backZone.once('pointerdown', () => redirectScene('menuScene', this));
        
        function redirectScene(scene, context){
            context.time.addEvent({
                delay: 100,
                loop: false,
                callback: () => {
                    context.scene.start(scene);
                } 
            });
        }
    }
    update(){

    }
}

/* Fantalla de juego finalizado */
class EndGameScene extends Phaser.Scene {
    constructor(){
        super('endScene');
    }

    preload(){
    }

    create(){
        this.add.image(400, 265, 'jungla_fondo').setScale(.8);
        this.add.image(400, 65, 'JumpingMonkey');

        this.add.text(100, 150, "Player 1: "+player.score+" points.", {fontSize: '32px', fill: '#fff'})
        if (playerQuantity === 2){
            this.add.text(100, 250, "Player 2: "+secondPlayer.score+" points.", {fontSize: '32px', fill: '#fff'})
        }

        textGameLevel = this.add.text(100, 350, "Level: "+gameLevel, {fontSize: '32px', fill: '#fff'})
        this.add.text(100, 450, "Mode: "+gameMode, {fontSize: '32px', fill: '#fff'})

        let backZone = this.add.zone(0, 0, 800, 530);
        backZone.setOrigin(0);
        backZone.setInteractive();
        backZone.once('pointerdown', () => redirectScene('menuScene', this));
        // this.add.graphics().lineStyle(2, 0xffff).strokeRectShape(backZone);

        // this.scene.start('scene'):

        function redirectScene(scene, context){
            context.time.addEvent({
                delay: 100,
                loop: false,
                callback: () => {
                    context.scene.start(scene);
                } 
            });
        }
    }

    update(){

    }
}

// Configuracion general
const config = {
    // Phaser.AUTO, intenta usa WebGL y si el navegador no lo tiene, usa canva.
    type: Phaser.AUTO,
    width: 800,
    height: 530,
    scene: [MenuScene, MainScene, LevelScene, ControllsScene, ModeScene, EndGameScene],
    scale: {
        mode: Phaser.Scale.FIT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 }
        }
    }
}

// Inicializacion del objeto
game = new Phaser.Game(config)
