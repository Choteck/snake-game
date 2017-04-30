size = 10
milliseconds = 100
speed = 1
initialLength = 5

function support() {
    canvas = document.getElementById('base')
    context = canvas.getContext('2d')
    start()
}

function start() {
    snake = []
    snakeHead = { 'x': canvas.width / 2, 'y': canvas.height / 2 }
    direction = 'right'
    foodPosition = []
    context.clearRect(0, 0, canvas.width, canvas.height)
    isPaused = false
    length = initialLength

    setFoodEaten()
    setSpeed()
    drawSnake()
    drawFood()
    setStatus('Press P to pause the game')

    //timer = setInterval(function() { move(direction) }, milliseconds)
}

function setFoodEaten() {
    document.getElementById('foodEaten').innerText = length - initialLength
}

function setStatus(status) {
    document.getElementById('status').innerText = status
}

function setSpeed() {
    //clearInterval(timer)
    timer = setInterval(function() { move(direction) }, milliseconds)
    document.getElementById('milliseconds').innerText = speed
}

function drawSnake() {
    if (snake.some(checkIfEaten)) {
        end()
        return 0
    }

    snake.push([snakeHead['x'], snakeHead['y']])
    context.fillRect(snakeHead['x'], snakeHead['y'], size, size)


    if (snake.length >= length) {
        body = snake.shift()
        context.clearRect(body[0], body[1], size, size)
    }

    if (snakeHead['x'] == foodPosition['x'] && snakeHead['y'] == foodPosition['y']) {
        length++
        setFoodEaten()
        drawFood()
    }
}

function checkIfEaten(snake) {
    return (snake[0] == snakeHead['x'] && snake[1] == snakeHead['y'])
}

function drawFood() {
    foodPosition = { 'x': (Math.floor(Math.random() * (canvas.width / size)) * size), 'y': (Math.floor(Math.random() * (canvas.height / size)) * size) }
    if (snake.some(checkFoodPosition))
        drawFood()
    else {
        context.fillRect(foodPosition['x'], foodPosition['y'], size, size)
    }
}

function checkFoodPosition(snake) {
    return (snake[0] == foodPosition['x'] && snake[1] == foodPosition['y'])
}

document.onkeydown = function(event) {
    var keyCode = window.event.keyCode

    // A or LEFT_ARROW
    if (keyCode == 65 || keyCode == 37) {
        if (currentDirection != 'right' && !isPaused) {
            direction = 'left'
                //move('left')
        }
    }
    //W or UP_ARROW
    else if (keyCode == 87 || keyCode == 38) {
        if (currentDirection != 'down' && !isPaused) {
            direction = 'up'
                //move('up')
        }
    }
    //D or RIGHT_Arrow
    else if (keyCode == 68 || keyCode == 39) {
        if (currentDirection != 'left' && !isPaused) {
            direction = 'right'
                //move('right')
        }
    }
    //S or DOWN_ARROW
    else if (keyCode == 83 || keyCode == 40) {
        if (currentDirection != 'up' && !isPaused) {
            direction = 'down'
                //move('down')
        }
    }
    //Restart the Game
    else if (keyCode == 82) {
        clearInterval(timer)
        isPaused = true
        start()
    }
    //Press P to Pause/Continue the game
    else if (keyCode == 80) {
        //Continue the Game
        if (isPaused) {
            timer = setInterval(function() { move(direction) }, milliseconds)
            isPaused = false
            setStatus('Pause the game by press P')
        }
        //Pause the Game
        else {
            clearInterval(timer)
            isPaused = true
            setStatus('Continue the game by press P')
        }
    }
    // Increase Speed
    else if (keyCode == 107 && !isPaused && milliseconds > 20) {
        milliseconds -= 10
        speed += 1
        clearInterval(timer)
        setSpeed()
    }
    // Decrease Speed
    else if (keyCode == 109 && !isPaused && milliseconds < 100) {
        milliseconds += 100
        speed -= 1
        clearInterval(timer)
        setSpeed()
    }
    //console.log(keyCode)
}

//Change direction
function move(direction) {
    if (direction == 'left') {
        if (position(direction) >= 0)
            execute(direction, 'x', position(direction))
        else
            end()
    } else if (direction == 'up') {
        if (position(direction) >= 0)
            execute(direction, 'y', position(direction))
        else
            end()
    } else if (direction == 'right') {
        if (position(direction) < canvas.width)
            execute(direction, 'x', position(direction))
        else
            end()
    } else if (direction == 'down') {
        if (position(direction) < canvas.width)
            execute(direction, 'y', position(direction))
        else
            end()
    }
}

//Return new position
function position(direction) {
    if (direction == 'left')
        newPosition = snakeHead['x'] - size
    else if (direction == 'up')
        newPosition = snakeHead['y'] - size
    else if (direction == 'right')
        newPosition = snakeHead['x'] + size
    else if (direction == 'down')
        newPosition = snakeHead['y'] + size

    return newPosition
}

function execute(direction, axis, value) {
    this.direction = direction
    currentDirection = direction
    snakeHead[axis] = value
    drawSnake()
}

function end() {
    clearInterval(timer)
    isPaused = true
    setStatus('Game over! Restart the game by pressing R')
}