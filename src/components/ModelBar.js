import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  getModelsData,
  getCurrentModel,
  updateModels,
  updateCurrentModelName,
} from "../features/models";
import { updateDisableEvents } from "../features/actives";
import { Button, Modal } from "react-bootstrap";
import "./ModelBar.css";
import useModel from "../customHooks/useModel";
import * as _ from "lodash";

const ModelBar = () => {
  const [i, setI] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modelIndex, setModelIndex] = useState(0);
  const [model, setModel] = useState("");
  const modelBarRef = useRef(null);

  const dispatch = useDispatch();
  const store = useStore().getState();

  const models = useSelector(getModelsData);
  const currentModel = useSelector(getCurrentModel);

  const { updateModelData, updateModelDataOnAdd, fetchModelData } = useModel();

  useEffect(() => {
    if (modelBarRef) {
      modelBarRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ left: target.scrollWidth, behavior: "smooth" });
      });
    }
    return () => {
      //
    };
  }, []);

  const addModel = () => {
    let newModelName = `Unnamed Model ${i}`;
    let _newModels = updateModelDataOnAdd(store);
    let _newModel = { modelName: newModelName, modelData: {} };
    dispatch(updateModels([..._newModels, _newModel]));
    setI(i + 1);
    dispatch(updateCurrentModelName(newModelName));
  };

  const deleteModel = (index) => {
    let currentModelIndex = models
      .map((e) => e.modelName)
      .indexOf(currentModel);
    if (currentModelIndex === index) {
      /* Deleting Current Model */
      alert(
        "Can't delete current model, change current model to some other and delete this model"
      );
    } else {
      let _models = _.cloneDeep(models);
      _models.splice(index, 1);
      dispatch(updateModels(_models));
    }
  };

  const editModelNameFunction = (modelName, index) => {
    dispatch(updateDisableEvents(true));
    setShowModal(true);
    setModel(modelName);
    setModelIndex(index);
  };

  const handleClose = () => {
    setShowModal(false);
    dispatch(updateDisableEvents(false));
  };

  const updateModelName = () => {
    let _models = _.cloneDeep(models);
    _models[modelIndex] = {
      ...models[modelIndex],
      modelName: model,
    };
    dispatch(updateModels(_models));
    setShowModal(false);
    dispatch(updateDisableEvents(false));
    dispatch(updateCurrentModelName(model));
    setModel("");
    setModelIndex(0);
  };

  const loadData = (index) => {
    let currentModelIndex = models
      .map((e) => e.modelName)
      .indexOf(currentModel);
    if (currentModelIndex !== index) {
      updateModelData(store);
      dispatch(updateCurrentModelName(models[index].modelName));
      /* adding data back from models comes here */
      fetchModelData(index);
    }
  };

  const leftChevronClick = () => {
    modelBarRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const rightChevronClick = () => {
    modelBarRef.current.scrollBy({ left: 230, behavior: "smooth" });
  };

  const enterPress = (event) => {
    if (event.key === "Enter") {
      updateModelName();
    }
  };

  return (
    <div className="tab">
      <div className="tabBar" ref={modelBarRef}>
        {models?.map((model, i) => (
          <div key={i} className="tabBar__tab">
            <button className="addDeleteButton" onClick={() => deleteModel(i)}>
              <span>x</span>
            </button>
            <h5
              className={
                currentModel === model.modelName ? "focus" : "nonFocus"
              }
              onClick={() => loadData(i)}
              onDoubleClick={() => editModelNameFunction(model.modelName, i)}
            >
              {model.modelName}
            </h5>
          </div>
        ))}
        <button className="addDeleteButton" onClick={addModel}>
          <span style={{ marginTop: "10%" }}>+</span>
        </button>
      </div>
      <button className="btn-chevron btn-left" onClick={leftChevronClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-chevron-left"
          viewBox="0 0 16 16"
          stroke="gray"
          strokeWidth={3}
        >
          <path
            fillRule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
      </button>
      <button className="btn-chevron  btn-right" onClick={rightChevronClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="black"
          className="bi bi-chevron-right"
          viewBox="0 0 16 16"
          stroke="gray"
          strokeWidth={3}
        >
          <path
            fillRule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>

      <Modal show={showModal} onHide={handleClose} animation={false}>
        <Modal.Header>
          <Modal.Title>Change model name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="modalInput"
            type="text"
            autoFocus
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onKeyPress={enterPress}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={updateModelName}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModelBar;
