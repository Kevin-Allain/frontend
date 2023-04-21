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

const getMatchLevenshteinDistance = (
  stringNotes = "",
  percMatch = 1,
  user = null,
  transformFunc = null,
  playMusicFunc = null,
  levenshteinDistanceFunc = null
) => {
  console.log("-- handleAPI. getMatchLevenshteinDistance. stringNotes: ", stringNotes,
    ", percMatch: ", percMatch,
    " user: ", user,
    ", transformFunc: ", transformFunc,
    ", playMusicFunc: ", playMusicFunc,
    ", levenshteinDistanceFunc: ", levenshteinDistanceFunc);

  axios
    .get(`${baseUrl}/getMatchLevenshteinDistance`, {
      params: {
        stringNotes:stringNotes,
        percMatch: percMatch,
        user: user,
      },
    })
    .then((d) => {
      console.log("#### Then of getMatchLevenshteinDistance ####");
      console.log("d",d);
      console.log("d.data: ",d.data);

      // In retrospect, we probably don't want to play songs directly... we want to list the matching bits.
      if (levenshteinDistanceFunc == null){
        console.log("We are missing a function to calculate distance!");
      } else {
        // structure data
        const arrayStrNotes = stringNotes.split('-')
        const arrayNotes = arrayStrNotes.map( a => parseInt(a))
        const numNotes = arrayNotes.length;
        console.log("numNotes: ",numNotes);
        const allRecording = [...new Set(d.data.map( a => a.recording ) ) ]
        console.log("allRecording: ",allRecording);

        let notesPerRecording = {};
        for (let i in allRecording){
          notesPerRecording[allRecording[i]] = 
            d.data.filter(a => a.recording === allRecording[i])
        }
        console.log("notesPerRecording :",notesPerRecording);
        // Tricky to split the data into sections... might have to do it from previous step actually!

        // split according to recording
        let dataSplitByRecording = {};
        for (let i in allRecording) {
          let filteredByRecording = d.data.filter(a => a.recording === allRecording[i])
          dataSplitByRecording[allRecording[i]] = {}
          dataSplitByRecording[allRecording[i]].data = filteredByRecording;
        }

        // TODO fix
        for (let i in dataSplitByRecording) {
          // sort notes
          dataSplitByRecording[i].data = dataSplitByRecording[i].data.sort((a, b) => a.recording - b.recording || a.m_id - b.m_id);
          dataSplitByRecording[i].sequences = [];
          // let startSeQuences = dataSplitByRecording[i].data.filter(a => a.startSequence);
          for (let ds in dataSplitByRecording[i].data) {
            if (dataSplitByRecording[i].data[ds].startSequence) {
              console.log("ds: ",ds,", (parseInt(ds) + parseInt(numNotes) + 1: ): ",(parseInt(ds) + parseInt(numNotes) + 1))
              let slice = dataSplitByRecording[i].data.slice(parseInt(ds), (parseInt(ds) + parseInt(numNotes) + 1) );
              dataSplitByRecording[i].sequences.push(
                slice
              )
            }
          }
        }

        console.log("dataSplitByRecording: ", dataSplitByRecording);


        for ( let i in dataSplitByRecording){
          dataSplitByRecording[i].distances = []
          for (let j in dataSplitByRecording[i].sequences){
            let arrNotes = dataSplitByRecording[i].sequences[j].map(a => a.pitch)
            // console.log("arrNotes: ", arrNotes);
            let strArrNotes=arrNotes.toString().replaceAll(',','-');
            let distCalc = levenshteinDistanceFunc(stringNotes, strArrNotes);
            dataSplitByRecording[i].distances.push(distCalc);
          } 
        }

        return dataSplitByRecording;
      }


      return d;
    })
    .catch((err) => console.log(err));
};



export {
    getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap, 
    getMusicMIDI, getSampleMIDI, getMatchLevenshteinDistance
}
