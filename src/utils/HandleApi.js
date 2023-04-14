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


const getMusicMIDI = ( recording="BGR0082-T1", user=null) => {
    console.log("-- handleAPI. getMusicMIDI. recording: ",recording,", user: ",user);
    
    axios
        .get(`${baseUrl}/getMusicMIDI`, {
            params: {
              recording: "BGR0082-T1"
            }
        })
        .then( (d) => {
            console.log("#### Then of getMusicMIDI ####");
            console.log(d);
            console.log(d.data)
        })
        .catch(err => console.log(err))

}


export {
    getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap, 
    getMusicMIDI 
}
