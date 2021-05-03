import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import webSocket from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import SnakeGame from '../../class/SnakeGame';
import FindCompetitor from '../../components/FindCompetitor';
import GameOverWindow from '../../components/GameOverWindow';

const StyledSnakeGameComponent = styled.div`
  width: 100%;
  height: 100%;
  min-height: 700px;
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

const GameContent = styled.div`
  display: grid;
  grid-template-columns: 540px 270px;
`;

const GameScreen = styled.div`
  width: 520px;
  height: 520px;
  border: 2px solid #b68973;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`;

const CompetitorScreen = styled.div`
  width: 520px;
  height: 520px;
  border: 2px solid #b68973;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`;

const GameCanvas = styled.canvas`
  position: absolute;
`;

const CompetitorGameCanvas = styled.canvas`
  position: absolute;
`;

const Main = () => {
  const [snakeGame, setSnakeGame] = useState(new SnakeGame({}));
  const [competitorSnakeGame, setCompetitorSnakeGame] = useState(new SnakeGame({}));
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerRoomId, setPlayerRoomId] = useState<string | null>(null);
  const [isWatingForAnotherPlayer, setIsWatingForAnotherPlayer] = useState(false);
  const [socketIo, setSocketIo] = useState(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const competitorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const draw = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, snakeGame.map.columnSize * 20, snakeGame.map.rowSize * 20);
      snakeGame.map.draw(ctx, 20);
      snakeGame.apple.draw(ctx, 20);
      snakeGame.snake.draw(ctx, 20);
    }

    if (competitorCanvasRef.current) {
      const ctx = competitorCanvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(
        0, 0, competitorSnakeGame.map.columnSize * 20, competitorSnakeGame.map.rowSize * 20
      );
      snakeGame.map.draw(ctx, 20);
      competitorSnakeGame.apple.draw(ctx, 20);
      competitorSnakeGame.snake.draw(ctx, 20);
    }
  };

  const initialGame = () => {
    setSnakeGame(new SnakeGame({}));
    setCompetitorSnakeGame(new SnakeGame({}));
    setPlayerRoomId(null);
    setPlayerId(null);
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
    moveDirection({ keyCode: 38 });
  }, [socketIo, playerId]);

  useEffect(draw, [snakeGame]);
  useEffect(draw, [competitorSnakeGame]);

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

    socketIo.on('updateSnakeGame', ({
      snakeGame: nextSnakeGame, competitorSnakeGame: nextCompetitorSnakeGame
    }) => {
      setSnakeGame(new SnakeGame(nextSnakeGame));
      setCompetitorSnakeGame(new SnakeGame(nextCompetitorSnakeGame));

      if (nextSnakeGame.isEndGame) {
        socketIo.close();
        setSocketIo(null);
      }
    });
  }, [socketIo]);

  return (
    <StyledSnakeGameComponent>
      <GameTitle>
        Snake Battle Game
        <span role="img" aria-label="snake">🐍</span>
        {isWatingForAnotherPlayer && <span style={{ fontSize: 14, }}>（等待另一位玩家...）</span>}
      </GameTitle>
      <GameContent>
        <GameScreen>
          <GameCanvas
            ref={canvasRef}
            width="520"
            height="520"
          />
          <GameOverWindow
            isEndGame={snakeGame.isEndGame}
            isWinner={snakeGame.isWinner}
            initialGame={initialGame}
          />
          <FindCompetitor
            hadCompetitor={playerRoomId !== null}
            foundCompetitor={(roomId) => setPlayerRoomId(roomId)}
          />
        </GameScreen>
        <CompetitorScreen>
          <CompetitorGameCanvas
            ref={competitorCanvasRef}
            width="520"
            height="520"
          />
        </CompetitorScreen>
      </GameContent>
    </StyledSnakeGameComponent>
  );
};

export default Main;
