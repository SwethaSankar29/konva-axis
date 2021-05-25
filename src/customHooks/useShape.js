import * as _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { getCursorDownPoint, updateCursorDownPoint } from "../features/actives";
import {
  getBBox,
  getEditableShape,
  getLines,
  getNodes,
  getPrefixIndex,
  updateBBox,
  updateHangingLine,
  updateLines,
  updateNodes,
  updatePrefixIndex,
} from "../features/editableShape";
import { getShapes, updateShapes } from "../features/nonEditableShapes";

const useShape = () => {
  const dispatch = useDispatch();
  const editableShapeData = useSelector(getEditableShape);
  const nodes = useSelector(getNodes);
  const lines = useSelector(getLines);
  const bBox = useSelector(getBBox);
  const shapesData = useSelector(getShapes);
  const prefixIndex = useSelector(getPrefixIndex);
  const cursorDownPoint = useSelector(getCursorDownPoint);

  const pathByNode = (lines) => {
    let path = "";
    if (lines[0].id.charAt(0) === "L") {
      path = `M${lines[0].points[0]},${lines[0].points[1]}`;
    } else if (lines[0].id.charAt(0) === "C") {
      path = `M${lines[0].x1},${lines[0].y1}C${lines[0].cx1},${lines[0].cy1},${lines[0].cx2},${lines[0].cy2},${lines[0].x2}},${lines[0].y2}`;
    }

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].id.charAt(0) === "L") {
        path += `L${lines[i].points[0]},${lines[i].points[1]}`;
      } else if (lines[i].id.charAt(0) === "C") {
        path += `L${lines[i].x1}},${lines[i].y1}C${lines[i].cx1},${lines[i].cy1},${lines[i].cx2},${lines[i].cy2},${lines[i].x2}},${lines[i].y2}`;
      }
    }
    return path;
  };

  const createPath = (nodes, lines) => {
    let shapeData = pathByNode(lines);
    return shapeData;
  };

  const createBBoxNodes = (xList, yList) => {
    return [
      { x: xList[0] - 11, y: yList[0] - 11, id: 1 }, // 1
      {
        x: xList[0] + (xList[xList.length - 1] - xList[0]) / 2 - 4,
        y: yList[0] - 11,
        id: 2,
      }, // 2
      { x: xList[xList.length - 1] + 3, y: yList[0] - 11, id: 3 }, // 3
      {
        x: xList[0] - 11,
        y: yList[0] + (yList[yList.length - 1] - yList[0]) / 2 - 7,
        id: 4,
      }, //4
      {
        x: xList[0] + (xList[xList.length - 1] - xList[0]) / 2 - 4,
        y: yList[0] - 31,
        id: 5,
      }, // 5
      {
        x: xList[xList.length - 1] + 3,
        y: yList[0] + (yList[yList.length - 1] - yList[0]) / 2 - 7,
        id: 6,
      }, //6
      { x: xList[0] - 11, y: yList[yList.length - 1] + 3, id: 7 }, // 7
      {
        x: xList[0] + (xList[xList.length - 1] - xList[0]) / 2 - 4,
        y: yList[yList.length - 1] + 3,
        id: 8,
      }, // 8
      {
        x: xList[xList.length - 1] + 3,
        y: yList[yList.length - 1] + 3,
        id: 9,
      }, // 9
    ];
  };

  const createBBox = (_nodes) => {
    let nodes;
    if (_nodes) {
      nodes = _.cloneDeep(_nodes);
    } else {
      nodes = _.cloneDeep(editableShapeData.nodes);
    }
    let xList = [];
    let yList = [];

    if (nodes) {
      nodes.forEach((node) => {
        xList.push(Number(node.x.toFixed(0)));
        yList.push(Number(node.y.toFixed(0)));
      });
      xList.sort((a, b) => {
        return a - b;
      });
      yList.sort((a, b) => {
        return a - b;
      });

      let bBox = createBBoxNodes(xList, yList);
      dispatch(
        updateBBox([
          {
            x: xList[0] - 7,
            y: yList[0] - 7,
            width: xList[xList.length - 1] - xList[0] + 14,
            height: yList[yList.length - 1] - yList[0] + 14,
            id: "BBox",
            nodes: bBox,
          },
        ])
      );
    }
  };

  const addToShapes = (editableShape) => {
    let path = createPath(editableShape.nodes, editableShape.lines);
    let currentNodeId = editableShape.nodes[0].id;
    let shapes = _.cloneDeep(shapesData);

    dispatch(
      updateShapes([
        ...shapes,
        {
          name: "Shape" + currentNodeId.charAt(0),
          shapeData: path,
          nodes: editableShape.nodes,
          lines: editableShape.lines,
        },
      ])
    );

    dispatch(updateNodes([]));
    dispatch(updateLines([]));
    dispatch(updateHangingLine({}));
    dispatch(updatePrefixIndex(prefixIndex + 1));
  };

  const dragUpdateShape = (event) => {
    let pos = event.target.getStage().pointerPos;

    let xDiff = Number(pos.x - cursorDownPoint.x).toFixed(2);
    let yDiff = Number(pos.y - cursorDownPoint.y).toFixed(2);

    dispatch(
      updateCursorDownPoint({
        x: event.target.getStage().pointerPos.x,
        y: event.target.getStage().pointerPos.y,
      })
    );

    let _nodes = _.cloneDeep(nodes);
    let _lines = _.cloneDeep(lines);
    let _bBox = _.cloneDeep(bBox);
    let newNodes = [];
    let newLines = [];

    _nodes.forEach((node) => {
      newNodes.push({
        ...node,
        x: Number(node.x) + Number(xDiff),
        y: Number(node.y) + Number(yDiff),
      });
    });

    _lines.forEach((line) => {
      if (line.name === "line") {
        newLines.push({
          ...line,
          points: [
            Number(line.points[0]) + Number(xDiff),
            Number(line.points[1]) + Number(yDiff),
            Number(line.points[2]) + Number(xDiff),
            Number(line.points[3]) + Number(yDiff),
          ],
        });
      } else if (line.name === "curve") {
        newLines.push({
          ...line,
          x1: Number(line.x1) + Number(xDiff),
          y1: Number(line.y1) + Number(yDiff),
          cx1: Number(line.cx1) + Number(xDiff),
          cy1: Number(line.cy1) + Number(yDiff),
          cx2: Number(line.cx2) + Number(xDiff),
          cy2: Number(line.cy2) + Number(yDiff),
          x2: Number(line.x2) + Number(xDiff),
          y2: Number(line.y2) + Number(yDiff),
        });
      }
    });

    dispatch(updateNodes(newNodes));
    dispatch(updateLines(newLines));
  };

  return { createPath, createBBox, addToShapes, dragUpdateShape };
};

export default useShape;
