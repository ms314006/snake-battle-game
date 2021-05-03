import React from 'react';
import styled from 'styled-components';

const GameOverWindow = styled.div`
  width: 520px;
  height: 520px;
  background: #111217aa;
  position: relative;
  top: ${props => (props.isEndGame ? -0 : -520)}px;
  transition: top 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #eabf9f;
`;

const Title = styled.div`
  font-size: 40px;
  margin-bottom: 40px;
`;

const RestartButton = styled.button`
  background: #eabf9f;
  border: 4px double #111217;
  border-radius: 24px;
  width: 200px;
  font-size: 24px;
  color: #111217;

  &:hover {
    background: #111217;
    border: 4px double #eabf9f;
    color: #eabf9f;
    cursor: pointer;
  }
`;

type GameOverWindow = {
  isEndGame: boolean;
  isWinner: boolean;
  initialGame: () => void;
}

export default (props: GameOverWindow) => {
  const { initialGame, isEndGame, isWinner } = props;
  return (
    <GameOverWindow isEndGame={isEndGame}>
      <Title>{`${isWinner ? 'Winner' : 'Loser'}!`}</Title>
      <RestartButton onClick={initialGame}>
        Restart
      </RestartButton>
    </GameOverWindow>
  );
};
