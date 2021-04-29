import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import SnakeGame from '../../class/SnakeGame';
import GameOverWindow from '../../components/GameOverWindow';

const StyledSnakeGameComponent = styled.div`
  width: 100%;
  height: 100%;
  background: #1e212d;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Raleway', sans-serif;
`;

const GameTitle = styled.div`
  color: #faf3e0;
  font-size: 52px;
  margin: 60px 0px;
`;

const GameScreen = styled.div`
  width: ${props => props.gridScreenWidth}px;
  height: ${props => props.gridScreenWidth}px;
  border: 2px solid #b68973;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`;

const MapGrid = styled.div`
  width: ${props => props.gridSize}px;
  height: ${props => props.gridSize}px;
  border: 1px solid #b6897344;
  box-sizing: border-box;
`;

const GameCanvas = styled.canvas`
  position: absolute;
`;

const Main = () => {
  const [snakeGame, setSnakeGame] = useState(new SnakeGame({}));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, snakeGame.map.gridScreenWidth, snakeGame.map.gridScreenWidth);

      if (snakeGame.snake.isAteApple(snakeGame.apple.position)) {
        snakeGame.snake.addLength(1);
        const nextApplePosition = snakeGame.generateNewApplePosition();
        snakeGame.apple.position = nextApplePosition;
      }
      snakeGame.apple.draw(ctx);

      const nextSnakeHeadPosition = snakeGame.generateNextSnakePosition();
      snakeGame.snake.draw(ctx);

      if (snakeGame.isStartGame && snakeGame.snake.isTouchBody(nextSnakeHeadPosition)) {
        setSnakeGame(new SnakeGame({ ...snakeGame, isGameOver: true }));
        return;
      }
      snakeGame.snake.headPosition = nextSnakeHeadPosition;
    }

    if (!snakeGame.isGameOver) {
      const MAX_FPS = 35;
      const INCREASE_FPS = 0.01;
      setTimeout(() => { requestAnimationFrame(draw); }, 1000 / snakeGame.fps);
      if (snakeGame.isStartGame && snakeGame.fps < MAX_FPS) {
        snakeGame.fps += INCREASE_FPS;
      }
    }
  };

  const initialGame = () => {
    setSnakeGame(new SnakeGame({}));
  };

  useEffect(() => {
    const moveDirection = ({ keyCode }) => {
      const [TOP, RIGHT, BOTTOM, LEFT] = [38, 39, 40, 37];
      switch (keyCode) {
        case TOP:
          if (snakeGame.snake.currentMoveDirection === BOTTOM) return;
          snakeGame.snake.setDisplacement(0, -snakeGame.map.gridSize);
          break;
        case RIGHT:
          if (snakeGame.snake.currentMoveDirection === LEFT) return;
          snakeGame.snake.setDisplacement(snakeGame.map.gridSize, 0);
          break;
        case BOTTOM:
          if (snakeGame.snake.currentMoveDirection === TOP) return;
          snakeGame.snake.setDisplacement(0, snakeGame.map.gridSize);
          break;
        case LEFT:
          if (snakeGame.snake.currentMoveDirection === RIGHT) return;
          snakeGame.snake.setDisplacement(-snakeGame.map.gridSize, 0);
          break;
        default:
          return;
      }

      snakeGame.isStartGame = true;
      snakeGame.snake.currentMoveDirection = keyCode;
    };
    window.addEventListener('keydown', moveDirection);
    if (!snakeGame.isGameOver) {
      draw();
    }
  }, [snakeGame]);

  return (
    <StyledSnakeGameComponent>
      <GameTitle>
        Snake Game
        <span role="img" aria-label="snake">🐍</span>
      </GameTitle>
      <GameScreen gridScreenWidth={snakeGame.map.gridScreenWidth}>
        <GameCanvas
          ref={canvasRef}
          width={snakeGame.map.gridScreenWidth}
          height={snakeGame.map.gridScreenWidth}
        />
        {
          Array.from(Array((snakeGame.map.rowSize ** 2) - 1))
            .map((number, index) => (
              <MapGrid key={index} gridSize={snakeGame.map.gridSize} />
            ))
        }
        <MapGrid />
        <GameOverWindow
          gridScreenWidth={snakeGame.map.gridScreenWidth}
          score={snakeGame.score}
          isGameOver={snakeGame.isGameOver}
          initialGame={initialGame}
        />
      </GameScreen>
    </StyledSnakeGameComponent>
  );
};

export default Main;
