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


const getMusicMIDI = ( recording = "BGR0082-T1", user = null, transformFunc = null, playMusicFunc = null ) => {
  console.log( "-- handleAPI. getMusicMIDI. recording: ", recording, ", user: ", user, ", transformFunc: ",transformFunc,", playMusicFunc: ",playMusicFunc );

  axios
    .get(`${baseUrl}/getMusicMIDI`, {
      params: {
        recording: recording,
        user: user,
      },
    })
    .then((d) => {
      console.log("#### Then of getMusicMIDI ####");
      console.log(d);
      console.log(d.data);

      if (transformFunc !== null) {
        const dTransformed = transformFunc(d.data);
        console.log("dTransformed: ", dTransformed);
        // play transformed song
        if (playMusicFunc === null) {
          console.log("problem, playMusicFunc is null");
        } else {
          playMusicFunc(dTransformed);
        }
      } else {
        // play song without transformation
        console.log("missing transformation function");
        if (playMusicFunc === null) {
          console.log("also, playMusicFunc is null");
        } else {
          playMusicFunc(d.data); // MIGHT BE BUGGY
        }
      }

      return d;
    })
    .catch((err) => console.log(err));
};


const getSampleMIDI = ( recording = "BGR0082-T1", firstNoteIndex=0, lastNodeIndex= null, user = null, transformFunc = null, playMusicFunc = null ) => {
  console.log( "-- handleAPI. getMusicMIDI. recording: ", recording, ", user: ", user, ", transformFunc: ",transformFunc,", playMusicFunc: ",playMusicFunc );

  axios
    .get(`${baseUrl}/getSampleMIDI`, {
      params: {
        recording: recording,
        firstNoteIndex:firstNoteIndex,
        lastNodeIndex: lastNodeIndex,
        user: user,
      },
    })
    .then((d) => {
      console.log("#### Then of getSampleMIDI ####");
      console.log(d);
      console.log(d.data);

      if (transformFunc !== null) {
        const dTransformed = transformFunc(d.data);
        console.log("dTransformed: ", dTransformed);
        // play transformed song
        if (playMusicFunc === null) {
          console.log("problem, playMusicFunc is null");
        } else {
          playMusicFunc(dTransformed);
        }
      } else {
        // play song without transformation
        console.log("missing transformation function");
        if (playMusicFunc === null) {
          console.log("also, playMusicFunc is null");
        } else {
          playMusicFunc(d.data); // MIGHT BE BUGGY
        }
      }

      return d;
    })
    .catch((err) => console.log(err));
};


const getMatchLevenshteinDistance = ( recording = "BGR0082-T1", firstNoteIndex=0, lastNodeIndex= null, user = null, transformFunc = null, playMusicFunc = null ) => {
  console.log( "-- handleAPI. getMatchLevenshteinDistance. recording: ", recording, ", user: ", user, ", transformFunc: ",transformFunc,", playMusicFunc: ",playMusicFunc );

  axios
    .get(`${baseUrl}/getMatchLevenshteinDistance`, {
      params: {
        recording: recording,
        firstNoteIndex:firstNoteIndex,
        lastNodeIndex: lastNodeIndex,
        user: user,
      },
    })
    .then((d) => {
      console.log("#### Then of getSampleMIDI ####");
      console.log(d);
      console.log(d.data);

      // TODO
      /*
      if (transformFunc !== null) {
        const dTransformed = transformFunc(d.data);
        console.log("dTransformed: ", dTransformed);
        // play transformed song
        if (playMusicFunc === null) {
          console.log("problem, playMusicFunc is null");
        } else {
          playMusicFunc(dTransformed);
        }
      } else {
        // play song without transformation
        console.log("missing transformation function");
        if (playMusicFunc === null) {
          console.log("also, playMusicFunc is null");
        } else {
          playMusicFunc(d.data); // MIGHT BE BUGGY
        }
      }
      */

      return d;
    })
    .catch((err) => console.log(err));
};



export {
    getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap, 
    getMusicMIDI, getSampleMIDI, getMatchLevenshteinDistance
}
