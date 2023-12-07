import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import {Login} from "./components/Login/Login";
import {Tenant} from "./components/Tenant/Tenant";
import {Maintenance} from "./components/Maintenance/Maintenance";
import {Manager} from "./components/Manager/Manager"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  return (
      <BrowserRouter>
          <header>
              <Header></Header>
          </header>
          <main>
              <div className="container">
                  <Routes>
                      <Route exact path="/" Component={Login}></Route>
                      <Route path="/tenant" Component={Tenant}></Route>
                      <Route path="/maintenance" Component={Maintenance}></Route>
                      <Route path="/manager" Component={Manager}></Route>
                  </Routes>
              </div>
          </main>
      </BrowserRouter>
  );
}

export default App;
