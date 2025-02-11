import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import {AiOutlineUser} from 'react-icons/ai';
import {ImExit} from 'react-icons/im'
import {getUserAnnotations } from '../../utils/HandleApi'
import UserSystem from '../UserSystem/UserSystem'

const LOGOUT_URL = 'logoutUser';

export default function Logout() {
	const { auth, setAuth } = useContext(AuthContext);

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const errRef = useRef();

    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const msgContext = useContext(UserContext);

    // user info
    const [listAnnotations,setListAnnotations] = useState([]);
    const [localUsername, setLocalUsername] = useState(localStorage?.username || '');
    const [isUserInfoVisible, setIsUserInfoVisible] = useState(false);

    const handleToggleUserInfo = () => {
        setIsUserInfoVisible(prevState => !prevState);
      };
    

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    // || Thinking about when and how I would make a call to see previous annotations made by user
    useEffect(() => {
        console.log("useEffect Logout for localStorage?.username : ", localStorage?.username)
        if (localStorage?.username) {
            setListAnnotations((prevArray) => [...prevArray, '' + new Date()])
            getUserAnnotations(setListAnnotations, localStorage.username);
        }
    }, [localStorage?.username]);

    const handleSubmitLogout = async e => {
        console.log("handleSubmitLogout")
        e.preventDefault();
        try {

            const token = auth ? auth.accessToken : localStorage.token;
            console.log("token: ",token,", auth", JSON.stringify(auth),", localStorage.token: ",localStorage.token);
            setSuccess(false);
            setUserName('');
            setPassword('');
            // annotations load tryout
            setListAnnotations([]);

            localStorage.clear();
            setAuth(null);
            axios.defaults.headers.common['Authorization'] = null;
            window.location.reload();
        } catch (err) {
            console.log("err: ", err);
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
        <div className="logout-wrapper">
            Hello{" "}{ localStorage.username ? localStorage.username : ''}. {" "}
            <button onClick={handleSubmitLogout} className='m-[0.25rem]' >
            Logout <ImExit/>
            </button>
            <hr/>
            <UserSystem/>
        </div>
    )
}
