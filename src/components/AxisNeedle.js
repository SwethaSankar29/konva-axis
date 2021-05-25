import React, { useEffect, useState } from "react";
import { Group, Line, Text, Layer, Rect } from "react-konva";

const AxisNeedle = ({ layerRef, xPosition, yPosition, scale, offset }) => {
  const [previousXPosition, setPreviousXPosition] = useState(0);
  const [previousYPosition, setPreviousYPosition] = useState(0);
  const pixel = 100;
  useEffect(() => {
    let nearXPosition = Math.round(xPosition / pixel) * pixel;
    let nearYPosition = Math.round(yPosition / pixel) * pixel;
    //----------------------------------Hide and show x axis text-------------------------------
    layerRef.current?.findOne(".x-axis-" + previousXPosition).show();

    if (previousXPosition != nearXPosition) {
      setPreviousXPosition(nearXPosition);
    }
    if (xPosition >= nearXPosition - 20 && xPosition <= nearXPosition + 20) {
      layerRef.current?.findOne(".x-axis-" + nearXPosition).hide();
      console.log(layerRef.current?.findOne(".x-axis-" + nearXPosition));
    }
    //----------------------------------Hide and show y axis text-------------------------------
    layerRef.current?.findOne(".y-axis-" + previousYPosition).show();

    if (previousYPosition != nearYPosition) {
      setPreviousYPosition(nearYPosition);
    }
    if (yPosition >= nearYPosition - 20 && yPosition <= nearYPosition + 20) {
      layerRef.current?.findOne(".y-axis-" + nearYPosition).hide();
    }
    layerRef.current?.findOne(".x-axis-0").show();
    layerRef.current?.findOne(".y-axis-0").show();
    layerRef.current.getLayer().batchDraw();
  });
  if (xPosition !== 0 && yPosition !== 0) {
    return (
      <Layer>
        <Group>
          {
            <Line
              className={"x-axis-needle-line-" + xPosition}
              points={[
                xPosition * scale.x + offset.x,
                20,
                xPosition * scale.x + offset.x,
                12,
              ]}
              stroke="blue"
              strokeWidth={1}
            />
          }
          {
            <Text
              className={"x-axis-needle-text-" + xPosition}
              x={xPosition * scale.x + offset.x}
              y={2}
              text={xPosition}
              fontSize={10}
              fill="blue"
            ></Text>
          }
        </Group>

        <Group>
          {
            <Line
              className={"y-axis-needle-line-" + yPosition}
              points={[
                20,
                yPosition * scale.y + offset.y,
                12,
                yPosition * scale.y + offset.y,
              ]}
              stroke="blue"
              strokeWidth={1}
            />
          }
          {
            <Text
              className={"y-axis-needle-text-" + yPosition}
              y={yPosition * scale.y + offset.y + 3}
              x={0}
              text={yPosition}
              fontSize={10}
              fill="blue"
              rotation={-90}
            ></Text>
          }
        </Group>
      </Layer>
    );
  } else {
    return null;
  }
};
export default React.memo(AxisNeedle);
