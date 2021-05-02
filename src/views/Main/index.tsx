import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import webSocket from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import SnakeGame from '../../class/SnakeGame';
import FindCompetitor from '../../components/FindCompetitor';
import GameOverWindow from '../../components/GameOverWindow';
import Snake from '../../class/Snake';
import Apple from '../../class/Apple';

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
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerRoomId, setPlayerRoomId] = useState<string | null>(null);
  const [isWatingForAnotherPlayer, setIsWatingForAnotherPlayer] = useState(false);
  const [socketIo, setSocketIo] = useState(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const draw = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, snakeGame.map.gridScreenWidth, snakeGame.map.gridScreenWidth);
      snakeGame.apple.draw(ctx);
      snakeGame.snake.draw(ctx);
    }

    if (!snakeGame.isGameOver) {
      setTimeout(() => { requestAnimationFrame(draw); }, 1000 / snakeGame.fps);
    }
  };

  const initialGame = () => {
    setSnakeGame(new SnakeGame({}));
    setPlayerRoomId(null);
  };

  useEffect(() => {
    const moveDirection = ({ keyCode }) => {
      if (playerId === null || socketIo === null) return;
      socketIo.emit(
        'setSnakeDirection',
        { playerId, playerRoomId, directionKeyCode: keyCode }
      );
    };
    window.removeEventListener('keydown', moveDirection);
    window.addEventListener('keydown', moveDirection);
    if (!snakeGame.isGameOver) {
      draw();
    }
  }, [socketIo, playerId]);

  useEffect(() => {
    if (playerRoomId === null) return;
    setSocketIo(webSocket('http://localhost:3000'));
  }, [playerRoomId]);


  useEffect(() => {
    if (socketIo === null) return; 
    const playerId = uuidv4();
    setPlayerId(playerId);
    socketIo.emit('joinInToRoom', { playerId, playerRoomId });

    socketIo.on('waitingForAnotherPlayer', () => {
      setIsWatingForAnotherPlayer(true);
    });

    socketIo.on('playersIsReady', () => {
      setIsWatingForAnotherPlayer(false);
    });

    socketIo.on('updateSnakeGame', ({ snakeGame: nextSnakeGame }) => {
      snakeGame.snake = new Snake(nextSnakeGame.snake);
      snakeGame.apple = new Apple(nextSnakeGame.apple);
      snakeGame.fps = nextSnakeGame.fps;
    });
  }, [socketIo]);

  return (
    <StyledSnakeGameComponent>
      <GameTitle>
        Snake Battle Game
        <span role="img" aria-label="snake">🐍</span>
        {isWatingForAnotherPlayer && <span style={{ fontSize: 14, }}>（等待另一位玩家...）</span>}
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
        <FindCompetitor
          gridScreenWidth={snakeGame.map.gridScreenWidth}
          hadCompetitor={playerRoomId !== null}
          foundCompetitor={(roomId) => setPlayerRoomId(roomId)}
        />
      </GameScreen>
    </StyledSnakeGameComponent>
  );
};

export default Main;
