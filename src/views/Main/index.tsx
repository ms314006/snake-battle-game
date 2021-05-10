import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import webSocket from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import SnakeGame from '../../class/SnakeGame';
import FindCompetitor from '../../components/FindCompetitor';
import GameOverWindow from '../../components/GameOverWindow';
import GameScreen from '../../components/GameScreen';
import CompetitorScreen from '../../components/CompetitorScreen';
import GameCanvas from '../../components/GameCanvas';

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

const Main = () => {
  const [snakeGame, setSnakeGame] = useState(new SnakeGame({}));
  const [competitorSnakeGame, setCompetitorSnakeGame] = useState(new SnakeGame({}));
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerRoomId, setPlayerRoomId] = useState<string | null>(null);
  const [isWatingForAnotherPlayer, setIsWatingForAnotherPlayer] = useState(false);
  const [socketIo, setSocketIo] = useState(null);

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
            sideLengthOfGameCanvas={520}
            sideLengthOfGrid={20}
            snakeGame={snakeGame}
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
          <GameCanvas
            sideLengthOfGameCanvas={260}
            sideLengthOfGrid={10}
            snakeGame={competitorSnakeGame}
          />
        </CompetitorScreen>
      </GameContent>
    </StyledSnakeGameComponent>
  );
};

export default Main;
