import React from 'react';
import styled from 'styled-components';

const FindCompetitor = styled.div`
  width: ${props => props.gridScreenWidth}px;
  height: ${props => props.gridScreenWidth}px;
  background: #111217aa;
  position: relative;
  top: ${props => (props.hadCompetitor ? -props.gridScreenWidth : -props.gridScreenWidth * 2)}px;
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
  gridScreenWidth: number;
  hadCompetitor: boolean;

  foundCompetitor: () => void
}

export default (props: GameOverWindowProps) => {
  const { gridScreenWidth, hadCompetitor, foundCompetitor } = props;
  return (
    <FindCompetitor hadCompetitor={hadCompetitor} gridScreenWidth={gridScreenWidth}>
      <FindCompetitorButton onClick={foundCompetitor}>
        Find Competitor
      </FindCompetitorButton>
    </FindCompetitor>
  );
};
