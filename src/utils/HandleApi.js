import axios from 'axios'

const baseUrl = "http://localhost:5000" // can be used for development
// const baseUrl = "https://fullstack-proto-jazzdap-backend.onrender.com"

const getAllJazzDap = (setJazzDap) => {
    axios
        .get(baseUrl)
        .then(({ data }) => {
            console.log('data: ', data);
            setJazzDap(data);
        })
        .catch(err => console.log(err))
}

const addJazzDap = (text,setText, setJazzDap) => {
    axios
        .post(`${baseUrl}/save`, {text})
        .then( (data) => {
            console.log(data);
            setText("");
            getAllJazzDap(setJazzDap);
        })
        .catch(err => console.log(err))
}

const updateJazzDap = (jazzDapId,text,setJazzDap, setText, setIsUpdating) => {
    axios
        .post(`${baseUrl}/update`, {_id: jazzDapId, text})
        .then( (data) => {
            console.log(data);
            setText("");
            setIsUpdating(false); 
            getAllJazzDap(setJazzDap);
        })
        .catch(err => console.log(err))
}

const deleteJazzDap = (jazzDapId, setJazzDap) => {
    axios
        .post(`${baseUrl}/delete`, {_id: jazzDapId})
        .then( (data) => {
            console.log(data);
            getAllJazzDap(setJazzDap);
        })
        .catch(err => console.log(err))
}


// ---- axios attempt. not working as we expected. First let's try without axios
// ---- TODO change to axios approach
const loginUser = (credentials) => {
    axios
        .post(`${baseUrl}/loginUser`, {credentials})
        .then( (data) => {
            console.log("loginUser");
            console.log(data);
            data.json();
        })
        .catch(err => console.log(err))
}

// async function loginUser(credentials) {
//     console.log(`HandeAPI loginUSer`);
//     return fetch( `${baseUrl}/loginUser` , {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(credentials)
//     })
//       .then(data => data.json())
//    }
   


export {getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap, loginUser}