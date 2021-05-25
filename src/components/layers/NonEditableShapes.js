import { Circle, Layer, Line, Path, Shape, Text, Group } from "react-konva";

const NonEditableShapes = ({
  nonEditableShapes,
  tool,
  changeToEditableShape,
}) => {
  const { shapes } = nonEditableShapes;

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
      {shapes?.map((shape) => (
        <Group
          key={shape.name}
          id={shape.id}
          onDblClick={(e) =>
            tool === "selection" && changeToEditableShape(e.target.attrs.id)
          }
        >
          <Path
            key={Math.abs(Math.random() * 1000)}
            id={shape.name}
            data={shape.shapeData}
            fill={"transparent"}
            onMouseOver={(e) => (e.target.attrs.fill = "rgb(243,241, 242)")}
            onMouseOut={(e) => (e.target.attrs.fill = "transparent")}
          />
          {shape?.lines?.map((line) => (
            <Group key={line.id}>
              {line.name === "line" ? (
                <Group key={line.id}>
                  <Line
                    key={line.id}
                    points={line.points}
                    stroke="#495057"
                    strokeWidth={2}
                    tension={0}
                    lineCap="round"
                    id={line.id}
                  />
                  <Text
                    x={getMiddleX(line.points[0], line.points[2])}
                    y={getMiddleY(line.points[1], line.points[3])}
                    text={findLength(
                      line.points[0],
                      line.points[1],
                      line.points[2],
                      line.points[3]
                    )}
                    fontSize={15}
                    fill="#495057"
                    key={Math.abs(Math.random() * line.id + 1)}
                  />
                </Group>
              ) : (
                <Group key={line.id}>
                  <Shape
                    key={line.id}
                    stroke="#495057"
                    strokeWidth={2}
                    tension={0}
                    lineCap="round"
                    id={line.id}
                    sceneFunc={(context, shape) => {
                      context.beginPath();
                      context.moveTo(line.x1, line.y1);
                      context.bezierCurveTo(
                        line.cx1,
                        line.cy1,
                        line.cx2,
                        line.cy2,
                        line.x2,
                        line.y2
                      );
                      context.fillStrokeShape(shape);
                    }}
                  />
                </Group>
              )}
            </Group>
          ))}
          {shape?.nodes?.map((node) => (
            <Group key={node.id}>
              <Circle
                className={"circle"}
                key={node.id}
                x={node.x}
                y={node.y}
                radius={5}
                stroke={"#495057"}
                fill={"#495057"}
                strokeWidth={0}
                id={node.id}
                name={node.name}
              />
              <Text
                x={node.x + 5}
                y={node.y + 5}
                text={`${node.id}`}
                fontSize={15}
                fill="#495057"
                key={Math.abs(Math.random() * node.id + 1)}
              />
            </Group>
          ))}
        </Group>
      ))}
    </Layer>
  );
};

export default NonEditableShapes;
