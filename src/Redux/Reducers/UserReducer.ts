import { LOG_OUT, SET_USER } from "Redux/Constants";
import { IUserState } from "Redux/StateInterface";
import { UserActionType } from "Redux/Types";

const initialState: IUserState = {
  token: null,
  user: null,
};

export default (state: IUserState = initialState, action: UserActionType) => {
  switch (action.type) {
    case SET_USER: {
      console.log(action);
      return {
        ...state,
        ...action.payload,
      };
    }
    case LOG_OUT: {
      return {
        ...state,
        token: null,
        user: null,
      };
    }
    default: {
      return state;
    }
  }
};
