import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from 'redux-persist/integration/react'
import App from "./App";
import { store, persistor } from "./app/store";
import { Provider as ReduxProvider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import { AppCtxProvider } from "./context/context";
import { FirebaseAuthProvider } from "./firebase/FirebaseAuthProvider";

ReactDOM.render(
  <React.StrictMode>
    <AppCtxProvider>
      <FirebaseAuthProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </ReduxProvider>
      </FirebaseAuthProvider>
    </AppCtxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
