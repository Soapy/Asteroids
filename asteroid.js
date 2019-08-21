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
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ship = new Ship();
 
    for(let i = 0; i < 8; i++){
        asteroids.push(new Asteroid());
    }

    document.body.addEventListener("keydown", HandleKeyDown);
    document.body.addEventListener("keyup", HandleKeyUp);
    Render();
}

class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
        this.noseX = canvasWidth / 2 + 15; // bullet fires from the nose of the ship
        this.noseY = canvasHeight / 2;
    }

    rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }

    update() {
        let radians = this.angle / Math.PI * 180;

        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }
        // prevent player's ship from leaving the board
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
        // ship slows if no key press is detected
        this.velX *= 0.99;
        this.velY *= 0.99;
   
        this.x -= this.velX;
        this.y -= this.velY;
    }

    draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        // Angle between vertices of the ship
        let vertAngle = ((Math.PI * 2) / 3);
 
        let radians = this.angle / Math.PI * 180;
        // Where to fire bullet from
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
 
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
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

    update() {
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    draw() {
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

    update() {
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

    draw(){ 
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

function Render() {
    ship.movingForward = (keys[87]);
 
    if (keys[68]) {
        // d key rotate right
        ship.Rotate(1);
    }
    if (keys[65]) {
        // a key rotate left
       ship.Rotate(-1);
    }
   
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
 
    if(lives <= 0){
        document.body.removeEventListener("keydown", HandleKeyDown);
        document.body.removeEventListener("keyup", HandleKeyUp);
 
        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
    }

    if(ship.visible){
        ship.Update();
        ship.Draw();
    }
    
    if (bullets.length !== 0) {
        for(let i = 0; i < bullets.length; i++){
            bullets[i].Update();
            bullets[i].Draw();
        }
    }

    if (asteroids.length !== 0) {
        for(let j = 0; j < asteroids.length; j++){
            asteroids[j].Update();
            // Pass j so we can track which asteroid points
            // to store
            asteroids[j].Draw(j);
        }
    }
}