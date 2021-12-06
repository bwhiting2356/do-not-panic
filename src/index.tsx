import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./app/store";
import * as serviceWorker from "./serviceWorker";
import { AppCtxProvider } from "./context/context";
import { App } from "./App";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AppCtxProvider>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </AppCtxProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
