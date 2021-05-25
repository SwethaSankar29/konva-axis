import React, { useEffect, useState } from "react";
import "./ContextMenu.css";

const ContextOptions = ({ contextMenuFunc }) => {
  return (
    <>
      <h6 onClick={() => contextMenuFunc(1)}>ContextMenuShape</h6>
      <h6 onClick={() => contextMenuFunc(2)}>ContextMenuCanvas</h6>
      <h6 onClick={() => contextMenuFunc(3)}>ContextMenuPath</h6>
      <h6 onClick={() => contextMenuFunc(4)}>ContextMenuNode</h6>
      <h6 onClick={() => contextMenuFunc(5)}>ContextMenuTab</h6>
    </>
  );
};

const ContextMenu = ({ contextPos, setShowContext }) => {
  const [yTopLimit, setYTopLimit] = useState(0);
  const [yDownLimit, setYDownLimit] = useState(0);
  const [xRightLimit, setXRightLimit] = useState(0);
  let xOffset = 150;
  let yOffset = 200;
  let left = xRightLimit - xOffset;
  let top = yDownLimit - yOffset;

  useEffect(() => {
    setYTopLimit(11 * window.innerHeight * 0.01);
    setYDownLimit(window.innerHeight);
    setXRightLimit(window.innerWidth - 25 * window.innerWidth * 0.01);
    window.addEventListener("resize", () => {
      setYTopLimit(11 * window.innerHeight * 0.01);
      setYDownLimit(window.innerHeight);
      setXRightLimit(window.innerWidth - 25 * window.innerWidth * 0.01);
    });
    return () => {
      //
    };
  }, [contextPos]);

  const contextMenuFunc = (pos) => {
    console.log(pos);
    setShowContext(false);
  };

  return (
    <>
      {contextPos.x > left &&
      contextPos.x < xRightLimit &&
      contextPos.y > top &&
      contextPos.y < yDownLimit ? (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: contextPos.y - yOffset,
            left: contextPos.x - xOffset,
          }}
        >
          <ContextOptions contextMenuFunc={contextMenuFunc} />
        </div>
      ) : contextPos.x > left && contextPos.x < xRightLimit ? (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: contextPos.y,
            left: contextPos.x - xOffset,
          }}
        >
          <ContextOptions contextMenuFunc={contextMenuFunc} />
        </div>
      ) : contextPos.y > top && contextPos.y < yDownLimit ? (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: contextPos.y - yOffset,
            left: contextPos.x,
          }}
        >
          <ContextOptions contextMenuFunc={contextMenuFunc} />
        </div>
      ) : contextPos.x < xRightLimit &&
        yTopLimit < contextPos.y &&
        contextPos.y < yDownLimit ? (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: contextPos.y,
            left: contextPos.x,
          }}
        >
          <ContextOptions contextMenuFunc={contextMenuFunc} />
        </div>
      ) : null}
    </>
  );
};

export default ContextMenu;
