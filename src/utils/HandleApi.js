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

const addJazzDap = (text,setText, setJazzDap, user=null) => {

    console.log(`HandeAPI addJazzDap: \n${baseUrl}/save`, {text})

    axios
        .post(`${baseUrl}/save`, {text,user})
        .then( (data) => {
            console.log(data);
            setText("");
            getAllJazzDap(setJazzDap);
        })
        .catch(err => console.log(err))
}

const updateJazzDap = (jazzDapId,text,setJazzDap, setText, setIsUpdating, userId=null) => {
    axios
        .post(`${baseUrl}/update`, {_id: jazzDapId, text, userId})
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


// ---- Not called here
// async function loginUser(credentials) {
//     console.log(`HandeAPI loginUSer, credentials: ${ JSON.stringify(credentials)}`);
//     return fetch( `${baseUrl}/loginUser` , {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(credentials)
//     })
//       .then(data => data.json())
//    }
   




export {getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap }
    // loginUser}