import React, { useRef } from "react";
import { Group, Layer, Line, Rect, Text } from "react-konva";

const Axis = ({ pixel, width, height, scale, offset }) => {
  width = parseInt(width);
  height = parseInt(height);
  const xAxis = (i, yPos) => {
    const xTransformedPos = i * pixel * scale.x + offset.x;
    return (
      <Group name={"x-axis-" + i * pixel} key={"x-axis-" + i * pixel}>
        <Line
          key={"x-axis-line-" + i * pixel}
          className={"x-axis-line-" + i * pixel}
          points={[xTransformedPos, 20, xTransformedPos, yPos]}
          stroke="grey"
          strokeWidth={1}
        />
        <Text
          key={"x-axis-text-" + i * pixel}
          className={"x-axis-text-" + i * pixel}
          x={xTransformedPos}
          y={2}
          text={i * pixel}
          fontSize={10}
        ></Text>
      </Group>
    );
  };
  const yAxis = (i, xPos) => {
    const yTransformedPos = i * pixel * scale.y + offset.y;
    return (
      <Group name={"y-axis-" + i * pixel} key={"y-axis-" + i * pixel}>
        <Line
          key={"y-axis-line-" + i * pixel}
          className={"y-axis-line-" + i * pixel}
          points={[20, yTransformedPos, xPos, yTransformedPos]}
          stroke="grey"
          strokeWidth={1}
        />
        <Text
          className={"y-axis-text-" + i * pixel}
          key={"y-axis-text-" + i * pixel}
          y={yTransformedPos + 3}
          x={0}
          text={i * pixel}
          fontSize={10}
          rotation={-90}
          fillAfterStrokeEnabled={false}
        ></Text>
      </Group>
    );
  };

  return (
    <Group key={"axis-group"}>
      {
        <Rect
          key={"xAxis-rect"}
          x={-10000}
          y={0}
          width={20000}
          height={20}
          fill="white"
          stroke="white"
        ></Rect>
      }
      {
        <Rect
          key={"yAxis-rect"}
          x={0}
          y={-1000}
          width={20}
          height={2000}
          fill="white"
          stroke="white"
        ></Rect>
      }
      {
        <Line
          key={"xAxis-line"}
          points={[-width, 20, width, 20]}
          stroke="grey"
          strokeWidth={1}
        />
      }
      {
        <Line
          key={"yAxis-line"}
          points={[20, -height, 20, height]}
          stroke="grey"
          strokeWidth={1}
        />
      }

      {Array.from({ length: width + width }, (item, i) => {
        i = i - width;
        if (i % 100 === 0) {
          return xAxis(i, 16);
        } else {
          return xAxis(i, 10);
        }
      })}
      {Array.from({ length: height + height }, (item, i) => {
        i = i - height;
        if (i % 100 === 0) {
          return yAxis(i, 16);
        } else {
          return yAxis(i, 10);
        }
      })}

      <Rect
        key={"axisRect"}
        x={1}
        y={1}
        width={18.7}
        height={18.7}
        fill="white"
        stroke="white"
      ></Rect>
    </Group>
  );
};
export default React.memo(Axis);
