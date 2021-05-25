import React, { useEffect, useRef } from "react";
import TopBar from "../components/TopBar";
import ModelBar from "../components/ModelBar";
import "./DrawingPage.css";
import CanvasArea from "../components/CanvasArea";
import SideBar from "../components/SideBar";
import useActives from "../customHooks/useActives";
import { useSelector } from "react-redux";
import { getDisableEvents } from "../features/actives";

const DrawingPage = () => {
  const { changeTool } = useActives();
  const stageRef = useRef();

  const isDisableEvents = useSelector(getDisableEvents);

  useEffect(() => {
    const pianoClick = (event) => {
      if (!isDisableEvents) {
        if (event.key === "p" || event.key === "P") {
          changeTool("draw");
        } else if (event.key === "v" || event.key === "V") {
          changeTool("selection");
        }
      }
    };

    document.addEventListener("keydown", pianoClick);
    return () => {
      document.removeEventListener("keydown", pianoClick);
    };
  });

  return (
    <div className="drawingPage">
      <TopBar />
      <ModelBar />
      <div className="drawingPage__body">
        <CanvasArea stageRef={stageRef} />
        <SideBar stageRef={stageRef} />
      </div>
    </div>
  );
};

export default DrawingPage;
