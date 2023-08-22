import { useState, useEffect, useContext, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ModalUnstyled from "@mui/base/ModalUnstyled";
// versions issue with mui/base/ModalUnstyled
// import ModalUnstyled from "@mui/base";
// import { ModalUnstyled } from '@mui/base';
import "./App.css";
import JazzDap from "./components/JazzDap";
import Dashboard from "./components/Dashboard/Dashboard";
import Preferences from "./components/Preferences/Preferences";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import { AiOutlineLoading } from 'react-icons/ai';
import { getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap, } from "./utils/HandleApi";
import logoJazzDap from "./Logo1.jpg";
import Register from "./components/Register/Register";
import AuthContext from "./context/AuthProvider";
import { UserContext } from "./context/UserContext";
import { WorkflowContext } from './components/Workflow/WorkflowContext';
import MusicInterface from "./components/MusicInterface/MusicInterface";

import { Provider } from 'react-redux';
import store from './components/App/store';

import Navbar from "./components/Presentation/Navbar";
import About from "./components/Presentation/About";
import Funding from "./components/Presentation/Funding";
import Investigators from "./components/Presentation/Investigators";
import Landing from "./components/Presentation/Landing";
import Partners from "./components/Presentation/Partners";
import Search from "./components/Presentation/Search";

export let setIsLoading; // Export the function

function App() {
  const [listJazzDap, setListJazzDap] = useState([]);
  const [textInputJazzDAP, setTextInputJazzDAP] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [jazzDapId, setJazzDapId] = useState("");

  const { auth, setAuth } = useContext(AuthContext);

  //  ---- Login buttons variables
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showDiv, setShowDiv] = useState(false);

  // Addition for components provided by designers
  // const [open, setOpen] = useState(false);
  // const invest = useRef < null | HTMLDivElement > (null);
  // const about = useRef < null | HTMLDivElement > (null);
  const about = useRef(null);
  // const partners = useRef < null | HTMLDivElement > (null);
  // const funding = useRef < null | HTMLDivElement > (null);
  // const landing = useRef < null | HTMLDivElement > (null);
  // const search = useRef < null | HTMLDivElement > (null);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  // : React.RefObject<HTMLDivElement>
  function scrollTo(ref) {
    // ref.current!.scrollIntoView({
    ref.current.scrollIntoView({ behavior: "smooth", })
  };



  const [isLoading, setIsLoadingState] = useState(false);
  useEffect(() => {
    setIsLoading = setIsLoadingState; // Assign the function to the exported variable
  }, []);

  useEffect(() => {
    getAllJazzDap(setListJazzDap);
  }, []);
  const updateMode = (_id, text) => {
    setIsUpdating(true);
    setTextInputJazzDAP(text);
    setJazzDapId(_id);
  };

  return (
    <Provider store={store}>    
      <div className="App">
        {(localStorage?.username === undefined) ?
          <button
            className='buttonShowDiv'
            onClick={() => setShowDiv(!showDiv)}
          >
            {showDiv ? 'Hide Login / Register' : 'Login / Register'}
          </button>
          : <></>
        }
        <div className="header">        
            <img src={logoJazzDap} className="imageHeader" alt="some value" name="Image1" align="bottom" width="125.6" height="70" border="0" />
            <span className="alpha_warning">ALPHA</span>

          {(showDiv || localStorage?.username !== undefined) &&
            <div className="wrapper">
                <div
                  className={
                    auth !== null || localStorage.token ? "offscreen" : "auth"
                  }
                >
                <Register/>
                <hr />
                <Login/>
              </div>
            </div>
          }
        </div>
        <div className="contentApp">

          {/* 
          TODO change in progress: set a global variable to keep track of the workflows loaded. 
          We need to ensure the distinction with loading light data and heavy things like search 
          */}

          { (auth !== null || localStorage.token ? "logout" : "offscreen") ?
            (
              <>
                <div className={auth !== null || localStorage.token ? "logout" : "offscreen"}>
                  <Logout />
                </div>
                <MusicInterface />
              </>
            )
            :
            <MusicInterface />
          } 

          {/* <div className="container">
            <div className="jazzdapInput">
              <input
                type="text"
                placeholder="Add Jazzdap"
                name="AddJazzDap"
                id="AddJazzDap"
                value={textInputJazzDAP}
                onChange={(e) => setTextInputJazzDAP(e.target.value)}
              />
              <div className="add" onClick={
                isUpdating
                  ? () =>
                    updateJazzDap(
                      jazzDapId,
                      textInputJazzDAP,
                      setListJazzDap,
                      setTextInputJazzDAP,
                      setIsUpdating,
                      localStorage.username ? localStorage.username : null)
                  : () =>
                    addJazzDap(
                      textInputJazzDAP,
                      setTextInputJazzDAP,
                      setListJazzDap,
                      localStorage.username ? localStorage.username : null
                    )
              }
              >
                {isUpdating ? "Update" : "Add"}
              </div>
            </div>
            <div className="list">
              {listJazzDap.map((item) => (
                <JazzDap
                  key={item._id}
                  text={item.text}
                  updateMode={() => updateMode(item._id, item.text, localStorage?.username)}
                  deleteJazzDap={() => deleteJazzDap(item._id, setListJazzDap)}
                />
              ))}
            </div>
          </div> */}


          <div className=" overflow-hidden">
            {/* <ModalUnstyled open={open} onClose={handleClose}>
              <Login onClose={handleClose}></Login>
            </ModalUnstyled> */}
            {/* <Navbar
              onLanding={() => scrollTo(landing)}
              onInvest={() => scrollTo(invest)}
              onAbout={() => scrollTo(about)}
              onPartner={() => scrollTo(partners)}
              onFunding={() => scrollTo(funding)}
              // onLogin={handleOpen}
            /> */}
            {/* <div ref={landing}> <Landing onClick={() => scrollTo(search)} /> </div> */}
            <div className=" -mt-[40vh]  h-[550vh]  pt-[40vh] "
              style={{ background:
                  "linear-gradient(122deg, rgba(2,3,12,1) 5%, rgba(42,45,78,1) 28%, rgba(33,29,56,1) 76%, rgba(80,111,127,1) 100%)", }} >
              {/* <div className="scroll-mt-10" ref={search}> <Search /> </div>
              <div className="scroll-mt-10" ref={invest}> <Investigators /> </div> */}
              <div className="scroll-mt-10" ref={about}> <About /> </div>
              {/* <div className="scroll-mt-10" ref={partners}> <Partners /> </div>
              <div className="scroll-mt-10" ref={funding}> <Funding /> </div> */}
            </div>
          </div>

        </div>
        {isLoading && (
          <div className="loading-container">
            <div className="loading-icon">
              <h2>Loading... This can take a few minutes.</h2>{" "}
              <AiOutlineLoading className="spin" size={window.innerHeight / 10} />
            </div>
          </div>
        )}
      </div>
    </Provider>
  );
}

export default App;
