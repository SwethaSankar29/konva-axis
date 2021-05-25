import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentTool,
  getDisableDrawing,
  getSingleEscapePressed,
  updateNeedlePoint,
  updateSingleEscapePress,
} from "../features/actives";
import {
  getHangingLine,
  getLines,
  getNodes,
  getPrefixIndex,
  updateBBox,
  updateHangingLine,
  updateLines,
  updateNodes,
  updatePrefixIndex,
  updateSnappedNodeIndex,
} from "../features/editableShape";
import { getShapes, updateShapes } from "../features/nonEditableShapes";
import useLine from "./useLine";
import useShape from "./useShape";
import _ from "lodash";
import useHistory from "./useHistory";

const useNode = () => {
  const dispatch = useDispatch();

  const tool = useSelector(getCurrentTool);
  const prefixIndex = useSelector(getPrefixIndex);
  const nodes = useSelector(getNodes);
  const lines = useSelector(getLines);
  const shapes = useSelector(getShapes);
  const hangingLine = useSelector(getHangingLine);
  const isSingleEscapePressed = useSelector(getSingleEscapePressed);
  const disableDrawing = useSelector(getDisableDrawing);

  const { createLine } = useLine();
  const { createPath } = useShape();
  const { updateHistory } = useHistory();

  let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const createNode = (event) => {
    dispatch(updateSnappedNodeIndex(0));

    if (tool === "draw" && !disableDrawing && window.event.which === 1) {
      let name = "node";
      let prefix = alphabets.charAt(prefixIndex);
      let pos = event.target.getStage().getPointerPosition();
      dispatch(updateNeedlePoint([parseInt(pos.x), parseInt(pos.y)]));
      if (nodes.length === 0 || isSingleEscapePressed) {
        // Creating first node

        dispatch(updateHangingLine({}));
        dispatch(updateSingleEscapePress(false));
        dispatch(updateBBox([]));

        let prevNodeId = nodes[nodes.length - 1]?.id;
        prevNodeId = Number(prevNodeId?.substring(1)) + 1 || 0;

        let newNode = {
          x: pos.x,
          y: pos.y,
          id: prefix + prevNodeId,
          name,
          connectedLines: [],
          connectedNodes: [],
        };
        dispatch(updateNodes([...nodes, newNode]));
      } else if (
        event?.target?.attrs?.className === "circle" &&
        event?.target?.attrs?.id.charAt(0) === nodes[0].id.charAt(0)
      ) {
        // Checking snapping

        let _currentNodeId = event?.target?.attrs?.id;
        let _nodeIndex = nodes.map((e) => e.id).indexOf(_currentNodeId);

        if (_nodeIndex === 0) {
          // snapped and line does not continue / shape is complete
          dispatch(updateNeedlePoint([0, 0]));
          let suffix =
            hangingLine?.id?.split("L") || Math.floor(Math.random() * 100);
          let newLineId = "L" + Number(suffix[1]) + 15;
          let _nodes = [...nodes];

          _nodes[0] = {
            ...nodes[0],
            connectedLines: [
              ...nodes[0]?.connectedLines,
              { id: newLineId, target: "end" },
            ],
            connectedNodes: [
              ...nodes[0]?.connectedNodes,
              _nodes[nodes.length - 1]?.id,
            ],
          };

          _nodes[nodes.length - 1] = {
            ...nodes[nodes.length - 1],
            connectedLines: [
              ...nodes[nodes.length - 1]?.connectedLines,
              { id: newLineId, target: "start" },
            ],
            connectedNodes: [
              ...nodes[nodes.length - 1]?.connectedNodes,
              _nodes[0]?.id,
            ],
          };

          dispatch(updateNodes(_nodes));
          let _lines = [...lines];
          _lines[0] = {
            ..._lines[0],
            connectedLines: [..._lines[0].connectedLines, newLineId],
            connectedNodes: [..._lines[0].connectedNodes],
          };
          _lines[_lines.length - 1] = {
            ..._lines[_lines.length - 1],
            connectedLines: [
              ..._lines[_lines.length - 1].connectedLines,
              newLineId,
            ],
            connectedNodes: [
              ..._lines[_lines.length - 1].connectedNodes,
              { id: nodes[nodes.length - 1].id, target: "end" },
            ],
          };
          let _newLine = {
            points: [
              nodes[nodes.length - 1].x,
              nodes[nodes.length - 1].y,
              nodes[0].x,
              nodes[0].y,
            ],
            id: newLineId,
            name: "line",
            connectedLines: [_lines[_lines.length - 1].id, _lines[0].id],
            connectedNodes: [
              { id: _nodes[_nodes.length - 1].id, target: "start" },
              { id: _nodes[0].id, target: "end" },
            ],
          };

          _lines.push(_newLine);

          let path = createPath(_nodes, _lines);

          dispatch(
            updateShapes([
              ...shapes,
              {
                name: "Shape" + _currentNodeId.charAt(0),
                shapeData: path,
                nodes: _nodes,
                lines: _lines,
              },
            ])
          );

          dispatch(updateNodes([]));
          dispatch(updateLines([]));
          dispatch(updateHangingLine({}));
          dispatch(updatePrefixIndex(prefixIndex + 1));
        } else {
          // snaps and line should continue as shape is not complete yet

          let _nodeIndex = nodes
            .map((e) => e.id)
            .indexOf(event?.target?.attrs?.id);
          dispatch(updateSnappedNodeIndex(_nodeIndex));
          let _snappingNode = { ...nodes[_nodeIndex] };

          let suffix =
            hangingLine?.id?.split("L") || Math.floor(Math.random() * 100);
          let newLineId = "L" + Number(suffix[1]) + 15;
          let _lines = _.cloneDeep(lines);
          let connectedIds = [];
          nodes[_nodeIndex].connectedLines.forEach((e) => {
            connectedIds.push(e.id);
          });
          /* we need to add current line id to all lines within connectedIds array */
          connectedIds.forEach((id) => {
            let _lineIndex = lines.map((e) => e.id).indexOf(id);

            _lines[_lineIndex] = {
              ..._lines[_lineIndex],
              connectedLines: [
                ..._lines[_lineIndex]?.connectedLines,
                newLineId,
              ],
              connectedNodes: [...lines[_lineIndex]?.connectedNodes],
            };
          });

          _lines[_lines.length - 1] = {
            ..._lines[_lines.length - 1],
            connectedLines: [
              ..._lines[_lines.length - 1]?.connectedLines,
              newLineId,
            ],
            connectedNodes: [
              ...lines[_lines.length - 1]?.connectedNodes,
              { id: nodes[nodes.length - 1]?.id, target: "end" },
            ],
          };

          _lines.push({
            points: [
              nodes[nodes.length - 1]?.x,
              nodes[nodes.length - 1]?.y,
              _snappingNode.x,
              _snappingNode.y,
            ],
            id: newLineId,
            name: "line",
            connectedLines: [_lines[_lines.length - 1]?.id, ...connectedIds],
            connectedNodes: [
              { id: nodes[nodes.length - 1]?.id, target: "start" },
              { id: nodes[_nodeIndex]?.id, target: "end" },
            ],
          });

          dispatch(updateLines(_lines));
        }
      } else {
        // Creating other normal nodes of a shape

        let prevNodeId = nodes[nodes.length - 1]?.id;
        prevNodeId = Number(prevNodeId?.substring(1)) + 1 || 0;

        let newNode = {
          x: pos.x,
          y: pos.y,
          id: prefix + prevNodeId,
          name,
          connectedLines: [{ id: hangingLine?.id, target: "end" }],
          connectedNodes: [nodes[nodes.length - 1].id],
        };

        // updating previous node's data

        let previousNode = {
          x: nodes[nodes.length - 1].x,
          y: nodes[nodes.length - 1].y,
          id: nodes[nodes.length - 1].id,
          name: nodes[nodes.length - 1].name,
          connectedLines: [
            ...nodes[nodes.length - 1].connectedLines,
            { id: hangingLine?.id, target: "start" },
          ], // add connected lines and nodes
          connectedNodes: [
            ...nodes[nodes.length - 1].connectedNodes,
            newNode.id,
          ],
        };

        let nodesWithoutPreviousNode = nodes.slice(0, nodes.length - 1);
        dispatch(
          updateNodes([...nodesWithoutPreviousNode, previousNode, newNode])
        );
        createLine(newNode);
      }
      updateHistory();
    }
  };

  const updateNode = (event) => {
    if (event.target.attrs.className === "circle" && tool === "selection") {
      let _x = event?.target?.attrs?.x;
      let _y = event?.target?.attrs?.y;
      let _id = event?.target?.attrs?.id;

      let _nodeIndex = nodes.map((e) => e.id).indexOf(_id);
      let _nodes = _.cloneDeep(nodes);
      let _lines = _.cloneDeep(lines);

      _nodes[_nodeIndex] = {
        x: _x,
        y: _y,
        id: _id,
        name: "line",
        connectedLines: _nodes[_nodeIndex].connectedLines,
        connectedNodes: _nodes[_nodeIndex].connectedNodes,
      };

      _nodes[_nodeIndex].connectedLines.forEach((line) => {
        let lineIndex = _lines.map((e) => e.id).indexOf(line.id);
        if (line.target === "start") {
          if (_lines[lineIndex].name === "line") {
            let points = [..._lines[lineIndex].points];
            _lines[lineIndex] = {
              points: [_x, _y, points[2], points[3]],
              name: _lines[lineIndex].name,
              id: _lines[lineIndex].id,
              connectedLines: _lines[lineIndex].connectedLines,
              connectedNodes: _lines[lineIndex].connectedNodes,
            };
          } else {
            console.log(_lines[lineIndex]);
            _lines[lineIndex] = {
              name: _lines[lineIndex].name,
              id: _lines[lineIndex].id,
              connectedLines: _lines[lineIndex].connectedLines,
              connectedNodes: _lines[lineIndex].connectedNodes,
              x1: _x,
              y1: _y,
              x2: _lines[lineIndex].x2,
              y2: _lines[lineIndex].y2,
              cx1: _lines[lineIndex].cx1,
              cy1: _lines[lineIndex].cy1,
              control1Id: _lines[lineIndex].control1Id,
              cx2: _lines[lineIndex].cx2,
              cy2: _lines[lineIndex].cy2,
              control2Id: _lines[lineIndex].control2Id,
            };
          }
        } else if (line.target === "end") {
          if (_lines[lineIndex].name === "line") {
            let points = [..._lines[lineIndex].points];
            _lines[lineIndex] = {
              points: [points[0], points[1], _x, _y],
              name: _lines[lineIndex].name,
              id: _lines[lineIndex].id,
              connectedLines: _lines[lineIndex].connectedLines,
              connectedNodes: _lines[lineIndex].connectedNodes,
            };
          } else {
            _lines[lineIndex] = {
              name: _lines[lineIndex].name,
              id: _lines[lineIndex].id,
              connectedLines: _lines[lineIndex].connectedLines,
              connectedNodes: _lines[lineIndex].connectedNodes,
              x1: _lines[lineIndex].x1,
              y1: _lines[lineIndex].y1,
              x2: _x,
              y2: _y,
              cx1: _lines[lineIndex].cx1,
              cy1: _lines[lineIndex].cy1,
              control1Id: _lines[lineIndex].control1Id,
              cx2: _lines[lineIndex].cx2,
              cy2: _lines[lineIndex].cy2,
              control2Id: _lines[lineIndex].control2Id,
            };
          }
        }
      });
      dispatch(updateNodes(_nodes));
      dispatch(updateLines(_lines));
    }
  };

  const deleteNode = (deletingNodes) => {
    if (deletingNodes.length > 0) {
      let _nodes = _.cloneDeep(nodes);
      let _lines = _.cloneDeep(lines);

      deletingNodes.forEach((deletingNode) => {
        _nodes.forEach((node) => {
          if (node.id === deletingNode.id) {
            let nodeIndex = _nodes.indexOf(node);
            let connectedLines = _nodes[nodeIndex].connectedLines;
            let deletingLines = [];
            connectedLines.forEach((line) => {
              if (line.id.charAt(0) === "L" || line.id.charAt(0) === "C") {
                deletingLines.push(line.id);
                let lineIndex = _lines.map((e) => e.id).indexOf(line.id);
                _lines.splice(lineIndex, 1);
              }
            });
            deletingLines.forEach((id) => {
              if (nodeIndex > 0) {
                _nodes[nodeIndex - 1].connectedLines.forEach((line) => {
                  if (line.id === id) {
                    let index = _nodes[nodeIndex - 1].connectedLines
                      .map((e) => e.id)
                      .indexOf(line.id);
                    _nodes[nodeIndex - 1].connectedLines.splice(index, 1);
                  }
                });
                _nodes[nodeIndex - 1].connectedNodes.forEach((e) => {
                  if (node.id === e) {
                    let index = _nodes[nodeIndex - 1].connectedNodes.indexOf(
                      node.id
                    );
                    _nodes[nodeIndex - 1].connectedNodes.splice(index, 1);
                  }
                });
              }
              if (nodeIndex < _nodes.length - 1) {
                _nodes[nodeIndex + 1].connectedLines.forEach((line) => {
                  if (line.id === id) {
                    let index = _nodes[nodeIndex + 1].connectedLines
                      .map((e) => e.id)
                      .indexOf(line.id);
                    _nodes[nodeIndex + 1].connectedLines.splice(index, 1);
                  }
                });
                _nodes[nodeIndex + 1].connectedNodes.forEach((e) => {
                  if (node.id === e) {
                    let index = _nodes[nodeIndex + 1].connectedNodes.indexOf(
                      node.id
                    );
                    _nodes[nodeIndex + 1].connectedNodes.splice(index, 1);
                  }
                });
              }
            });
            _nodes.splice(nodeIndex, 1);
          }
        });
      });

      dispatch(updateNodes(_nodes));
      dispatch(updateLines(_lines));
    }
    updateHistory();
  };

  return { createNode, updateNode, deleteNode };
};

export default useNode;
