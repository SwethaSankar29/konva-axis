import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
  getLines,
  updateLines,
  getNodes,
  updateNodes,
} from "../features/editableShape";
import { getShapes, updateShapes } from "../features/nonEditableShapes";
import useHistory from "./useHistory";
import useShape from "./useShape";

const useModifier = () => {
  const dispatch = useDispatch();

  const lines = useSelector(getLines);
  const nodes = useSelector(getNodes);
  const shapes = useSelector(getShapes);

  const { updateHistory } = useHistory();
  const { createPath, createBBox } = useShape();

  const getBezierData = (nodes) => {
    let cx1 = (nodes[0] + 0.75 * nodes[2]) / 1.75;
    let cy1 = (nodes[1] + 0.75 * nodes[3]) / 1.75;
    let cx2 = (nodes[2] + 0.75 * nodes[0]) / 1.75;
    let cy2 = (nodes[3] + 0.75 * nodes[1]) / 1.75;
    return { cx1, cx2, cy1, cy2 };
  };

  const updateControlNode = (event, controlNodeId) => {
    let pos = event.target.getStage().getPointerPosition();
    let _lines = _.cloneDeep(lines);
    let lineId = controlNodeId.substr(0, controlNodeId.length - 2);
    let lineIndex = _lines.map((e) => e.id).indexOf(lineId);
    if (controlNodeId.charAt(controlNodeId.length - 1) === "1") {
      _lines[lineIndex] = {
        ..._lines[lineIndex],
        cx1: pos.x,
        cy1: pos.y,
      };
    } else if (controlNodeId.charAt(controlNodeId.length - 1) === "2") {
      _lines[lineIndex] = {
        ..._lines[lineIndex],
        cx2: pos.x,
        cy2: pos.y,
      };
    }

    dispatch(updateLines(_lines));
  };

  const lineToCurve = (lineId) => {
    updateHistory();
    const _lines = _.cloneDeep(lines);
    const _nodes = _.cloneDeep(nodes);
    let lineIndex = _lines.map((e) => e.id).indexOf(lineId);
    let modifyingLine = _.cloneDeep(_lines[lineIndex]);
    let id = modifyingLine.id.substr(1);
    let _newLines = [];
    _lines.forEach((line) => {
      if (line.id !== lineId) {
        _newLines.push(line);
      } else if (line.id === lineId) {
        let bezierData = getBezierData(modifyingLine.points);

        let newCurveData = {
          id: `C${id}`,
          name: "curve",
          x1: modifyingLine.points[0],
          y1: modifyingLine.points[1],
          x2: modifyingLine.points[2],
          y2: modifyingLine.points[3],
          cx1: bezierData.cx1,
          cy1: bezierData.cy1,
          control1Id: `C${id}C1`,
          cx2: bezierData.cx2,
          cy2: bezierData.cy2,
          control2Id: `C${id}C2`,
          connectedLines: modifyingLine.connectedLines,
          connectedNodes: modifyingLine.connectedNodes,
        };
        _newLines.push(newCurveData);
      }
    });
    /* update adjacent nodes connectedLines id */
    modifyingLine.connectedNodes.forEach((node) => {
      let nodeIndex = _nodes.map((e) => e.id).indexOf(node.id);
      let connectedLineIndex = _nodes[nodeIndex].connectedLines
        .map((e) => e.id)
        .indexOf(modifyingLine.id);
      _nodes[nodeIndex].connectedLines[connectedLineIndex] = {
        ..._nodes[nodeIndex].connectedLines[connectedLineIndex],
        id: `C${id}`,
      };
    });

    dispatch(updateNodes(_nodes));
    dispatch(updateLines(_newLines));
  };

  const curveToLine = (curveId) => {
    updateHistory();
    const _lines = _.cloneDeep(lines);
    const _nodes = _.cloneDeep(nodes);
    let lineIndex = _lines.map((e) => e.id).indexOf(curveId);
    let modifyingLine = _.cloneDeep(_lines[lineIndex]);
    let id = modifyingLine.id.substr(1);
    let _newLines = [];
    _lines.forEach((line) => {
      if (line.id !== curveId) {
        _newLines.push(line);
      } else if (line.id === curveId) {
        let newLineData = {
          id: `L${id}`,
          name: "line",
          points: [
            modifyingLine.x1,
            modifyingLine.y1,
            modifyingLine.x2,
            modifyingLine.y2,
          ],
          connectedLines: modifyingLine.connectedLines,
          connectedNodes: modifyingLine.connectedNodes,
        };
        _newLines.push(newLineData);
      }
    });
    /* update adjacent nodes connectedLines id */
    modifyingLine.connectedNodes.forEach((node) => {
      let nodeIndex = _nodes.map((e) => e.id).indexOf(node.id);
      let connectedLineIndex = _nodes[nodeIndex].connectedLines
        .map((e) => e.id)
        .indexOf(modifyingLine.id);

      _nodes[nodeIndex].connectedLines[connectedLineIndex] = {
        ..._nodes[nodeIndex].connectedLines[connectedLineIndex],
        id: `L${id}`,
      };
    });

    dispatch(updateNodes(_nodes));
    dispatch(updateLines(_newLines));
  };

  const changeToEditableShape = (shapeId) => {
    updateHistory();
    let _shapes = _.cloneWith(shapes);
    let shapeIndex = _shapes.map((e) => e.name).indexOf(shapeId);
    let data = _.cloneWith(_shapes[shapeIndex]);
    if (nodes.length === 0 && shapeIndex > -1) {
      // no data in editableShape
      dispatch(updateNodes(data.nodes));
      dispatch(updateLines(data.lines));
      createBBox(data.nodes);

      _shapes.splice(shapeIndex, 1);
      dispatch(updateShapes(_shapes));
    } else if (nodes.length !== 0) {
      // data in editableShape, so move it to shapes
      let _nodes = _.cloneWith(nodes);
      let _lines = _.cloneWith(lines);
      let path = createPath(_nodes, _lines);

      let _currentNodeId = _nodes[0].id;

      _shapes.push({
        name: "Shape" + _currentNodeId.charAt(0),
        shapeData: path,
        nodes: _nodes,
        lines: _lines,
      });

      dispatch(updateNodes(data.nodes));
      dispatch(updateLines(data.lines));

      _shapes.splice(shapeIndex, 1);
      dispatch(updateShapes(_shapes));
    }
  };

  return { lineToCurve, curveToLine, updateControlNode, changeToEditableShape };
};

export default useModifier;
