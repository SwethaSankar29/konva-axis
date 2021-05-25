import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { useDispatch, useSelector, useStore } from "react-redux";
import useNode from "../customHooks/useNode";
import useHangingLine from "../customHooks/useHangingLine";
import {
  getCurrentTool,
  getSingleEscapePressed,
  updateSingleEscapePress,
  updateCursorDownPoint,
  getNeedlePoint,
  getZoomFactor,
  getOffsetFactor,
} from "../features/actives";
import "./CanvasArea.css";
import HangingLine from "./layers/HangingLine";
import NonEditableShapes from "./layers/NonEditableShapes";
import EditableShape from "./layers/EditableShape";
import { getBBox, getHangingLine, updateBBox } from "../features/editableShape";
import useHistory from "../customHooks/useHistory";
import useShape from "../customHooks/useShape";

import useModifier from "../customHooks/useModifier";
import ContextMenu from "./ContextMenu";
import Axis from "./Axis";
import AxisNeedle from "./AxisNeedle";

const CanvasArea = ({ stageRef }) => {
  const widthLimit = window.innerWidth * 0.25;
  const heightLimit = window.innerHeight * 0.11;
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });
  const [showContext, setShowContext] = useState(false);

  const tool = useSelector(getCurrentTool);
  const hangingLine = useSelector(getHangingLine);
  const isSingleEscapePressed = useSelector(getSingleEscapePressed);
  const bBox = useSelector(getBBox);

  const needlePoint = useSelector(getNeedlePoint);
  const zoomFactor = useSelector(getZoomFactor);
  const offsetFactor = useSelector(getOffsetFactor);

  const store = useStore().getState();
  const dispatch = useDispatch();

  const editableShape = store.editableShape;
  const nonEditableShapes = store.nonEditableShapes;

  const { createNode, updateNode, deleteNode } = useNode();
  const { createHangingLine } = useHangingLine();
  const { undo, redo, updateHistory } = useHistory();
  const { createBBox, addToShapes, dragUpdateShape } = useShape();
  const { lineToCurve, curveToLine, updateControlNode, changeToEditableShape } =
    useModifier();
  const layerRef = React.useRef();

  const updateCursorDownPointValues = (e) => {
    dispatch(
      updateCursorDownPoint({
        x: e.target.getStage().pointerPos.x,
        y: e.target.getStage().pointerPos.y,
      })
    );
  };

  useEffect(() => {
    const combinedEvents = (event) => {
      // console.log(store?.editableShape?.bBox.length);
      if (event.key === "Delete") {
        deleteNode(selectedNodes);
      } else if (event.key === "Escape") {
        if (bBox.length === 1 && editableShape.nodes.length > 0) {
          /* 3rd escape press */
          addToShapes(editableShape);
          dispatch(updateBBox([]));
        } else if (isSingleEscapePressed) {
          /* 2nd escape press */
          createBBox();
        } else if (store?.editableShape?.hangingLine) {
          /* 1st escape press */
          dispatch(updateSingleEscapePress(true));
        }
      }
    };

    const pianoClick = (event) => {
      if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
        undo();
      } else if (event.ctrlKey && (event.key === "y" || event.key === "Y")) {
        redo();
      } else if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.key === "z" || event.key === "Z")
      ) {
        redo();
      }
    };

    const openContextMenu = (e) => {
      e.preventDefault();
      setContextPos({ x: e.clientX, y: e.clientY });
      setShowContext(true);
    };

    document.addEventListener("keydown", pianoClick);

    document.addEventListener("keydown", combinedEvents);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true);
      } else if (event.key === "Control") {
        setIsCtrlPressed(true);
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      } else if (event.key === "Control") {
        setIsCtrlPressed(false);
      }
    });

    document.addEventListener("contextmenu", openContextMenu);
    return () => {
      document.removeEventListener("keydown", pianoClick);
      document.removeEventListener("keydown", combinedEvents);
      document.removeEventListener("contextmenu", openContextMenu);
    };
  });

  return (
    <>
      <Stage
        className={tool === "draw" ? "draw" : "selection"}
        width={window.innerWidth - widthLimit}
        height={window.innerHeight - heightLimit}
        onClick={createNode}
        onMouseMove={createHangingLine}
        id="stage"
        ref={stageRef}
        style={{ overflow: "hidden" }}
      >
        <NonEditableShapes
          nonEditableShapes={nonEditableShapes}
          tool={tool}
          changeToEditableShape={changeToEditableShape}
        />
        <EditableShape
          editableShape={editableShape}
          updateNode={updateNode}
          isShiftPressed={isShiftPressed}
          isCtrlPressed={isCtrlPressed}
          selectedNodes={selectedNodes}
          setSelectedNodes={setSelectedNodes}
          tool={tool}
          lineToCurve={lineToCurve}
          curveToLine={curveToLine}
          updateControlNode={updateControlNode}
          updateHistory={updateHistory}
          updateCursorDownPointValues={updateCursorDownPointValues}
          dragUpdateShape={dragUpdateShape}
        />
        {tool === "draw" && hangingLine && !isSingleEscapePressed && (
          <HangingLine hangingLine={hangingLine} />
        )}
        <Layer ref={layerRef}>
          <Axis
            pixel={100}
            width={window.innerWidth - widthLimit}
            height={window.innerHeight - heightLimit}
            scale={zoomFactor}
            offset={offsetFactor}
          />
        </Layer>

        <AxisNeedle
          layerRef={layerRef}
          xPosition={needlePoint[0]}
          yPosition={needlePoint[1]}
          scale={zoomFactor}
          offset={offsetFactor}
        ></AxisNeedle>
      </Stage>
      {showContext && (
        <ContextMenu contextPos={contextPos} setShowContext={setShowContext} />
      )}
    </>
  );
};

export default CanvasArea;
