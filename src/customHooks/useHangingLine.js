import _ from "lodash";
import nextId from "react-id-generator";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  getCurrentTool,
  getCursorPoint,
  getDisableDrawing,
  updateCursorPoint,
} from "../features/actives";
import {
  getHangingLine,
  getNodes,
  updateHangingLine,
} from "../features/editableShape";

const useHangingLine = () => {
  const dispatch = useDispatch();

  const tool = useSelector(getCurrentTool);
  const nodes = useSelector(getNodes);
  const hangingLine = useSelector(getHangingLine);
  const currentCursorPosition = useSelector(getCursorPoint);
  const disableDrawing = useSelector(getDisableDrawing);
  const snappedNodeIndex = useStore().getState().editableShape.snappedNodeIndex;

  const _id = nextId("L");

  const createHangingLine = (event) => {
    let name = "hangingLine";
    let pos = event.target.getStage().getPointerPosition();
    let lastNode = null;
    if (snappedNodeIndex !== 0) {
      lastNode = { ...nodes[snappedNodeIndex] };
    } else if (snappedNodeIndex === 0) {
      lastNode = { ...nodes[nodes.length - 1] };
    }

    /* updating current cursor position, this can be used to get temporary line when tool is switched from view to draw */
    dispatch(updateCursorPoint({ x: pos.x, y: pos.y }));
    if (tool === "draw" && nodes.length > 0 && !disableDrawing) {
      dispatch(
        updateHangingLine({
          points: [lastNode.x, lastNode.y, pos.x, pos.y],
          id: _id,
          name,
        })
      );
    }
  };

  const updateHangingLineData = (nodesData) => {
    let _hangingLine = _.cloneDeep(hangingLine);
    let _nodes = _.cloneDeep(nodesData);
    let _newHangingLine;
    if (_hangingLine?.points && _nodes.length !== 0) {
      _newHangingLine = {
        id: _hangingLine.id,
        name: _hangingLine.name,
        points: [
          _nodes[_nodes.length - 1].x,
          _nodes[_nodes.length - 1].y,
          _hangingLine.points[2],
          _hangingLine.points[3],
        ],
      };
    } else if (_nodes.length > 0) {
      _newHangingLine = {
        id: _hangingLine.id,
        name: _hangingLine.name,
        points: [
          _nodes[_nodes.length - 1].x,
          _nodes[_nodes.length - 1].y,
          currentCursorPosition.x,
          currentCursorPosition.y,
        ],
      };
    } else if (_nodes.length === 0) {
      _newHangingLine = {};
    }
    dispatch(updateHangingLine(_newHangingLine));
  };

  return { createHangingLine, updateHangingLineData };
};

export default useHangingLine;
