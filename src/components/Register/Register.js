import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {AiOutlineLoading} from 'react-icons/ai'
import axios from 'axios';
import '../../App.css'

// TODO Seems like we will need to modify this to use the mongoose controller
// import axios from 'axios';
const baseUrl = "http://localhost:5000" // can (and should) used for development
// const baseUrl = "https://fullstack-proto-jazzdap-backend.onrender.com"
// const baseUrl= "https://jazzdap-backend.onrender.com"
// for city university
// const baseUrl = "https://jazzdap.city.ac.uk/api/"


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9-!#$%&'*+-/=?^_`{|}~]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/; // good enough for now
const REGISTER_URL = 'register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [userNameTaken, setUserNameTaken] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [emailTaken, setEmailTaken] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [showLoadingIcon, setShowLoadingIcon] = useState(false);


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setUserNameTaken(false);
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // e.preventDefault();

        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            setShowLoadingIcon(true);
            console.log(`${baseUrl}/${REGISTER_URL}`);
            console.log(JSON.stringify({ user, pwd, email }));
            const response = await
                axios.post(`${baseUrl}/${REGISTER_URL}`,
                    JSON.stringify({ user, pwd, email }),
                    {
                        headers: { 'Content-Type': 'application/json' } //, withCredentials: true// issue with cors with that
                    }
                )
                    .then((d) => {
                        console.log("d.data", JSON.stringify(d.data));
                        console.log(`successfully registered. d: ${d}`);
                        setSuccess(true);
                        //clear state and controlled inputs
                        //need value attrib on inputs for this
                        setUser('');
                        setEmail('');
                        setPwd('');
                        setMatchPwd('');
                        setShowLoadingIcon(false);
                    })
                    .catch(err => {
                        console.log(`catch err: ${err}`);
                        console.log(err);
                        setSuccess(false);
                        if (err.response.data.message === "User already exists") {
                            setUserNameTaken(true);
                        }
                        if (err.response.data.message === "Email already used"){
                            setEmailTaken(true);
                        }
                    })
            // console.log("response: ");
            // console.log(response?.data); // undefined
            // console.log(response?.accessToken); // undefined
            // console.log(JSON.stringify(response)) // undefined
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
        <>
            {success ? (
                <section className="sectionRegisterSuccess">
                    <h1>You've successfully created an account!</h1> <h2>You can now log in to use all our functionalities.</h2>
                    {/* <p> <a href="https://www.thesignmaker.co.nz/wp-content/uploads/2019/04/C16_Work-In-Progress.png">Sign In</a> </p> */}
                </section>
            )
                :
                (
                    <section >
                        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'> {errMsg} </p>
                        <h1>Register</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">
                                Username:
                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                            />
                            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </p>
                            <p id="uiderror" className={user && userNameTaken ? "errorRegister" : "offscreen"}>
                                <FontAwesomeIcon icon={faTriangleExclamation} /> User name already taken.
                            </p>

                            <label htmlFor="email">
                                Email:
                                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                autoComplete="off"
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Make sure you give a valid email.
                            </p>
                            <p id="uiderror" className={email && emailTaken ? "errorRegister" : "offscreen"}>
                                <FontAwesomeIcon icon={faTriangleExclamation} /> Email already used.
                            </p>

                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
                            <label htmlFor="confirm_pwd">
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field.
                            </p>
                            <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                        </form>
                        {showLoadingIcon && <AiOutlineLoading className="spin" />}
                    </section>
                )}
        </>
    )
}

export default Register