import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import webSocket from 'socket.io-client';

const FindCompetitor = styled.div`
  width: 520px;
  height: 520px;
  background: #111217aa;
  position: relative;
  top: ${props => (props.hadCompetitor ? -0 : -520)}px;
  transition: top 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #eabf9f;
`;

const FindCompetitorButton = styled.button`
  background: #eabf9f;
  border: 4px double #111217;
  border-radius: 60px;
  height: 60px;
  width: 300px;
  font-size: 24px;
  color: #111217;

  &:hover {
    background: #111217;
    border: 4px double #eabf9f;
    color: #eabf9f;
    cursor: pointer;
  }
`;

type GameOverWindowProps = {
  hadCompetitor: boolean;

  foundCompetitor: (roomId: string) => void
}

export default (props: GameOverWindowProps) => {
  const { hadCompetitor, foundCompetitor } = props;
  const [socketIo, setSocketIo] = useState(null);
  const [isFinding, setIsFinding] = useState(false);

  const findCompetitor = () => {
    setSocketIo(webSocket('https://snake-battle-game-server.herokuapp.com/'));
    setIsFinding(true);
  };

  useEffect(() => {
    if (socketIo === null) return; 
    socketIo.on('foundCompetitor', (roomId: string) => {
      foundCompetitor(roomId);
      setIsFinding(false);
    });

    socketIo.emit('findCompetitor');
  }, [socketIo]);

  return (
    <FindCompetitor hadCompetitor={hadCompetitor}>
      <FindCompetitorButton onClick={findCompetitor}>
        {isFinding ? 'Finding...' : 'Let\'s Find Competitor!'}
      </FindCompetitorButton>
    </FindCompetitor>
  );
};
