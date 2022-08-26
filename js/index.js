// Variables y funcionnes comunes
let level = 3;
let playerQuantity = 1;
let player = "";
let secondPlayer = "";
let platforms = "";
let stars = "";
let score = 0;
// Clases
/* Escena principal del videojuego */
class MainScene extends Phaser.Scene {
    constructor(){
        super('gameScene');
    }

    preload(){
        // Carga assets de la escena. Se ejecuta en primer lugar y una única vez
        this.load.setBaseURL = "../";
        this.load.image("jungla_fondo", "img/background.png");
        this.load.image("platform1", "img/platform1.png");
        this.load.image("ground", "img/platform4.png");
        this.load.image("star", "img/star.png");
        this.load.image("bomb", "img/bomb.png");
        this.load.image("controlsPlayer1", "img/Player1.png");
        this.load.image("controlsPlayer2", "img/Player2.png");

        this.load.spritesheet("dude", "img/dude.png", {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet("secondPlayer", "img/secondPlayer.png", {frameWidth: 32, frameHeight: 48});
    }
 
    create(){
        //Aquí va la logia del juego. Eventos, coliciones, etc.
        //Tambine se ejectua una única vez, pero despues de preload.

        /* vertical position, horizontal position, name image.
        * setScale(2) indica que la imagen tnedrá el doble de su tamaño (1 es su valor por defecto y 0 desaparece la imagen).
        */
        this.add.image(400, 265, 'jungla_fondo').setScale(2);
        platforms = this.physics.add.staticGroup();
        platforms.create(190, 498, 'ground'); 
        platforms.create(380, 498, 'ground'); 
        platforms.create(570, 498, 'ground'); 
        platforms.create(950, 498, 'ground'); 

        platforms.create(190, 528, 'ground'); 
        platforms.create(380, 528, 'ground'); 
        platforms.create(570, 528, 'ground'); 
        platforms.create(950, 528, 'ground'); 

        // Crea el objeto con un JSON
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11, 
            setXY: { x:100, y:0, stepX: 50}
        });
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
        
        if (playerQuantity === 1){
            //Añade el sprite
            player = this.physics.add.sprite(400, 256, 'dude');
            // Impide que el jugador salga de la pantalla (no funciona con grupos de elementos)
            player.setCollideWorldBounds(true);
            // Rebote (no funciona con grupos de elementos)
            player.setBounce(0.5);
        } else if (playerQuantity === 2){
            player = this.physics.add.sprite(100, 256, 'dude');
            secondPlayer = this.physics.add.sprite(700, 256, 'secondPlayer');
            
            player.setCollideWorldBounds(true);
            secondPlayer.setCollideWorldBounds(true);

            player.setBounce(0.5);
            secondPlayer.setBounce(0.5);
        }

        

        // Colisiones
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(secondPlayer, platforms);
        this.physics.add.collider(stars, platforms);
        /*
            * Overlap es cuando un objeto está encima del otro.
            * @objeto 1, @objeto 2, funcion (evento), funcion (antes de, ejemplo colision con, mientras que),
            * this
            */
        this.physics.overlap(stars, player, this.collecStar, null, this);
    }

    update(){
        // Se ejecuta una y otra vez en un bucle infinito. Util para comprobaciones de teclado.
        var scanner = this.input.keyboard.createCursorKeys();

        if (scanner.left.isDown){
            player.setVelocityX(-160);
        }else if (scanner.right.isDown){
            player.setVelocityX(160);
        }
    }

    collecStar (){
        console.log("score");
        score++;
        console.log(score);
    }
}

/* Menú del juego */
class MenuScene extends Phaser.Scene {
    constructor(){
        super('menuScene');
    }

    preload(){

    }

    create(){

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

    }

    update(){

    }
}

/* Fantalla de juego finalizado */
class EndGamelScene extends Phaser.Scene {
    constructor(){
        super('endScene');
    }

    preload(){

    }

    create(){

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
    scene: [MainScene, MenuScene, LevelScene, ControllsScene, EndGamelScene, ModeScene],
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
new Phaser.Game(config)
