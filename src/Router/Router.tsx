import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import PersonalAreaLayer from "Layers/PersonalArea/PersonalAreaLayer";
import Main from "Pages/Main/Main";
import Budget from "Pages/Budget/Budget";
import BonusСards from "Pages/BonusСards/BonusСards";
import CardScan from "Pages/CardScan/CardScan";
import Support from "Pages/Support/Support";
import LoginLayer from "Layers/Login/LoginLayer";
import { useDispatch, useSelector } from "react-redux";
import { GetPreloaderParams } from "Redux/Selectors";
import Preloader from "Components/Preloader/Preloader";
import Toast from "Components/Toast/Toast";
import RequireAuth from "./RequireAuth/RequireAuth";
import { AppDispatch } from "Redux/Store";
import Auth from "Services/Auth";
import Splash from "Components/Splash/Splash";
import Settings from "Pages/Settings/Settings";
import Sub from "Pages/Sub/Sub";

interface Props {}

const Router: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [load, setLoad] = useState<boolean>(false);

  const isPreloader = useSelector(GetPreloaderParams);

  const mount = async (): Promise<void> => {
    const auth = new Auth(dispatch);
    await auth.Initialization();
    setLoad(true);
  };

  useEffect(() => {
    mount();
  }, []);

  return (
    <>
      {load && (
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginLayer />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <PersonalAreaLayer />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Main />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/bonuscards" element={<BonusСards />} />
              <Route path="/cardscan" element={<CardScan />} />
              <Route path="/support" element={<Support />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/sub/:id" element={<Sub />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
      <Preloader show={isPreloader} />
      <Splash {...{ load }} />
      <Toast />
    </>
  );
};

export default Router;
