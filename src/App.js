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

import NewNavbar from "./components/Presentation/NewNavbar";
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

  const invest = useRef(null);
  const about = useRef(null);
  const partners = useRef(null);
  const funding = useRef(null); 
  function scrollTo(ref) {
    ref.current.scrollIntoView({ behavior: "smooth", })
  };

  const [isLoading, setIsLoadingState] = useState(false);
  useEffect(() => {
    setIsLoading = setIsLoadingState; // Assign the function to the exported variable
  }, []);

  const updateMode = (_id, text) => { setIsUpdating(true); setTextInputJazzDAP(text); setJazzDapId(_id); };

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
          <div>
            <NewNavbar
              onLanding={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            {/* <div className=" -mt-[40vh]  h-[550vh]  pt-[40vh] h-auto"
              style={{ background:
                  "linear-gradient(122deg, rgba(2,3,12,1) 5%, rgba(42,45,78,1) 28%, rgba(33,29,56,1) 76%, rgba(80,111,127,1) 100%)", }} >
              <div className="scroll-mt-10" ref={about}> <About /> </div>
              <div className="scroll-mt-10" ref={invest}> <Investigators /> </div>
              <div className="scroll-mt-10" ref={partners}> <Partners /> </div>
              <div className="scroll-mt-10" ref={funding}> <Funding /> </div>
            </div> */}
          </div>

        <div className="contentApp">
          {(auth !== null || localStorage.token ? "logout" : "offscreen") ?
            (
              <>
                <div className={
                  auth !== null || localStorage.token ? "logout" : "offscreen"
                }>
                  <Logout />
                </div>
                <MusicInterface />
              </>
            )
            :
            <MusicInterface />
          } 

        </div>
        {isLoading && (
          <div className="loading-container">
            <div className="loading-icon">
              <h2>Loading... This may take a few moments.</h2>{" "}
              <AiOutlineLoading className="spin" size={window.innerHeight / 10} />
            </div>
          </div>
        )}
      </div>
    </Provider>
  );
}

export default App;
