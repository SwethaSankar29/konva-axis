import { useDispatch } from "react-redux";
import { updateCurrentTool } from "../features/actives";

const useActives = () => {
  const dispatch = useDispatch();

  const changeTool = (value) => {
    dispatch(updateCurrentTool(value));
  };

  return { changeTool };
};

export default useActives;
