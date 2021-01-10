import React, { useRef, useEffect } from "react";
import "../style/gameboard.css";

class Snake extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 500,
            height: 500,
            snake: [],
            snakeHead: { x: this.width / 2, y: this.height / 2 },
            direction: "right",
            foodPosition: [],
            isPaused: false,
            currentLength: 0,
            intialLength: 3,
            foodNumber: 0,
            foodEaten: 0,
            score: 0,
            highScore: Number(localStorage.getItem("snakeHighScore")) || 0,
        };

        this.canvasRef = React.createRef();
    }

    setInitialScore() {
        let score = this.state.score;
        let highScore = this.state.highScore;

        this.setState({
            score,
            highScore,
        });
    }

    //setStatus(status) {
    //    document.getElementById("status").innerText = status;
    //}

    //setSpeed() {
    //    timer = this.setInterval(function () {
    //        move(direction);
    //    }, milliseconds);
    //    document.getElementById("milliseconds").innerText = speed;
    //}

    initCanvas() {
        let width = this.state.width;
        let height = this.state.height;

        let snake = this.state.snake;
        let foodPosition = this.state.foodPosition;
        let initialLength = this.state.initialLength || 5;
        let snakeLength = this.state.currentLength;
        let blockWidth = 5;
        let blockHeight = 5;

        const canvas = this.canvasRef.current;
        const context = canvas.getContext("2d");

        let Xpos = this.state.Xpos || this.state.width / 2;
        let Ypos = this.state.Ypos || this.state.height / 2;

        let snakeHead = { x: Xpos, y: Ypos };
        snake.push(snakeHead);
        context.fillRect(snakeHead["x"], snakeHead["y"], blockWidth, blockWidth);

        for (let i = 1; i < initialLength; i++) {
            Xpos = Xpos - blockWidth;
            let snakePart = { x: Xpos, y: Ypos };
            snake.push(snakePart);
            context.fillRect(snakePart["x"], snakePart["y"], blockWidth, blockWidth);
        }

        let appleXpos = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
        let appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
        //avoid initial foodPosition on top of snake
        while (appleYpos === snake[0].Ypos) {
            appleYpos = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
        }

        foodPosition.push({x: appleXpos, y: appleYpos})
        context.fillRect(appleXpos, appleYpos, blockWidth, blockWidth);

        this.setState({
            snake,
            foodPosition,
        });
    }

    componentDidMount() {
        this.setInitialScore();
        this.initCanvas();
    }

    render() {
        return (
            <div id="GameBoard">
                <canvas ref={this.canvasRef} id="Canvas" width={this.state.width} height={this.state.height} />
                <div id="Score" style={{ fontSize: this.state.width / 20 }}>
                    HIGH-SCORE: {this.state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE: {this.state.score}
                </div>
            </div>
        );
    }
}

export default Snake;
