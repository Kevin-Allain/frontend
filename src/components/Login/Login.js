import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import PropTypes from 'prop-types'
import axios from 'axios';
// import './Login.css';
// import axios from '../../api/axios'

const baseUrl = "http://localhost:5000" // can be used for development
// const baseUrl = axios.baseUrl;
const REGISTER_URL = 'loginUser';


export default function Login({ setToken }) {
	const { setAuth } = useContext(AuthContext);

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
                        const roles = [];
                        const accessToken = d.data.accessToken;
                        setAuth({ username, password, roles, accessToken });

                        const token = localStorage.getItem('token');
                        console.log(`token in then login handleSubmit: ${token}`)
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        

                    })
                    .catch(err => {
                        console.log(`catch err: ${err}`);
                        setSuccess(false);
                    })
            // console.log("response?.data: ",response?.data); // undefined // const accessToken = response?.data?.accessToken; const roles = response?.data?.roles;

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
