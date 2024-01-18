import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import {AiOutlineLoading} from 'react-icons/ai'
import PropTypes from 'prop-types'
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import "../../App.css"
// import './Login.css';
// import axios from '../../api/axios'

const baseUrl = "https://jazzdap.city.ac.uk/api/" // can be used for development
// const baseUrl = "http://localhost:5000" // can be used for development
// const baseUrl= "https://jazzdap-backend.onrender.com"
// const baseUrl = axios.baseUrl;
// for city university 
// const baseUrl = "https://jazzdap.city.ac.uk/api/"

const REGISTER_URL = 'loginUser';


export default function Login({ setToken }) {
	const { auth, setAuth } = useContext(AuthContext);

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const errRef = useRef();

    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [showLoadingIcon, setShowLoadingIcon] = useState(false);

    const msgContext = useContext(UserContext);

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    useEffect(() => {
        console.log("useEffect Login. username: ",username,", password: ",password, ", localStorage?.username: ", localStorage?.username);
      }, []);


    const handleSubmit = async e => {
        e.preventDefault();
        console.log("---- handleSubmit. username: ",username,", password: ",password);
        console.log(`baseUrl: ${baseUrl}/${REGISTER_URL}`);
        setShowLoadingIcon(true);
        try {
            const response = await
                axios.post(`${baseUrl}/${REGISTER_URL}`,
                    JSON.stringify({ username, password }),
                    {
                        headers: { 'Content-Type': 'application/json' } //, withCredentials: true// issue with cors with that
                    }
                )
                    .then((d) => {
                        console.log(`successfully logged in. d: `,JSON.stringify(d));
                        setSuccess(true);
                        setUserName('');
                        setPassword('');

                        const accessToken = d.data.accessToken;
                        const roles = d.data.roles;
                        // setAuth({ username, password, roles, accessToken });

                        localStorage.setItem('token',accessToken);
                        localStorage.setItem('username',username);
                        setAuth({ username, roles, accessToken });

                        console.log(`token in then login handleSubmit: ${accessToken}`)
                        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                        setShowLoadingIcon(false);
                    })
                    .catch(err => { console.log(`catch err: ${err}`); setSuccess(false); })
            console.log("response?.data: ",response?.data);

        } catch (err) {
            console.log("err: ", err);
            // TODO code to show warning about username taken already
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
      <div className="login-wrapper">
        {auth ? (
          <h1>You are logged in!</h1>
        ) : (
          <>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {" "}
              {errMsg}{" "}
            </p>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
              <label>
                <p>Username</p>
                <input
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </label>
              <label>
                <p>Password</p>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div>
                <button className="bg-white " type="submit">
                  Submit
                </button>
              </div>
            </form>
            {showLoadingIcon && <AiOutlineLoading className="spin" />}
          </>
        )}
      </div>
    );
}