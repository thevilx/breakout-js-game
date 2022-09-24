const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 890
const boardHeight = 500
const speed = 35;

let xDirection = 2
let yDirection = 2
let score = 0;

const userStart = [330, 10]
let currentPosition = userStart

const ballStart = [370, 35]
let ballCurrentPosition = ballStart

let timerId;

class Block{
    constructor(x , y){
        this.x = x;
        this.y = y;
    }
}

// create blocks

const blocks = [];

for (y of [470 , 440 , 410]){
    for(x of [10,120,230,340,450,560,670,780]){
        blocks.push(new Block(x, y))
    }
}

function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
      const block = document.createElement('div')
      block.classList.add('block')
      block.style.left = blocks[i].x + 'px'  
      block.style.bottom = blocks[i].y + 'px'  
      grid.appendChild(block)
    }
  }
  addBlocks()


// add user 
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()


document.addEventListener('keydown', moveUser);
timerId = setInterval(moveBall , 10)





function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}
  
  //draw Ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}


function moveBall(){
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollision();
}

function checkForCollision(){

    // ball touches x
    if(ballCurrentPosition[0] <= 0 || ballCurrentPosition[0] >= (boardWidth - ballDiameter)){
        changeDirection(true , false);    
    }

    // ball touches axis y
    if(ballCurrentPosition[1] >= boardHeight - ballDiameter ){
        changeDirection(false , true);
    }

    // ball touches user block 
    if( ballCurrentPosition[0] <= userStart[0] + blockWidth && ballCurrentPosition[0] >= userStart[0] && 
        ballCurrentPosition[1] <= userStart[1] + blockHeight && ballCurrentPosition[1] >= userStart[1]
    ){
        changeDirection(false , true , randomIntFromInterval(0 , 2));
    }


    //check for block collision
    for (let i = 0; i < blocks.length; i++){
        if(
        ballCurrentPosition[0] > blocks[i].x && ballCurrentPosition[0] < blocks[i].x + blockWidth

        
        && (ballCurrentPosition[1] > blocks[i].y - blockHeight && ballCurrentPosition[1] < blocks[i].y + blockHeight) 
        
        )
        {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i,1)
            changeDirection(true , true)   
            score++
            scoreDisplay.innerHTML = score
            if (blocks.length == 0) {
                scoreDisplay.innerHTML = 'You Win!'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }

    // ball touches ground
    if(ballCurrentPosition[1] <= 0 ){
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
        alert("you lost ...")
    }

}

function changeDirection(changeX = false , changeY = false , changeXwidth = 2){
    
    if(xDirection >= 0)
        xDirection = changeXwidth;
    else 
        xDirection = -1 * changeXwidth;

    if(changeX)
        xDirection *= -1;

    if(changeY)
        yDirection *= -1;


    // xDirection *= 1.05
    // yDirection *= 1.05 // increase speed in each move
}


// Events
function moveUser(e){

    let diffrence = 0;

    switch (e.key) {

        case 'ArrowLeft':
          if (currentPosition[0] > 0) {
            // currentPosition[0] -= speed

            diffrence = currentPosition[0];
            moveUserCheckWalls(diffrence , true)

            drawUser()   
          }

          break

        case 'ArrowRight':

          if (currentPosition[0] < (boardWidth - blockWidth)) {

            diffrence = (boardWidth - blockWidth) - currentPosition[0];
            moveUserCheckWalls(diffrence)


            drawUser()   
          }

          break
      }
}

function moveUserCheckWalls( diffrence , reverseMovement = false){

    if(diffrence < speed) // make sure user block dosent go outside of the walls
        currentPosition[0] += (diffrence * (reverseMovement ? -1 : 1));
    else 
        currentPosition[0] += (speed * (reverseMovement ? -1 : 1));
    
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  