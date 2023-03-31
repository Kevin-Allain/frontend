import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import PropTypes from 'prop-types'
// import './Login.css';
import axios from 'axios';
import { loginUser } from '../../utils/HandleApi';

const baseUrl = "http://localhost:5000" // can be used for development
const REGISTER_URL = 'loginUser';




export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const errRef = useRef();

    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        setErrMsg('');
    }, [username, password])


    const handleSubmit = async e => {
        e.preventDefault();

        console.log(`e.target[0]: ${e.target[0]}`);
        console.log(`e.target[0].value: ${e.target[0].value}`);
        console.log(`username: ${username}`)
        console.log(`password: ${password}`)

        // TODO change according to https://github.com/marvelken/login-and-registration/blob/master/src/Login.js
        try {
            console.log(`${baseUrl}/${REGISTER_URL}`);
            console.log(JSON.stringify({ username, password }));
            const response = await
                axios.post(`${baseUrl}/${REGISTER_URL}`,
                    JSON.stringify({ username, password }),
                    {
                        headers: { 'Content-Type': 'application/json' } //, withCredentials: true// issue with cors with that
                    }
                )
                    .then((d) => {
                        console.log("d.data", JSON.stringify(d.data));
                        console.log(`successfully logged in. d: ${d}`);
                        setSuccess(true);
                        //clear state and controlled inputs
                        //need value attrib on inputs for this
                        setUserName('');
                        setPassword('');
                    })
                    .catch(err => {
                        console.log(`catch err: ${err}`);
                        console.log(err);
                        setSuccess(false);
                    })
            console.log("response: ");
            console.log(response?.data); // undefined
            console.log(response?.accessToken); // undefined
            console.log(JSON.stringify(response)) // undefined
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
            {success ? (
                <h1>You are logged in!</h1>
            ) : (
                <>
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'> {errMsg} </p>
                    <h1>Log In</h1>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <p>Username</p>
                            <input type="text" onChange={e => setUserName(e.target.value)} />
                        </label>
                        <label>
                            <p>Password</p>
                            <input type="password" onChange={e => setPassword(e.target.value)} />
                        </label>
                        <div>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}
