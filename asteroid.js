let canvas;
let ctx;
let ship;
let canvasWidth = 1400;
let canvasHeight = 1000;
let keys = [];

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ship = new Ship();

    //possibly move listeners elsewhere
    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
    });
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
    });

    //draws the player's ship and enemies/projectiles
    render();
}

class Ship {
    constructor() {
        this.visible = true;

        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;

        this.isMoving = false;
        this.speed = 0.1;
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotationSpeed = 0.1;

        this.radius = 20;
        this.anglePos = 0;
        this.strokeColor = "white";
    }

    rotate(isClockwise) {
        let clockwiseValue = isClockwise ? 1 : -1;
        this.angle += this.rotationSpeed * clockwiseValue;
    }
    
    update() {
        let radians = this.anglePos / Math.PI * 180; //formula for radians
        if(this.isMoving) {
            this.velocityX += Math.cos(radians) * this.speed;
            this.velocityY += Math.sin(radians) * this.speed;
        }
        
        if(this.x < this.radius) {
            this.x = canvas.width;
        }
        if(this.x > canvas.width) {
            this.x = this.radius;
        }
        if(this.y < this.radius) {
            this.x = canvas.height;
        }
        if(this.y > canvas.height) {
            this.x = this.radius;
        }
        this.velocityX *= .9;
        this.velocityY *= .9;

        this.x -= this.velocityX;
        this.Y -= this.velocityY;
    }
    
    draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();

        let vertexAngle = ((Math.pi * 2) / 3);
        let radians = this.anglePos / Math.PI * 180;

        for(let i = 0; i < 3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertexAngle * i + radians), 
            this.y - this.radius * Math.sin(vertexAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}


function render() {
    ship.isMoving = (keys[68]) //keycode for w

    if(keys[68]) { //keycode for a
        ship.rotate(true);
    }
    if(keys[65]) { //keycode for d
        ship.rotate(false);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.update();
    ship.draw()
    requestAnimationFrame(render);
}

class Bullet{
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }
    Draw(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Asteroid{
    constructor(x,y,radius,level,collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 3;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        // Used to decide if this asteroid can be broken into smaller pieces
        this.level = level || 1;  
    }
    Update(){
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;
        if (this.x < this.radius) {
            this.x = canvas.width;
        }
        if (this.x > canvas.width) {
            this.x = this.radius;
        }
        if (this.y < this.radius) {
            this.y = canvas.height;
        }
        if (this.y > canvas.height) {
            this.y = this.radius;
        }
    }
    Draw(){
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 6);
        var radians = this.angle / Math.PI * 180;
        for(let i = 0; i < 6; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}