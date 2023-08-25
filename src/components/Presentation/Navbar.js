import { useState, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import Register from "../Register/Register";
import Login from "../Login/Login";

import logo from "../../assets/logo.png";
// type Props = {
//   onLogin: () => void;
//   onInvest: () => void;
//   onAbout: () => void;
//   onPartner: () => void;
//   onFunding: () => void;
//   onLanding: () => void;
// };
function Navbar(props
  // : Props
) {

  const [showDiv, setShowDiv] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);

  return (
    <div
      className=" fixed top-0 z-10 flex w-full items-center justify-between bg-primary  px-2 py-2  text-xs  text-offWhite	 drop-shadow-lg md:px-4 lg:px-global lg:text-lg navbar
"
    >
      <img
        onClick={props.onLanding}
        src={logo}
        alt="Logo"
        className="w-16  cursor-pointer hover:brightness-125   md:w-24	  lg:w-28"
      />
      <div className="flex  justify-center gap-2  lg:gap-5">
        <a
          className=" cursor-pointer hover:text-accentLight"
          onClick={props.onAbout}
        >
          About
        </a>
        <a
          className=" cursor-pointer hover:text-accentLight"
          onClick={props.onFunding}
        >
          Funding
        </a>
        <a
          className=" cursor-pointer hover:text-accentLight"
          onClick={props.onInvest}
        >
          Investigators
        </a>
      </div>
      {/* Hidden as login is set somewhere else... */}
      {/* <a
        onClick={props.onLogin}
        className=" flex cursor-pointer flex-row items-center gap-1 hover:text-accentLight"
      >
        Login
      </a> */}
      {/* <div> Inclusion of login/register elements here... </div> */}
      {(localStorage?.username === undefined) ?
        <div 
            className='buttonShowDiv'
            onClick={() => setShowDiv(!showDiv)}
          >
            {showDiv ? 'Hide Login / Register' : 'Login / Register'}
        </div>
        : <></>
      }
      {(showDiv || localStorage?.username !== undefined) &&
        <div className="wrapper">
          <div
            className={
              auth !== null || localStorage.token ? "offscreen" : "auth"
            }
          >
            <Register />
            <hr />
            <Login />
          </div>
        </div>
      }
    </div>
  );
}

export default Navbar;
