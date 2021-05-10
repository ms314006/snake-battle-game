import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SnakeGameInterface } from '../../class/SnakeGame';

const GameCanvas = styled.canvas`
  position: absolute;
`;

type GameCanvasProps = {
  sideLengthOfGameCanvas: number;
  sideLengthOfGrid: number;
  snakeGame: SnakeGameInterface;
}

export default (props: GameCanvasProps) => {
  const { sideLengthOfGameCanvas, sideLengthOfGrid, snakeGame } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(
        0, 0,
        snakeGame.map.columnSize * sideLengthOfGrid,
        snakeGame.map.rowSize * sideLengthOfGrid
      );
      snakeGame.map.draw(ctx, sideLengthOfGrid);
      snakeGame.apple.draw(ctx, sideLengthOfGrid);
      snakeGame.snake.draw(ctx, sideLengthOfGrid);
    }
  };

  useEffect(() => {
    draw();
  }, [snakeGame])

  return (
    <GameCanvas
      ref={canvasRef}
      width={sideLengthOfGameCanvas}
      height={sideLengthOfGameCanvas}
    />
  );
};
