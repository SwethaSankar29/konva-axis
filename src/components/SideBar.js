import React from "react";
import { useSelector } from "react-redux";
import useActives from "../customHooks/useActives";
import useHistory from "../customHooks/useHistory";
import useSaveAs from "../customHooks/useSaveAs";
import { getCurrentTool } from "../features/actives";
import "./SideBar.css";

const SideBar = ({ stageRef }) => {
  const tool = useSelector(getCurrentTool);

  const { reset } = useHistory();
  const { changeTool } = useActives();
  const { savePdf, savePng, saveJPG } = useSaveAs();

  return (
    <div className="sidebar">
      <div className="sidebar__switch">
        <h3
          className={tool === "draw" ? "focus" : ""}
          onClick={() => changeTool("draw")}
        >
          P
        </h3>
        <h3
          className={tool === "selection" ? "focus" : ""}
          onClick={() => changeTool("selection")}
        >
          V
        </h3>
      </div>
      <div className="sidebar__buttons">
        <button onClick={reset}>Reset</button>
      </div>
      <div className="sidebar__buttons">
        <h4>Save as </h4>
        <button onClick={() => savePdf(stageRef)}>PDF</button>
        <button onClick={() => savePng(stageRef)}>PNG</button>
        <button onClick={() => saveJPG(stageRef)}>JPG</button>
      </div>
    </div>
  );
};

export default SideBar;
