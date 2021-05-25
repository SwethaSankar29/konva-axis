import { useDispatch, useSelector } from "react-redux";
import {
  getHangingLine,
  getLines,
  getNodes,
  updateHangingLine,
  updateLines,
} from "../features/editableShape";

const useLine = () => {
  const dispatch = useDispatch();

  const hangingLine = useSelector(getHangingLine);
  const lines = useSelector(getLines);
  const nodes = useSelector(getNodes);

  const createLine = (node) => {
    let name = "line";

    if (lines.length === 0) {
      // Creating first line of a shape

      let newLine = {
        ...hangingLine,
        name,
        connectedLines: [],
        connectedNodes: [
          { id: nodes[0]?.id, target: "start" },
          { id: node.id, target: "end" },
        ],
      };

      dispatch(updateLines([...lines, newLine]));
      dispatch(updateHangingLine([]));
    } else {
      // Creating other lines of a shape

      let newLine = {
        ...hangingLine,
        name,
        connectedLines: [lines[lines.length - 1].id],
        connectedNodes: [
          { id: nodes[nodes.length - 1].id, target: "start" },
          { id: node.id, target: "end" },
        ],
      };

      let points = lines[lines.length - 1].points;

      // updating data of previous line
      let previousLine = {};
      if (points !== undefined) {
        previousLine = {
          points,
          name: lines[lines.length - 1].name,
          id: lines[lines.length - 1].id,
          connectedLines: [
            ...lines[lines.length - 1]?.connectedLines,
            newLine.id,
          ],
          connectedNodes: [...lines[lines.length - 1]?.connectedNodes],
        };
      } else if (points === undefined) {
        previousLine = {
          ...lines[lines.length - 1],
          name: lines[lines.length - 1].name,
          id: lines[lines.length - 1].id,
          connectedLines: [
            ...lines[lines.length - 1]?.connectedLines,
            newLine.id,
          ],
          connectedNodes: [...lines[lines.length - 1]?.connectedNodes],
        };
      }

      let linesWithoutPreviousLine = lines.slice(0, lines.length - 1);

      dispatch(
        updateLines([...linesWithoutPreviousLine, previousLine, newLine])
      );
      dispatch(updateHangingLine([]));
    }
  };

  const updateLine = () => {
    //
  };

  return { createLine, updateLine };
};

export default useLine;
