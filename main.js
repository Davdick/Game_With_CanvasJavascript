const canvas = document.getElementById("idcanvas");
const ctx = canvas.getContext("2d");

var windowH = window.innerHeight;
var windowW = window.innerWidth;

canvas.width = windowW;
canvas.height = windowH;

//canvas.style.background = "red";

// Create linear gradient
function drawBackground(){
  const grad=ctx.createLinearGradient(0,0, 0,130);
  grad.addColorStop(0, "lightblue");
  grad.addColorStop(1, "#171736");
  
  // Fill rectangle with gradient
  ctx.fillStyle = grad;
  ctx.fillRect(10,10, windowW,windowH);
  
  var score = 0;
  var btnVisible = true;
  ctx.font = "30px Verdana";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Record " + score, canvas.width/2,23);
}

class Player{
  constructor(img){
      this.img = img;
      this.speed = 5;
      this.posX = canvas.width/1.9;
      this.posY = canvas.height/1.35;
      this.width = 80;
      this.height = 80;
      this.bullets = [];
      this.spacePressed = false;
  }

  drawPlayer(){
      ctx.drawImage(this.img, this.posX, this.posY, 80, 80);
      
  }

  moveRight(){
    this.posX += this.speed;
  }

  moveLeft(){
    this.posX -= this.speed;
  }
  
  drawBullets(){
    
    //   ctx.beginPath();
    //   ctx.arc(this.posX, this.posY, 10, 0, Math.PI * 2);
    //   ctx.fill();
    
    // let posx = this.posX;
    // let posy = this.posY;
            ctx.fillStyle = 'yellow';
            this.bullets.forEach(bullet => {
                ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            });
    // let i = this.posY;
    // while(i>0){
    //   // Mover el círculo hacia arriba
    //   this.posY -= 20;
    //   // Borrar solo la parte del canvas ocupada por el círculo anteriormente dibujado
    // ctx.clearRect(this.posX - 10 - 1, this.posY - 10 - 1, 10 * 2 + 2, 10 * 2 + 2);
    // ctx.beginPath();
    //   ctx.arc(this.posX, this.posY, 10, 0, Math.PI * 2);
    //   ctx.fill();
    //   i--;
    // }
    
  }
  shootBullet() {
    if (this.spacePressed) {
        this.bullets.push({ x: this.posX + this.width / 2 - 2.5, y: this.posY, width: 5, height: 10, speed: 7 });
        this.spacePressed = false; // Para evitar disparos continuos
    }
  }
  moveBullets() {
    this.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            this.bullets.splice(index, 1);
        }
    });
}
}

class Villain extends Player{

      constructor(img){
        super(img);
      }
      drawPlayer(){
        const canvasWidth = canvas.width;

        // Calcular el rango deseado (canvasWidth - 100 - 80)
        const rango = canvasWidth - 100 - 80;

        // Generar un número aleatorio dentro del rango y luego sumarle el mínimo
        const numR = Math.floor(Math.random() * (rango + 1)) + 80;
        ctx.drawImage(this.img, numR , 60, 60, 65);
      }

      died(){

      }

}

class Ball {
  constructor(color){
    this.color = color;
  }

}

drawBackground();


// Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  
  // Function to check whether a point is inside a rectangle
  function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
  }
  
  // The rectangle should have x,y,width,height properties
  var rect = {
    x: windowW/2,
    y: windowH/2,
    width: 200,
    height: 100,
  };
  
  canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
  
    if (isInside(mousePos, rect)){
        //let img = document.getElementById("image-nave");
        hideButton();
       // var player = new Player(img);
        StartGame();
    }
  }, false);
  
  // Question code
  function Playbutton(rect, lWidth, fillColor, lineColor) {
    
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = '#602010';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.closePath();
    ctx.font = '40pt Kremlin Pro Web';
    ctx.fillStyle = '#000000';
    ctx.fillText(' Jugar', rect.x + rect.width / 4, rect.y + 64);
    //btnVisible = true;
    
  }

  function hideButton() {
    //btnVisible = false;
    ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    drawBackground();
    
  }
  Playbutton(rect);

  // player.moveRight();

  function StartGame(){

    const imgPlayer = document.getElementById("image-nave");
    const imgVillain1 = document.getElementById("img-villain1");
    const imgVillain2 = document.getElementById("img-villain2");

    var player = new Player(imgPlayer);
    player.drawPlayer();

    var arrayVillains = []

    for(let i = 0; i<5; i++){
      let numeroRandom = Math.floor(Math.random() * 5) + 1;
      let imgV = imgVillain1;
      if(numeroRandom>=2.5)
        imgV = imgVillain2;
        arrayVillains.push(new Villain(imgV));
    }

    arrayVillains.forEach(villain => {
      villain.drawPlayer();
    });

    document.addEventListener('keydown', function(event) {
      
      switch(event.key) {
        case 'ArrowRight':
            console.log('Flecha derecha presionada');
            player.spacePressed = false;
            player.moveRight();
            break;
        case 'ArrowLeft':
            console.log('Flecha izquierda presionada');
            // Código para flecha izquierda
            player.spacePressed = false;
            player.moveLeft();
            break;
        case ' ':
            console.log('tecla space presionada');
            player.spacePressed = true;
            player.drawBullets();
            player.shootBullet();
            player.moveBullets();
            
            break;
        case 'ArrowDown':
            console.log('Flecha abajo presionada');
            // Código para flecha abajo
            break;
        default:
            break;
    }
  
    }, false);
  
    requestAnimationFrame(StartGame);
  }
  