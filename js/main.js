var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 5;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 334;
var paddle2Y = 334;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

var src = document.getElementById("gameCanvas");
var paddleHit = document.getElementById("paddleHit");
var wallHit = document.getElementById("wallHit");
var ballBuzz = document.getElementById("ballBuzz");

function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return{
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt){
  if(showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function(){
  console.log("Game is started");

  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function(){
        moveEverything();
        drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove',
    function(evt){
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
    });
}

function ballReset(){
  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement(){
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

  if(paddle2YCenter < ballY - 35){
    paddle2Y += 6;
  }else if(paddle2YCenter > ballY + 35){
    paddle2Y -= 6;
  }
}

function moveEverything(){
  src.style.cssText = "cursor: ns-resize; border-top: 5px solid white; border-bottom: 5px solid white;";
  if(showingWinScreen){
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if(ballX < 0){
    if(ballY > paddle1Y &&
       ballY < paddle1Y + PADDLE_HEIGHT){
         ballSpeedX = -ballSpeedX;
         var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
         ballSpeedY = deltaY * 0.35;
         paddleHit.play();
       }else{
         ballBuzz.play();
         player2Score++; // must be BEFORE ballReset()
         ballReset();
       }
  }
  if(ballX > canvas.width){
    if(ballY > paddle2Y &&
       ballY < paddle2Y + PADDLE_HEIGHT){
         ballSpeedX = -ballSpeedX;
         var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
         ballSpeedY = deltaY * 0.35;
         paddleHit.play();
       }else{
         ballBuzz.play();
         player1Score++;
         ballReset();
       }
  }

  if(ballY < 0){
    wallHit.play();
    ballSpeedY = -ballSpeedY;
  }
  if(ballY > canvas.height){
    wallHit.play();
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet(){
  for(var i=0; i < canvas.height; i+=44){
    canvasContext.textAlign = "center";
    colorRect(canvas.width/2, i, 5, 20, 'white');
  }
}

function drawEverything(){
  // next line blanks out the screen with black
  colorRect(0,0,canvas.width,canvas.height,'black');

  if(showingWinScreen){
    src.style.cssText = "cursor: pointer; border-top: 5px solid black; border-bottom: 5px solid black";
    canvasContext.fillStyle = 'white';

    if(player1Score >= WINNING_SCORE){
      canvasContext.font = "45px retro_computer_personal_use";
      canvasContext.fillText("You Won!", canvas.width/2, canvas.height/2);
    }else if(player2Score >= WINNING_SCORE){
      canvasContext.font = "45px retro_computer_personal_use";
      canvasContext.fillText("Computer Won!", canvas.width/2, canvas.height/2);
    }

    canvasContext.font = "20px retro_computer_personal_use";
    canvasContext.fillText("Click to continue", canvas.width/2, (canvas.height/2) + (canvas.height/2)/2);
    return;
  }

  drawNet();

  // this is left player paddle
  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // this is right player paddle
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // next line draws the ball
  colorCircle(ballX, ballY, 10, 'white');

  canvasContext.font = "30px retro_computer_personal_use";
  canvasContext.textAlign = "center";
  canvasContext.fillText(player1Score, (canvas.width/2)/2, (canvas.height/2)/2);
  canvasContext.fillText(player2Score, (canvas.width/2) + (canvas.width/2)/2, (canvas.height/2)/2);
}

function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX,topY,width,height,drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY,width,height);
}



































// END
