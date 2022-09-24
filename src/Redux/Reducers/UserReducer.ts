import { CHANGE_PLANS, LINK_GOOGLE, LOG_OUT, SET_USER } from "Redux/Constants";
import { IUserState } from "Redux/StateInterface";
import { UserActionType } from "Redux/Types";

const initialState: IUserState = {
  token: null,
  user: null,
};

export default (state: IUserState = initialState, action: UserActionType): IUserState => {
  switch (action.type) {
    case SET_USER: {
      return {
        ...state,
        ...action.payload,
      } as IUserState;
    }
    case LOG_OUT: {
      return initialState;
    }
    case LINK_GOOGLE: {
      return {
        ...state,
        user: {
          ...state.user,
          googleLink: action.payload.toLink,
        },
      } as IUserState;
    }
    case CHANGE_PLANS: {
      return {
        ...state,
        user: {
          ...state.user,
          plannedEarn: action.payload.plannedEarn,
          plannedSpend: action.payload.plannedSpend,
        },
      } as IUserState;
    }
    default: {
      return state;
    }
  }
};
