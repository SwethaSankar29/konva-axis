import React from "react";
import { Circle, Layer, Line, Text, Shape, Rect, Group } from "react-konva";

const EditableShape = ({
  editableShape,
  updateNode,
  isShiftPressed,
  isCtrlPressed,
  selectedNodes,
  setSelectedNodes,
  tool,
  lineToCurve,
  curveToLine,
  updateControlNode,
  updateHistory,
  updateCursorDownPointValues,
  dragUpdateShape,
}) => {
  const { nodes, lines, bBox } = editableShape;

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

  const nodeSelected = (node) => {
    if (tool === "selection") {
      if (isShiftPressed) {
        setSelectedNodes([...selectedNodes, node]);
      } else {
        setSelectedNodes([node]);
      }
    }
  };

  const createCurve = (id) => {
    if (isCtrlPressed) {
      lineToCurve(id);
    }
  };

  const createLine = (id) => {
    if (isCtrlPressed) {
      curveToLine(id);
    }
  };

  const shapeDragStart = (e) => {
    updateHistory();
    updateCursorDownPointValues(e);
  };

  return (
    <Layer>
      <Group id={nodes[0]?.id.charAt(0)} key={nodes[0]?.id}>
        {lines.map((line) => (
          <Group key={line.id}>
            {line.name === "line" ? (
              <Group key={line.id}>
                <Line
                  key={line.id}
                  points={line.points}
                  stroke="#adb5bd"
                  strokeWidth={2}
                  tension={0}
                  lineCap="round"
                  draggable
                  //onMouseDown={updateLineDownPoint}
                  //onDragEnd={(e) => updateLine(e, lineDownPoint)}
                  id={line.id}
                  //onMouseOver={e => lineStyle(e)}
                  //onMouseOut={e => lineStyle(e)}
                  onClick={() => createCurve(line.id)}
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
                  fill="adb5bd"
                  key={Math.abs(Math.random() * line.id + 1)}
                />
              </Group>
            ) : (
              <Group key={line.id}>
                <Shape
                  key={line.id}
                  stroke="#adb5bd"
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
                  onClick={() => createLine(line.id)}
                />
                <Text
                  x={getMiddleX(line.x1, line.x2)}
                  y={getMiddleY(line.y1, line.y2)}
                  text={"length"}
                  fontSize={15}
                  fill="adb5bd"
                  key={Math.abs(Math.random() * line.id + 1)}
                />
                <Circle
                  className={"circle"}
                  key={line.control1Id}
                  x={line.cx1}
                  y={line.cy1}
                  radius={5}
                  stroke={"#adb5bd"}
                  fill={"#adb5bd"}
                  strokeWidth={0}
                  draggable
                  onDragMove={(e) => updateControlNode(e, line.control1Id)}
                  onDragStart={updateHistory}
                  id={line.control1Id}
                  //onMouseOver={(e) => circleStyle(e)}
                  //onMouseOut={(e) => circleStyle(e)}
                  //onClick={() => nodeSelected(node)}
                />
                <Line
                  key={`${line.control1Id}L`}
                  id={`${line.control1Id}L`}
                  points={[line.x1, line.y1, line.cx1, line.cy1]}
                  stroke="#adb5bd"
                  strokeWidth={2}
                  tension={0}
                  lineCap="round"
                  dash={[10, 10, 0, 10]}
                />
                <Circle
                  className={"circle"}
                  key={line.control2Id}
                  x={line.cx2}
                  y={line.cy2}
                  radius={5}
                  stroke={"#adb5bd"}
                  fill={"#adb5bd"}
                  strokeWidth={0}
                  draggable
                  onDragMove={(e) => updateControlNode(e, line.control2Id)}
                  onDragStart={updateHistory}
                  id={line.control2Id}
                  //onMouseOver={(e) => circleStyle(e)}
                  //onMouseOut={(e) => circleStyle(e)}
                  //onClick={() => nodeSelected(node)}
                />
                <Line
                  key={`${line.control2Id}L`}
                  id={`${line.control2Id}L`}
                  points={[line.cx2, line.cy2, line.x2, line.y2]}
                  stroke="#adb5bd"
                  strokeWidth={2}
                  tension={0}
                  lineCap="round"
                  dash={[10, 10, 0, 10]}
                />
              </Group>
            )}
          </Group>
        ))}
        {nodes.map((node) => (
          <Group key={node.id}>
            <Circle
              className={"circle"}
              key={node.id}
              x={node.x}
              y={node.y}
              radius={5}
              stroke={"#adb5bd"}
              fill={"#adb5bd"}
              strokeWidth={0}
              draggable
              onDragMove={updateNode}
              onDragStart={updateHistory}
              id={node.id}
              name={node.name}
              //onMouseOver={(e) => circleStyle(e)}
              //onMouseOut={(e) => circleStyle(e)}
              onClick={() => nodeSelected(node)}
            />
            <Text
              x={node.x + 5}
              y={node.y + 5}
              text={`${node.id}`}
              fontSize={15}
              fill="adb5bd"
              key={Math.abs(Math.random() * node.id + 1)}
            />
          </Group>
        ))}
        {bBox.map((box) => (
          <Group
            key={box.id}
            draggable
            onDragStart={shapeDragStart}
            onDragMove={(e) => dragUpdateShape(e)}
          >
            {box.x > 0 && box.y > 0 && (
              <Group key={box.id}>
                <Rect
                  key={Math.random() * 100}
                  x={box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  stroke={"#03A9F4"}
                  strokeWidth={1}
                  fill={"transparent"}
                />
                {box.nodes.map((node) => (
                  <Rect
                    key={node.id}
                    x={node.x}
                    y={node.y}
                    width={8}
                    height={8}
                    stroke={"#03A9F4"}
                    strokeWidth={1}
                    fill={"#03A9F4"}
                  />
                ))}
              </Group>
            )}
          </Group>
        ))}
      </Group>
    </Layer>
  );
};

export default EditableShape;
