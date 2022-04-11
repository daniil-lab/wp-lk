import { createStore } from "redux";

import Reducer from "Redux/RootReducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

export const Store = createStore(
  Reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export type RootStore = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
