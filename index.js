const canvas = document.getElementById("idcanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * .9;

let score = 0;
let gameRunning = true;
const maxVillains = 5;

function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#1c182f");
    grad.addColorStop(1, "#15171e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "30px Verdana";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Record " + score, canvas.width / 2, 23);
}

class Bullet {
    constructor(x, y, width, height, speed, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y -= this.speed;
    }
}

class Player {
    constructor(img) {
        this.img = img;
        this.speed = 30;
        this.posX = canvas.width / 2 - 40;
        this.posY = canvas.height - 100;
        this.width = 80;
        this.height = 80;
        this.bullets = [];
    }

    drawPlayer() {
        ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    }

    moveRight() {
        if (this.posX + this.width < canvas.width) {
            this.posX += this.speed;
        }
    }

    moveLeft() {
        if (this.posX > 0) {
            this.posX -= this.speed;
        }
    }

    shootBullet() {
        this.bullets.push(new Bullet(this.posX + this.width / 2 - 2.5, this.posY, 5, 10, 7, 'yellow'));
    }

    drawBullets() {
        this.bullets.forEach(bullet => bullet.draw());
    }

    moveBullets() {
        this.bullets.forEach((bullet, index) => {
            bullet.move();
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });
    }
}

class Villain {
    constructor(img) {
        this.img = img;
        this.width = 60;
        this.height = 65;
        this.posX = Math.random() * (canvas.width - this.width);
        this.posY = 0;
        this.speed = 2;
        this.bullets = [];
    }

    drawVillain() {
        ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
    }

    move() {
        this.posY += this.speed;
        if (this.posY + this.height > canvas.height) {
            this.posY = -this.height;
        }
    }

    shootBullet() {
        if (Math.random() < 0.01) { // Ajustar la probabilidad de disparo
            this.bullets.push(new Bullet(this.posX + this.width / 2 - 2.5, this.posY + this.height, 5, 10, -5, 'red'));
        }
    }

    drawBullets() {
        this.bullets.forEach(bullet => bullet.draw());
    }

    moveBullets() {
        this.bullets.forEach((bullet, index) => {
            bullet.move();
            if (bullet.y > canvas.height) {
                this.bullets.splice(index, 1);
            }
        });
    }
}

let player;
let villains = [];

function init() {
    const imgPlayer = document.getElementById("image-nave");
    const imgVillain1 = document.getElementById("img-villain1");
    const imgVillain2 = document.getElementById("img-villain2");

    player = new Player(imgPlayer);

    for (let i = 0; i < maxVillains; i++) {
        let img = Math.random() > 0.5 ? imgVillain1 : imgVillain2;
        villains.push(new Villain(img));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') player.moveRight();
        if (event.key === 'ArrowLeft') player.moveLeft();
        if (event.key === ' ') player.shootBullet();
    });
    document.getElementById('btn-left').addEventListener('click', () => {
        player.moveLeft();
    });

    document.getElementById('btn-shoot').addEventListener('click', () => {
        player.shootBullet();
    });

    document.getElementById('btn-right').addEventListener('click', () => {
        player.moveRight();
    });

    gameRunning = true;
    requestAnimationFrame(updateGame);
}

function detectCollisions() {
    // Colisión entre balas del jugador y villanos
    player.bullets.forEach((bullet, bulletIndex) => {
        villains.forEach((villain, villainIndex) => {
            if (bullet.x < villain.posX + villain.width &&
                bullet.x + bullet.width > villain.posX &&
                bullet.y < villain.posY + villain.height &&
                bullet.y + bullet.height > villain.posY) {
                player.bullets.splice(bulletIndex, 1);
                villains.splice(villainIndex, 1);
                score++;
                // Regenerar villano
                const imgVillain1 = document.getElementById("img-villain1");
                const imgVillain2 = document.getElementById("img-villain2");
                let img = Math.random() > 0.5 ? imgVillain1 : imgVillain2;
                villains.push(new Villain(img));
            }
        });
    });

    // Colisión entre balas de los villanos y el jugador
    villains.forEach(villain => {
        villain.bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < player.posX + player.width &&
                bullet.x + bullet.width > player.posX &&
                bullet.y < player.posY + player.height &&
                bullet.y + bullet.height > player.posY) {
                gameRunning = false;
                alert("Game Over!");
                location.reload();
            }
        });
    });
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    player.drawPlayer();
    player.drawBullets();
    player.moveBullets();

    villains.forEach(villain => {
        villain.move();
        villain.shootBullet();
        villain.drawVillain();
        villain.drawBullets();
        villain.moveBullets();
    });

    detectCollisions();

    requestAnimationFrame(updateGame);
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
}

var rect = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 - 50,
    width: 300,
    height: 160
};

canvas.addEventListener('click', function (evt) {
    var mousePos = getMousePos(canvas, evt);
    if (isInside(mousePos, rect)) {
        hideButton();
        init();
    }
}, false);

function Playbutton(rect) {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = '#602010';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.closePath();
    ctx.font = '20pt Kremlin Pro Web';
    ctx.fillStyle = '#000000';
    //ctx.fillText(' Jugar', rect.x + rect.width / 4, rect.y + 64);
    ctx.fillText('DA CLICK PARA JUGAR', rect.x + rect.width / 2, rect.y + 30);
    ctx.fillText('(puedes moverte', rect.x + rect.width / 2, rect.y + 60);
    ctx.fillText('con las flechas del', rect.x + rect.width / 2, rect.y + 90);
    ctx.fillText('teclado o con los botones)', rect.x + rect.width / 2, rect.y + 120);
}

function hideButton() {
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    drawBackground();
}

drawBackground();
Playbutton(rect);