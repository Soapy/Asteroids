let canvas;
let ctx;
let canvasWidth = 1200;
let canvasHeight = 800;
let keys = [];
let ship;
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 1000;
 
document.addEventListener('DOMContentLoaded', setupCanvas);
 
function setupCanvas() {
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ship = new Ship();
 
    for(let i = 0; i < 8; i++) {
        asteroids.push(new Asteroid());
    }
 
    document.body.addEventListener("keydown", HandleKeyDown);
    document.body.addEventListener("keyup", HandleKeyUp);
 
    Render();
}
 
function HandleKeyDown(e) {
    keys[e.keyCode] = true;
}
function HandleKeyUp(e) {
    keys[e.keyCode] = false;
    if (e.keyCode === 32){
        bullets.push(new Bullet(ship.angle));
    }
}
 
class Ship {
    constructor() {
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.2;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }

    Rotate(dir) {
        this.angle += this.rotateSpeed * dir;
    }

    Update() {
        let radians = this.angle / Math.PI * 180;

        if (this.movingForward) {
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }

        //prevents ship from going out of the canvas
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

        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;
    }

    Draw() {
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 3);
 
        let radians = this.angle / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
 
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}
 
class Bullet {
    constructor(angle) {
        this.visible = true;
        this.x = ship.noseX;
        this.y = ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 6;
        this.velX = 0;
        this.velY = 0;
    }

    Update() {
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    Draw() {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}
 
class Asteroid {
    constructor(x,y,radius,level,collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * canvasWidth);
        this.y = y || Math.floor(Math.random() * canvasHeight);
        this.speed = 5;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 100);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 30;
        this.level = level || 1;  
    }

    Update() {
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

    Draw() {
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
 
function CircleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    let radiusSum;
    let xDiff;
    let yDiff;
 
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;
 
    if (radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))) {
        return true;
    }
    else {
        return false;
    }
}
 
function DrawLifeShips(){
    let startX = 1350;
    let startY = 10;
    let points = [[9, 9], [-9, 9]];
    ctx.strokeStyle = 'white';
    for(let i = 0; i < lives; i++ ) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        for(let j = 0; j < points.length; j++) {
            ctx.lineTo(startX + points[j][0], 
                startY + points[j][1]);
        }

        ctx.closePath();
        ctx.stroke();
        startX -= 30;
    }
}
 
function Render() {
    ship.movingForward = (keys[87]);
 
    //D key rotates the ship to the right
    if (keys[68]) {
        ship.Rotate(1);
    }
    //A key rotates the ship to the right
    if (keys[65]) {
       ship.Rotate(-1);
    }
   
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
 
    //displays score for this session
    ctx.fillStyle = 'white';
    ctx.font = '21px Trebuchet MS';
    ctx.fillText("SCORE : " + score.toString(), 20, 35);
    //displays the amount of lives left
    ctx.fillText("LIVES : " + lives.toString(), 20, 75);

    if(lives <= 0) {
        document.body.removeEventListener("keydown", HandleKeyDown);
        document.body.removeEventListener("keyup", HandleKeyUp);

        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '70px Trebuchet MS';
        ctx.fillText("GAME OVER", canvasWidth / 2 - 150, canvasHeight / 2);
    }
 
    if(asteroids.length === 0) {
        ship.x = canvasWidth / 2;
        ship.y = canvasHeight / 2;
        ship.velX = 0;
        ship.velY = 0;
        for(let i = 0; i < 8; i++){
            let asteroid = new Asteroid();
            asteroid.speed += .5;
            asteroids.push(asteroid);
        }
    }
 
    DrawLifeShips();
    //checks collision between ship and asteroid
    if (asteroids.length !== 0) {
        for(let k = 0; k < asteroids.length; k++){
            if(CircleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
                ship.x = canvasWidth / 2;
                ship.y = canvasHeight / 2;
                ship.velX = 0;
                ship.velY = 0;
                lives -= 1;
                if(lives < 0) {
                    lives = 0;
                }
            }
        }
    }
 
    //checks collision between bullet and asteroid
    if (asteroids.length !== 0 && bullets.length != 0) {
        loop1:
            for(let l = 0; l < asteroids.length; l++) {
                for(let m = 0; m < bullets.length; m++) {
                    if(CircleCollision(bullets[m].x, bullets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
                        asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5, 25, 2, 22));
                        asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5, 25, 2, 22));
                        asteroids.splice(l,1);
                        bullets.splice(m,1);
                        score += 20;
                        break loop1;
                    }
                }
            }
    }

    if(ship.visible) {
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
            asteroids[j].Draw(j);
        }
    }
 
    requestAnimationFrame(Render);
}
