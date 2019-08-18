let canvas;
let ctx;
let canvasWidth = 1000;
let canvasHeight = 1000;
let keys = [];

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    canvas.canvasWidth = canvasWidth;
    canvas.canvasHeight = canvasHeight;
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    //possibly move listeners elsewhere
    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
    });
    //draws the player's ship and enemies/projectiles
    (function render() {

    })();
}

class Ship {
    constructor(width, height) {
        this.visible = true;

        this.x = width / 2;
        this.y = height / 2;

        this.isMoving = false;
        this.speed = 1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotationSpeed = 0.1;

        this.radius = 20;
        this.anglePos = 0;
        this.strokeColor = "white";
    }
    
    update() {
        let radians = anglePos / Math.PI * 180; //formula for radians
        if(isMoving) {
            //TODO: define how velocityX and velocityY updates (this requires some trig) relative to the ship's speed
        }
    }
}

let ship = new Ship(canvasWidth, canvasHeight);
