import React from "react";
import GameOver from "./GameOver.js"
import "../style/gameboard.css";

class Snake extends React.Component {
    constructor(props) {
        super(props);

        this.state = this.getInitialState();
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    getInitialState() {
        let state = {
            width: 0,
            height: 0,
            blockWidth: 0,
            blockHeight: 0,
            gameLoopTimeout: 25,
            timeoutId: 0,
            startSnakeSize: 0,
            snake: [],
            apple: {},
            direction: "right",
            directionChanged: false,
            gameOver: false,
            snakeColor: this.props.snakeColor || this.getRandomColor(),
            appleColor: this.props.appleColor || this.getRandomColor(),
            score: 0,
            highScore: Number(localStorage.getItem("snakeHighScore")) || 0,
            newHighScore: false,
        };
        return state
    }

    getRandomColor() {
        let hexa = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) color += hexa[Math.floor(Math.random() * 16)];
        return color;
    }

    setScore() {
        let score = this.state.score;
        let highScore = this.state.highScore;
        let newHighScore = this.state.newHighScore;

        if (score === highScore) {
            highScore++
            localStorage.setItem('snakeHighScore', highScore)
            newHighScore = true
        }

        score++

        this.setState({
            score,
            highScore,
        });
    }

    resetGame(){
        this.setState(this.getInitialState());
        this.initNewGame();
    }

    initNewGame() {
        let percentageWidth = this.props.percentageWidth || 40;
        let width = document.getElementById("GameBoard").parentElement.offsetWidth * (percentageWidth / 100);
        width -= width % 30;
        if (width < 30) width = 30;
        let height = (width / 3) * 2;
        let blockWidth = width / 30;
        let blockHeight = height / 20;

        // snake initialization
        let startSnakeSize = this.props.startSnakeSize || 6;
        let snake = [];
        let Xpos = width / 2;
        let Ypos = height / 2;
        let snakeHead = { Xpos: width / 2, Ypos: height / 2 };

        let apple = this.state.snake;
        let appleXpos;
        let appleYpos;

        snake.push(snakeHead);

        for (let i = 1; i < startSnakeSize; i++) {
            Xpos -= blockWidth;
            let snakePart = { Xpos: Xpos, Ypos: Ypos };
            snake.push(snakePart);
        }

        // apple position initialization
        [appleXpos, appleYpos] = this.createApple(apple, snake, width, height, blockWidth, blockHeight);

        this.setState({
            width,
            height,
            blockWidth,
            blockHeight,
            startSnakeSize,
            snake,
            apple: { Xpos: appleXpos, Ypos: appleYpos },
        });
    }

    randomPos(pos, size) {
        let randomPos = Math.floor(Math.random() * ((pos - size) / size + 1)) * size;
        return randomPos;
    }

    gameLoop() {
        let timeoutId = setTimeout(() => {
            if (!this.state.gameOver) {
                this.moveSnake();
                this.setState({ directionChanged: false });
            }
            //recursive function. This may break?
            this.gameLoop();
        }, this.state.gameLoopTimeout);

        this.setState({ timeoutId });
    }

    moveSnake() {
        let snake = this.state.snake;
        let newHeadPosX = this.state.snake[0].Xpos;
        let newHeadPosY = this.state.snake[0].Ypos;

        let width = this.state.width;
        let height = this.state.height;
        let blockWidth = this.state.blockWidth;
        let blockHeight = this.state.blockHeight;

        let apple = this.state.apple;
        let appleXpos = apple.Xpos;
        let appleYpos = apple.Ypos;

        switch (this.state.direction) {
            case "left":
                newHeadPosX = snake[0].Xpos <= 0 ? width - blockWidth : snake[0].Xpos - blockWidth;
                break;
            case "up":
                newHeadPosY = snake[0].Ypos <= 0 ? height - blockHeight : snake[0].Ypos - blockHeight;
                break;
            case "right":
                newHeadPosX = snake[0].Xpos >= width - blockWidth ? 0 : snake[0].Xpos + blockWidth;
                break;
            default:
                newHeadPosY = snake[0].Ypos >= height - blockHeight ? 0 : snake[0].Ypos + blockHeight;
        }

        snake.unshift({ Xpos: newHeadPosX, Ypos: newHeadPosY });

        // check if snake got eated
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].Xpos === snake[i].Xpos && snake[0].Ypos === snake[i].Ypos) {
                this.setState({ gameOver: true });
            }
        }

        // check if apple got eated and crete one if so
        if (newHeadPosX === apple.Xpos && newHeadPosY === apple.Ypos) {
            [appleXpos, appleYpos] = this.createApple(apple, snake, width, height, blockWidth, blockHeight);
            this.setScore();
        } else {
            snake.pop();
        }

        this.setState({ snake, apple: { Xpos: appleXpos, Ypos: appleYpos } });
    }

    createApple(apple, snake, width, height, blockWidth, blockHeight) {
        // create another apple
        let appleXpos = this.randomPos(width, blockWidth);
        let appleYpos = this.randomPos(height, blockHeight);

        for (let i = 0; i < snake.length; i++) {
            if (appleXpos === snake[i].Xpos && appleYpos === snake[i].Ypos) {
                [appleXpos, appleYpos] = this.createApple(apple, snake, width, height, blockWidth, blockHeight);
                break;
            }
        }

        return [appleXpos, appleYpos];
    }

    handleKeyDown(event) {
        // if spacebar is pressed to run a new game
        if (this.state.gameOver && event.keyCode === 32) {
            this.resetGame();
            return;
        }

        let newDirection = this.state.direction;

        if (this.state.directionChanged) return;

        switch (event.keyCode) {
            // left
            case 37:
            case 65:
                newDirection = this.state.direction === "right" ? "right" : "left";
                break;
            // up
            case 38:
            case 87:
                newDirection = this.state.direction === "down" ? "down" : "up";
                break;
            // right
            case 39:
            case 68:
                newDirection = this.state.direction === "left" ? "left" : "right";
                break;
            // down
            case 40:
            case 83:
                newDirection = this.state.direction === "up" ? "up" : "down";
                break;
            default:
        }
        this.setState({ directionChanged: true, direction: newDirection });
    }

    componentDidMount() {
        this.initNewGame();
        window.addEventListener("keydown", this.handleKeyDown);
        this.gameLoop();
    }

    componentWillUnmount() {
        clearTimeout(this.state.timeoutId);
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    render() {
        // Game over
        if (this.state.gameOver) {
            return <GameOver width={this.state.width} height={this.state.height} highScore={this.state.highScore} newHighScore={this.state.newHighScore} score={this.state.score} />;
        }
        return (
            <div
                id="GameBoard"
                style={{
                    width: this.state.width,
                    height: this.state.height,
                    borderWidth: this.state.width / 50,
                }}
            >
                {this.state.snake.map((snakePart, index) => {
                    return (
                        <div
                            key={index}
                            className="Block"
                            style={{
                                width: this.state.blockWidth,
                                height: this.state.blockHeight,
                                left: snakePart.Xpos,
                                top: snakePart.Ypos,
                                background: this.state.snakeColor,
                            }}
                        />
                    );
                })}
                <div
                    className="Block"
                    style={{
                        width: this.state.blockWidth,
                        height: this.state.blockHeight,
                        left: this.state.apple.Xpos,
                        top: this.state.apple.Ypos,
                        background: this.state.appleColor,
                    }}
                />
                <div id="Score" style={{ fontSize: this.state.width / 20 }}>
                    HIGH-SCORE: {this.state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE: {this.state.score}
                </div>
            </div>
        );
    }
}

export default Snake;
