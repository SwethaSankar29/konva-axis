import { Layer, Line, Text, Group } from "react-konva";
import React from "react";

const HangingLine = ({ hangingLine }) => {
  const getMiddleX = (x1, x2) => {
    return Number((Number(x1) + Number(x2)) / 2);
  };

  const getMiddleY = (y1, y2) => {
    return Number((Number(y1) + Number(y2)) / 2);
  };

  const findLength = (x1, y1, x2, y2) => {
    return Number(
      (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 10).toFixed(2)
    );
  };

  return (
    <Layer>
      {hangingLine && (
        <Group key={hangingLine.id}>
          <Line
            key={Math.abs(Math.random() * 12345)}
            points={hangingLine.points}
            //stroke="#df4b26"
            stroke="#959595"
            strokeWidth={1}
            tension={0}
            lineCap="round"
            id={hangingLine.id}
          />
          {hangingLine.points && (
            <Text
              x={getMiddleX(hangingLine.points[0], hangingLine.points[2])}
              y={getMiddleY(hangingLine.points[1], hangingLine.points[3])}
              text={findLength(
                hangingLine.points[0],
                hangingLine.points[1],
                hangingLine.points[2],
                hangingLine.points[3]
              )}
              fontSize={15}
              fill="#495057"
              key={Math.abs(Math.random() * hangingLine.id + 1)}
            />
          )}
        </Group>
      )}
    </Layer>
  );
};

export default HangingLine;
