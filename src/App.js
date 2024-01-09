import { useState, useEffect, useContext, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard/Dashboard";
import Preferences from "./components/Preferences/Preferences";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import { AiOutlineLoading } from 'react-icons/ai';
import { getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap, } from "./utils/HandleApi";
import Register from "./components/Register/Register";
import AuthContext from "./context/AuthProvider";
import { UserContext } from "./context/UserContext";
import { WorkflowContext } from './components/Workflow/WorkflowContext';
import MusicInterface from "./components/MusicInterface/MusicInterface";

import { Provider } from 'react-redux';
import store from './components/App/store';

import NewNavbar from "./components/Presentation/NewNavbar";

export let setIsLoading; // Export the function

function App() {
  console.log('~~~~ App');
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
          </div>

        {/* <div className="contentApp">
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
        </div> */}
        <div className="contentApp">
          {auth !== null || localStorage.token ? (
            <>
              <div className="logout"> <Logout /> </div>
              <MusicInterface />
            </>
          ) : ( <MusicInterface /> )}
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
