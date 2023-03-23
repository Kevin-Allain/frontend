import React, {useState} from 'react';
import PropTypes from 'prop-types'
import './Login.css';
import { loginUser } from '../../utils/HandleApi';


export default function Login({setToken}) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    
    const handleSubmit = async e => {
        e.preventDefault();

        console.log(`e.target[0]: ${e.target[0]}`);
        console.log(`e.target[0].value: ${e.target[0].value}`);
        console.log(`username: ${username}`)
        console.log(`password: ${password}`)

        const token = await loginUser({
          username,
          password
        });

        console.log(`token: ${token}`);
        setToken(token);
      }      

      return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }
