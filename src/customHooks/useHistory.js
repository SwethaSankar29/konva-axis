import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
    updateHangingLine,
    updateLines,
    updateNodes,
    updatePrefixIndex,
    updateBBox,
    getNodes,
    getLines,
    getPrefixIndex,
    getBBox,
} from "../features/editableShape";
import {
    getPast,
    getFuture,
    updatePast,
    updateFuture,
} from "../features/history";
import { getShapes, updateShapes } from "../features/nonEditableShapes";
import {
    updateCursorPoint,
    updateCurrentTool,
    updateSelectedNodes,
    updateSelectedLines,
    updateSingleEscapePress,
    updateDraggableNode,
    getCurrentTool,
    updateNeedlePoint,
} from "../features/actives";
import useHangingLine from "./useHangingLine";
import useShape from "./useShape";

const useHistory = () => {
    const dispatch = useDispatch();

    const past = useSelector(getPast);
    const nodes = useSelector(getNodes);
    const lines = useSelector(getLines);
    const currentTool = useSelector(getCurrentTool);
    const shapes = useSelector(getShapes);
    const prefixIndex = useSelector(getPrefixIndex);
    const bBox = useSelector(getBBox);
    const future = useSelector(getFuture);

    const { updateHangingLineData } = useHangingLine();
    const { createBBox } = useShape();

    const reset = () => {
        dispatch(updateHangingLine({}));
        dispatch(updateLines([]));
        dispatch(updateNodes([]));
        dispatch(updatePrefixIndex(0));
        dispatch(updateBBox([]));

        dispatch(updateShapes([]));

        dispatch(updatePast([]));
        dispatch(updateFuture([]));

        dispatch(updateCurrentTool("selection"));
        dispatch(updateCursorPoint({ x: 0, y: 0 }));
        dispatch(updateDraggableNode(null));
        dispatch(updateSelectedNodes([]));
        dispatch(updateSelectedLines([]));
        dispatch(updateSingleEscapePress(false));
        dispatch(updateNeedlePoint([0, 0]));
    };

    const updateHistory = () => {
        let pastData = _.cloneDeep(past);
        let _nodes = _.cloneDeep(nodes);
        let _lines = _.cloneDeep(lines);
        let _shapes = _.cloneDeep(shapes);
        let _currentTool = _.cloneDeep(currentTool);
        let _prefixIndex = _.cloneDeep(prefixIndex);
        let _bBox = _.cloneDeep(bBox);

        pastData.push({
            nodes: _nodes,
            lines: _lines,
            shapes: _shapes,
            currentTool: _currentTool,
            prefixIndex: _prefixIndex,
            bBox: _bBox,
        });

        dispatch(updatePast(pastData));
    };

    const undo = () => {
        if (past.length === 0) {
            return;
        } else if (past.data !== 0) {
            if (nodes.length === 0) {
                /* When there is no data in editableShape */
                if (shapes.length === 0) {
                    /* if there is no data in Shapes */
                    return;
                } else if (shapes.length !== 0) {
                    /* to remove last shape from shapes array and put its data onto editableShape */
                    let _data = shapes[shapes.length - 1];
                    let _shapes = _.cloneDeep(shapes);
                    let _newShapes = _shapes.slice(0, shapes.length - 1);
                    let _lines = _.cloneDeep(_data.lines);
                    let _nodes = _.cloneDeep(_data.nodes);

                    dispatch(updateShapes(_newShapes));
                    dispatch(updateLines(_lines));
                    dispatch(updateNodes(_nodes));
                    updateHangingLineData(_nodes);
                    createBBox(_nodes);
                }
            } else if (nodes.length !== 0) {
                let pastData = _.cloneDeep(past);
                let futureData = _.cloneDeep(future);
                let _nodes = _.cloneDeep(nodes);
                let _lines = _.cloneDeep(lines);
                let _shapes = _.cloneDeep(shapes);
                let _currentTool = _.cloneDeep(currentTool);
                let _prefixIndex = _.cloneDeep(prefixIndex);
                let _bBox = _.cloneDeep(bBox);

                /* if (nodes.length === 0) {
        if (shapes.length > 0) {
          dispatch(updatePrefixIndex(prefixIndex - 1));
        }
      } */

                let usingData = _.cloneWith(pastData[pastData.length - 1]);
                pastData.pop();

                futureData.push({
                    nodes: _nodes,
                    lines: _lines,
                    shapes: _shapes,
                    currentTool: _currentTool,
                    prefixIndex: _prefixIndex,
                    bBox: _bBox,
                });

                dispatch(updatePast(pastData));
                dispatch(updateFuture(futureData));
                dispatch(updateNodes(usingData.nodes));
                dispatch(updateLines(usingData.lines));
                dispatch(updateShapes(usingData.shapes));
                dispatch(updateCurrentTool(usingData.currentTool));
                dispatch(updateBBox(usingData.bBox));
                if (usingData.nodes.length > 0) {
                    updateHangingLineData(usingData.nodes);
                }
                /* dispatch(updatePrefixIndex(usingData.prefixIndex)); */
            }
        }
    };

    const redo = () => {
        if (future.length === 0) {
            return;
        } else if (future.length !== 0) {
            let pastData = _.cloneDeep(past);
            let futureData = _.cloneDeep(future);
            let _nodes = _.cloneDeep(nodes);
            let _lines = _.cloneDeep(lines);
            let _shapes = _.cloneDeep(shapes);
            let _currentTool = _.cloneDeep(currentTool);
            let _prefixIndex = _.cloneDeep(prefixIndex);
            let _bBox = _.cloneDeep(bBox);

            /* if (nodes.length === 0) {
                          if (shapes.length > 0) {
                            dispatch(updatePrefixIndex(prefixIndex - 1));
                          }
                        } */

            let usingData = _.cloneWith(futureData[futureData.length - 1]);
            futureData.pop();

            pastData.push({
                nodes: _nodes,
                lines: _lines,
                shapes: _shapes,
                currentTool: _currentTool,
                prefixIndex: _prefixIndex,
                bBox: _bBox,
            });

            dispatch(updatePast(pastData));
            dispatch(updateFuture(futureData));
            dispatch(updateNodes(usingData.nodes));
            dispatch(updateLines(usingData.lines));
            dispatch(updateShapes(usingData.shapes));
            dispatch(updateCurrentTool(usingData.currentTool));
            /* dispatch(updatePrefixIndex(usingData.prefixIndex)); */
            dispatch(updateBBox(usingData.bBox));
            if (usingData.nodes.length > 0) {
                updateHangingLineData(usingData.nodes);
            }
        }
    };

    return { reset, updateHistory, undo, redo };
};

export default useHistory;