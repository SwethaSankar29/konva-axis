import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  getModelsData,
  updateModels,
  getCurrentModel,
} from "../features/models";
import useHistory from "./useHistory";
import {
  updateDraggableNode,
  updateCurrentTool,
  updateCursorPoint,
  updateSelectedLines,
  updateSelectedNodes,
  updateSingleEscapePress,
} from "../features/actives";
import {
  getEditableShape,
  updateBBox,
  updateHangingLine,
  updateLines,
  updateNodes,
  updatePrefixIndex,
  updateSnappedNodeIndex,
} from "../features/editableShape";
import { updateShapes } from "../features/nonEditableShapes";
import { updatePast } from "../features/history";

const useModel = () => {
  const currentModel = useSelector(getCurrentModel);
  const models = useSelector(getModelsData);
  const editableShapeData = useSelector(getEditableShape);

  const dispatch = useDispatch();

  const { reset } = useHistory();

  const updateModelData = (store) => {
    let actives = _.cloneDeep(store.actives);
    let editableShape = _.cloneDeep(editableShapeData);
    let nonEditableShapes = _.cloneDeep(store.nonEditableShapes);
    let history = _.cloneDeep(store.history);

    let _models = _.cloneDeep(models);
    let index = _models.map((e) => e.modelName).indexOf(currentModel);
    _models[index] = {
      modelName: _models[index].modelName,
      modelData: {
        actives,
        editableShape,
        nonEditableShapes,
        history,
      },
    };
    dispatch(updateModels(_models));
    reset();
  };

  const updateModelDataOnAdd = (store) => {
    let actives = _.cloneDeep(store.actives);
    let editableShape = _.cloneDeep(editableShapeData);
    let nonEditableShapes = _.cloneDeep(store.nonEditableShapes);
    let history = _.cloneDeep(store.history);

    let _models = _.cloneDeep(models);
    let index = _models.map((e) => e.modelName).indexOf(currentModel);
    _models[index] = {
      modelName: _models[index].modelName,
      modelData: {
        actives,
        editableShape,
        nonEditableShapes,
        history,
      },
    };
    dispatch(updateModels(_models));
    reset();
    return _models;
  };

  const fetchModelData = (index) => {
    let _models = _.cloneDeep(models);
    if (_models[index]) {
      let _actives = _.cloneDeep(_models[index].modelData.actives);
      let _editableShape = _.cloneDeep(_models[index].modelData.editableShape);
      let _nonEditableShapes = _.cloneDeep(
        _models[index].modelData.nonEditableShapes
      );
      let _history = _.cloneDeep(_models[index].modelData.history);

      dispatch(updateCursorPoint(_actives.cursorPoint));
      dispatch(updateCurrentTool(_actives.currentTool));
      dispatch(updateSelectedNodes(_actives.selectedNodes));
      dispatch(updateSelectedLines(_actives.selectedLines));
      dispatch(updateSingleEscapePress(_actives.isSingleEscapePressed));
      dispatch(updateDraggableNode(_actives.draggableNode));

      dispatch(updateNodes(_editableShape.nodes));
      dispatch(updateLines(_editableShape.lines));
      dispatch(updateHangingLine(_editableShape.hangingLine));
      dispatch(updatePrefixIndex(_editableShape.prefixIndex));
      dispatch(updateBBox(_editableShape.bBox));
      dispatch(updateSnappedNodeIndex(_editableShape.snappedNodeIndex));

      dispatch(updateShapes(_nonEditableShapes.shapes));

      dispatch(updatePast(_history.past));
    }
  };

  return { updateModelData, updateModelDataOnAdd, fetchModelData };
};

export default useModel;
