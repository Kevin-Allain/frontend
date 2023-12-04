import axios from 'axios'
import { setIsLoading } from '../App';

/**
 * The file is structured by using comments to navigate between groups of functions.
 * Functions name match those done in Controllers.
 */

const baseUrl = "http://localhost:5000" // can be used for development
// const baseUrl = "https://fullstack-proto-jazzdap-backend.onrender.com"
// const baseUrl= "https://jazzdap-backend.onrender.com"


const getAllJazzDap = (setJazzDap) => {
  console.log("---- HandleApi / getAllJazzDap", new Date());
  setIsLoading(true);

  axios
    .get(baseUrl)
    .then(({ data }) => {
      console.log('data: ', data);
      setJazzDap(data);
      setIsLoading(false);
    })
    .catch(err => console.log(err))
}

const addJazzDap = (text, setText, setJazzDap, user = null) => {
  console.log(`HandeAPI addJazzDap: \n${baseUrl}/save`, { text });
  // setIsLoading(true);

  axios
    .post(`${baseUrl}/saveJazzDap`, { text, user })
    .then((data) => {
      console.log(data);
      setText("");
      getAllJazzDap(setJazzDap);

      // setIsLoading(false);      
    })
    .catch(err => console.log(err))
}

const updateJazzDap = (jazzDapId, text, setJazzDap, setText, setIsUpdating, userId = null) => {
  console.log("HandleApi updateJazzDap: ", jazzDapId, text);
  // setIsLoading(true);

  axios
    .post(`${baseUrl}/updateJazzDap`, { _id: jazzDapId, text, userId })
    .then((data) => {
      console.log(data);
      setText("");
      setIsUpdating(false);
      getAllJazzDap(setJazzDap);
      // setIsLoading(false);

    })
    .catch(err => console.log(err))
}

const deleteJazzDap = (jazzDapId, setJazzDap) => {
  console.log("HandeAPI deleteJazzDap. annotationId: ", jazzDapId, ", setJazzDap: ", setJazzDap)

  axios
    .post(`${baseUrl}/deleteJazzDap`, { _id: jazzDapId })
    .then((data) => {
      console.log(data);
      getAllJazzDap(setJazzDap);
    })
    .catch(err => console.log(err))
}


const getMusicMIDI = (track = "BGR0082-T1", user = null, transformFunc = null, playMusicFunc = null) => {
  console.log("-- handleAPI. getMusicMIDI. track: ", track, ", user: ", user, ", transformFunc: ", transformFunc, ", playMusicFunc: ", playMusicFunc);
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getMusicMIDI`, {
      params: {
        track: track,
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

      // setIsLoading(false);
      return d;
    })
    .catch((err) => console.log(err));
};


const getSampleMIDI = (track = "BGR0082-T1", firstNoteIndex = 0, lastNodeIndex = null, user = null, transformFunc = null, playMusicFunc = null) => {
  console.log("-- handleAPI. getMusicMIDI. track: ", track, ", user: ", user, ", transformFunc: ", transformFunc, ", playMusicFunc: ", playMusicFunc);
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getSampleMIDI`, {
      params: {
        track: track,
        firstNoteIndex: firstNoteIndex,
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

      // setIsLoading(false);
      return d;
    })
    .catch((err) => console.log(err));
};

const getTracksMetadata = (lognumbers, infoMusicList, setInfoMusicList) => {
  console.log("---- HandleApi / getTracksMetadata. lognumbers: ", lognumbers, ", infoMusicList: ", infoMusicList, ", setInfoMusicList: ", setInfoMusicList);
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getTracksMetadata`, {
      params: {
        // lognumbers: lognumbers.map(prefix => `${prefix}*`), /** Probably the wrong place to make the regexp query... */
        lognumbers:lognumbers,
      }
    })
    .then((d) => {
      console.log("#### Then of getTracksMetadata #### d: ", d);
      setInfoMusicList(d.data);
    })
}


const getTrackMetaFromNoteId = (idTrack) => {
  console.log("---- HandleApi / idtrack: ", idTrack);
  axios
    .get(`${baseUrl}/getTrackMetaFromNoteId`, {
      params: { idTrack: idTrack, }
    })
    .then((d) => {
      console.log("#### Then of getTrackMetaFromNoteId #### d: ", d);
    })
}

/** TODO would make more sense if we loaded all the albums already returned. */
const getTrackMetadata = (lognumber, infoMusicList, setInfoMusicList) => {
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getTrackMetadata`, {
      params: {
        lognumber: lognumber,
      }
    })
    .then((d) => {
      console.log("#### Then of getTrackMetadata ####");
      console.log("d: ", d, ", d.data[0].lognumber: ", d.data[0].lognumber);
      // Need to change to push into the array... if that's not something already queried for...? 
      // It might be arguable that one metadata search is enough
      // first, let's just add object if lognumber not already in the list
      console.log("! infoMusicList.some(a => a.lognumber === d.data[0].lognumber ): ", !infoMusicList.some(a => a.lognumber === d.data[0].lognumber))
      if (!infoMusicList.some(a => a.lognumber === d.data[0].lognumber)) {
        setInfoMusicList([...infoMusicList,
        {
          lognumber: d.data[0].lognumber,
          contents: d.data[0].Contents,
          tape_stock: d.data[0]["Tape stock"],
          recording_location: d.data[0]["Recording location"], // don't remember about this attribute
          idDatabase: d.data[0]["_id"] // new addition. Get the _id stored in the database
        }
        ])
      }
      // setIsLoading(false);
    })
}

const getMetadataFromAttribute = (attributeName, attributeValue) => {
  axios
    .get(`${baseUrl}/getMetadataFromAttribute`, {
      params: {
        attributeName: attributeName,
        attributeValue: attributeValue
      }
    })
    .then((d) => {
      console.log("#### Then of getMetadataFromAttribute ####");
      console.log("d: ", d, ", d.data[0]: ", d.data[0]);
      // And then stuff...
    })
}

const getFuzzyLevenshtein = ( stringNotes = "", percMatch = 0.5, user = null, setListSearchRes = null, setListLogNumbers = null, setListTracks = null, infoMusicList=null,  setInfoMusicList=null, textFilterArtist = '', textFilterTrack = '' , textFilterRecording = '' ) => {
  console.log("-- handleAPI / getFuzzyLevenshtein. stringNotes: ", stringNotes, ", percMatch: ", percMatch, " user: ", user);
  console.log("~~~~ baseUrl: ",baseUrl," ~~~~");
  console.log({textFilterArtist, textFilterTrack, textFilterRecording});
  setIsLoading(true);
  stringNotes += '';
  let numNotesInput = stringNotes.split('-').map(a=>Number(a));

  axios
    .get(`${baseUrl}/getFuzzyLevenshtein`, {
      params:
        { stringNotes: stringNotes, percMatch: percMatch, user: user, textFilterArtist: textFilterArtist, textFilterTrack: textFilterTrack, textFilterRecording: textFilterRecording},
    })
    .then((d) => {
      console.log("#### Then of getFuzzyLevenshtein ####"); console.log("d: ", d); console.log("TIME AFTER QUERY: ", new Date());
      // So now... what to do. Make something similar to the previous function? Fastest coding approach I suppose.
      // But... do we return all the info? We should try to have it organized in the same way.
      const resData = d.data;
      const allTrack = [...new Set(d.data.map(a => a.track))];
      const allLogNumber = [...new Set(d.data.map(a => a.lognumber))];
      console.log("~~#~~ allTrack: ", allTrack, ", allLogNumber: ", allLogNumber);

      let sortedTracks = allTrack.sort();

      // Tricky to split the data into sections... might have to do it from previous step actually!
      // split according to track
      let dataSplitByTrack = {};
      for (let i in allTrack) {
        let filteredByTrack = d.data.filter(a => a.track === allTrack[i])
        dataSplitByTrack[allTrack[i]] = {}
        dataSplitByTrack[allTrack[i]].data = filteredByTrack;
      }
      console.log("dataSplitByTrack: ", dataSplitByTrack);

      for (let i in dataSplitByTrack) {
        // sort notes
        dataSplitByTrack[i].data =
          dataSplitByTrack[i].data.sort((a, b) => a.track - b.track || a.m_id - b.m_id);
        dataSplitByTrack[i].sequences = [];
        // let startSeQuences = dataSplitByTrack[i].data.filter(a => a.startSequence);
        for (let ds in dataSplitByTrack[i].data) {
          if (dataSplitByTrack[i].data[ds].startSequence) {
            let slice = dataSplitByTrack[i].data.slice(
              parseInt(ds), (parseInt(ds) + parseInt(numNotesInput))
            );
            dataSplitByTrack[i].sequences.push(slice);
          }
        }
      }

      let otherLogsNumbers = [];
      let otherTracks = [];
      for (let [key,] of Object.entries(dataSplitByTrack)) {
        otherLogsNumbers.push(dataSplitByTrack[key].data[0].lognumber);
        otherTracks.push(dataSplitByTrack[key].data[0].track);
      }
      otherLogsNumbers = [...new Set(otherLogsNumbers)]
      console.log("lognumbers present in res: ", otherLogsNumbers);
      console.log("tracks present in res: ", otherTracks);
      const sortedLogNumbers = allLogNumber.sort();
      console.log("sortedLogNumbers: ", sortedLogNumbers);
      // -- Worked in terminal
      let altDataStruct = [];
      for ( var i in resData ) {
        altDataStruct.push({
            distCalc: resData[i].levenshteinDistance,
            lognumber: resData[i].lognumber,
            track: resData[i].track,
            arrIdNotes: resData[i]._ids,
            arrNotes: resData[i].notes,
            arrDurations: resData[i].durations,
            arrTime: resData[i].onsets
        })
      }
      console.log("altDataStruct: ",altDataStruct);
      // --
      console.log("sortedTracks: ", sortedTracks);      
      let notesAggregByTrack = altDataStruct;
      setListLogNumbers(sortedLogNumbers);
      setListTracks(sortedTracks);
      setListSearchRes(notesAggregByTrack);
      // Calls for loading of metadata
      getTracksMetadata(
        sortedLogNumbers,
        infoMusicList,
        setInfoMusicList
      );
      setIsLoading(false);
      return d;
    })
    .catch((err) => {
      alert("An error occured. Reload the page. Please contact us if the error occurs often.")
      console.log(err);
    });
}

const getMatchLevenshteinDistance = (
  stringNotes = "",
  percMatch = 1,
  user = null,
  levenshteinDistanceFunc = null,
  setListSearchRes = null,
  setListLogNumbers = null,
  setListTracks = null,
  // Additions for loading of metadata after the loading of tracks
  infoMusicList=null, 
  setInfoMusicList=null
) => {
  console.log("-- handleAPI / getMatchLevenshteinDistance. stringNotes: ", stringNotes, ", percMatch: ", percMatch, " user: ", user);
  console.log("~~~~ baseUrl: ",baseUrl," ~~~~")
  setIsLoading(true);
  stringNotes += '';

  axios
    .get(`${baseUrl}/getMatchLevenshteinDistance2`, { params: { stringNotes: stringNotes, percMatch: percMatch, user: user, }, })
    .then((d) => {
      console.log("#### Then of getMatchLevenshteinDistance ####");
      console.log("d.data: ", d.data);
      console.log("TIME AFTER QUERY: ", new Date());
      /** TODO * This is a lot of code and most likely should be passed as a function */
      /** TODO 2 * What to do when the data returned is the result from a query without matches? */

      // In retrospect, we probably don't want to play songs directly... we want to list the matching bits.
      if (levenshteinDistanceFunc == null) {
        console.log("We are missing a function to calculate distance!");
      } else {
        // structure data
        const arrayStrNotes = stringNotes.split('-');
        const arrayNotesInput = arrayStrNotes.map(a => parseInt(a));
        const numNotesInput = arrayNotesInput.length;

        const allTrack = [...new Set(d.data.map(a => a.track))];
        const allLogNumber = [...new Set(d.data.map(a => a.lognumber))];
        console.log("~~#~~ numNotesInput: ", numNotesInput, ", allTrack: ", allTrack,", allLogNumber: ",allLogNumber);
        console.log("TIME AFTER METADATA QUERY: ", new Date());

        let notesPerTrack = {};
        for (let i in allTrack) {
          notesPerTrack[allTrack[i]] =
            d.data.filter(a => a.track === allTrack[i])
        }
        console.log("notesPerTrack :", notesPerTrack);
        // Tricky to split the data into sections... might have to do it from previous step actually!
        // split according to track
        let dataSplitByTrack = {};
        for (let i in allTrack) {
          let filteredByTrack = d.data.filter(a => a.track === allTrack[i])
          dataSplitByTrack[allTrack[i]] = {}
          dataSplitByTrack[allTrack[i]].data = filteredByTrack;
        }
        console.log("dataSplitByTrack: ", dataSplitByTrack);

        for (let i in dataSplitByTrack) {
          // sort notes
          dataSplitByTrack[i].data =
            dataSplitByTrack[i].data.sort((a, b) => a.track - b.track || a.m_id - b.m_id);
          dataSplitByTrack[i].sequences = [];
          // let startSeQuences = dataSplitByTrack[i].data.filter(a => a.startSequence);
          for (let ds in dataSplitByTrack[i].data) {
            if (dataSplitByTrack[i].data[ds].startSequence) {
              let slice =
                dataSplitByTrack[i].data.slice(
                  parseInt(ds), (parseInt(ds) + parseInt(numNotesInput))
                );
              dataSplitByTrack[i].sequences.push(slice);
            }
          }
        }

        let notesAggregByTrack = [];
        for (let i in dataSplitByTrack) {
          dataSplitByTrack[i].distances = []
          dataSplitByTrack[i].slicesDist = [];
          for (let j in dataSplitByTrack[i].sequences) {
            let curArrNotes = dataSplitByTrack[i].sequences[j].map(a => a.pitch)
            let curArrTime = dataSplitByTrack[i].sequences[j].map(a => a.onset)
            let curArrDurations = dataSplitByTrack[i].sequences[j].map(a => a.duration)
            let currArrIdNotes = dataSplitByTrack[i].sequences[j].map(a => a._id)
            let curLogNumber = dataSplitByTrack[i].data[0].lognumber;

            let distCalc = levenshteinDistanceFunc(arrayNotesInput, curArrNotes);
            dataSplitByTrack[i].distances.push(distCalc);
            dataSplitByTrack[i].slicesDist.push({
              arrNotes: curArrNotes,
              arrIdNotes: currArrIdNotes,
              arrTime: curArrTime.map((num) => Number(num.toFixed(2))),
              arrDurations: curArrDurations.map((num) => Number(num.toFixed(2))),
              distCalc: distCalc,
              track: i,
              lognumber: curLogNumber
            });
          }
          notesAggregByTrack = notesAggregByTrack.concat(dataSplitByTrack[i].slicesDist);
        }
        notesAggregByTrack.sort((a, b) => a.distCalc - b.distCalc);

        // Will be better to later allow filter
        console.log("// dataSplitByTrack: ", dataSplitByTrack,
          ", notesAggregByTrack: ", notesAggregByTrack
        );
        let otherLogsNumbers = [];
        let otherTracks = [];
        for (let [key, ] of Object.entries(dataSplitByTrack)) {
            otherLogsNumbers.push(dataSplitByTrack[key].data[0].lognumber);
            otherTracks.push(dataSplitByTrack[key].data[0].track);
        }
        otherLogsNumbers = [...new Set(otherLogsNumbers)]
        console.log("lognumbers present in res: ",otherLogsNumbers);
        console.log("tracks present in res: ",otherTracks);
        const sortedLogNumbers = allLogNumber.sort();
        console.log("sortedLogNumbers: ",sortedLogNumbers);
        
        // This is a bit we can try to keep
        const sortedTracks = [...new Set(notesAggregByTrack.map(obj => obj.track))].sort();
        console.log("sortedTracks: ",sortedTracks);
        setListLogNumbers(sortedLogNumbers);
        setListTracks(sortedTracks);
        setListSearchRes(notesAggregByTrack);
        // Calls for loading of metadata
        getTracksMetadata(
          sortedLogNumbers,
          infoMusicList,
          setInfoMusicList
        );
      }

      setIsLoading(false);
      return d;
    })
    .catch((err) => {
      alert("An error occured. Reload the page. Please contact us if the error occurs often.")
      console.log(err);
    });
};

/** Annotations */

// indexAnnotation added because we can have one sequence occur several times in a track
const addAnnotation = (
  type,
  info,
  indexAnnotation = 0,
  annotationInput,
  setAnnotationInput,
  setListAnnotations,
  idCaller = null,
  author = null,
  privacy = 'public'
) => {
  console.log(`HandeAPI addAnnotation: \n${baseUrl}/addAnnotation`, { type, info, annotationInput, author, indexAnnotation, privacy, idCaller });
  // setIsLoading(true);

  let time = new Date();

  if (type === "recording" || type === "track") {
    console.log("type requires a call to get the right idCalled. idCaller: ",idCaller);
    // the idCaller is the note _id. Can we assume that it is always right, or do we need to pass parameters?
    const idTrack = idCaller;
    console.log("idTrack: ",idTrack);
    axios
      .get(`${baseUrl}/getTrackMetaFromNoteId`,{ params: { idTrack } })
      .then(d => {
        console.log("Loaded data with getTrackMetaFromNoteId. d: ", d);
        if (d.data.length>0){ idCaller = d.data[0]._id; } else {idCaller=null;} 
        console.log("updated idCaller: ",idCaller);

        axios
          .post(`${baseUrl}/addAnnotation`, { type, info, indexAnnotation, annotationInput, author, privacy, time, idCaller })
          .then((data) => {
            console.log(data);
            setAnnotationInput("");
            getAnnotations(
              type, 
              info, 
              setListAnnotations, 
              indexAnnotation, 
              idCaller, // doubt about this... 
              localStorage.username ? localStorage.username : null,
              true
              )
            // setIsLoading(false);        
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  } else {
    axios
      .post(`${baseUrl}/addAnnotation`, { 
        type, info, indexAnnotation, annotationInput, author, privacy, time, idCaller, 
      })
      .then((data) => {
        console.log(data);
        setAnnotationInput("");
        getAnnotations(
          type, info, setListAnnotations, indexAnnotation, null,localStorage.username ? localStorage.username : null
        );
      })
      .catch((err) => console.log(err));
  }
}


const updateAnnotation = (
  annotationId,
  annotationInput,
  setAnnotationInput,
  indexAnnotation = 0,
  type,
  info,
  setListAnnotations,
  setIsUpdating,
  userId = null) => {
  console.log("HandleApi updateAnnotation: ", annotationId, annotationInput, indexAnnotation);
  // setIsLoading(true);

  axios
    .post(`${baseUrl}/updateAnnotation`, { _id: annotationId, annotationInput, userId })
    .then((data) => {
      console.log("data: ", data);
      console.log("data[0]: ", data[0]);
      setAnnotationInput("");
      setIsUpdating(false);
      // getAllJazzDap(setJazzDap);
      getAnnotations(
        type,
        info,
        setListAnnotations,
        indexAnnotation,
        localStorage.username ? localStorage.username : null);
      // setIsLoading(false);
    })
    .catch(err => console.log(err))
}

const getAnnotations = (
  type, info, setListAnnotations, indexAnnotation = 0, idCaller=null, user = null, directMetaIdCaller=false
) => {
  console.log("HandeAPI getAnnotations type: ", type, ", info: ", info, ", indexAnnotation: ", indexAnnotation,", idCaller: ",idCaller,", user: ", user,", directMetaIdCaller: ",directMetaIdCaller);
  // setIsLoading(true);
  console.log("idCaller: ",idCaller);
  // doubt: do we ever need to make a specific type for a note... I guess not
  if (type === 'recording' || type ==='track'){
    let idMetaObj = null;
    if (directMetaIdCaller) {
      console.log("Passed a metadata first.");
      idMetaObj = idCaller;
      axios
      .get(`${baseUrl}/getAnnotations`, {
        params: {
          type: type, info: info, indexAnnotation: indexAnnotation, idCaller: idMetaObj, user: user,
        },
      })
      .then(({ data }) => {
        console.log("data: ", data);
        setListAnnotations(data);
      })
      .catch((err) => console.log(err));
    } else { 
      axios
      .get(`${baseUrl}/getTrackMetaFromNoteId`, { params: { idTrack: idCaller } })
      .then((d) => {
        console.log("Loaded data with getTrackMetaFromNoteId. d: ", d);
        if (d.data.length > 0) { idMetaObj = d.data[0]._id; } 
        console.log("idMetaObj: ", idMetaObj);
  
        axios
          .get(`${baseUrl}/getAnnotations`, {
            params: {
              type: type, info: info, indexAnnotation: indexAnnotation, idCaller: idMetaObj, user: user,
            },
          })
          .then(({ data }) => {
            console.log("data: ", data);
            setListAnnotations(data);
          })
          .catch((err) => console.log(err));
      });      
    }
  } else {
    axios
    .get(`${baseUrl}/getAnnotations`, {
      params: {
        type: type, info: info, indexAnnotation: indexAnnotation, idCaller: idCaller, user: user,
      },
    })
    .then(({ data }) => {
      console.log("data: ", data);
      setListAnnotations(data);
    })
    .catch((err) => console.log(err));
  }
}

const deleteAnnotation = (annotationId, type, info, setListAnnotations, indexAnnotation = 0) => {
  console.log("HandeAPI deleteAnnotation. annotationId: ", annotationId, ", setListAnnotations: ", setListAnnotations)

  axios
    .post(`${baseUrl}/deleteAnnotation`, { _id: annotationId })
    .then((data) => {
      console.log(data);
      getAnnotations(
        type,
        info,
        setListAnnotations,
        indexAnnotation,
        localStorage.username ? localStorage.username : null);
    })
    .catch(err => console.log(err))
}


/** Comments */

// indexAnnotation added because we can have one sequence occur several times in a track
const addComment = (
  type,
  info,
  indexAnnotation = 0,
  commentInput,
  setCommentInput,
  setListComments,
  author = null,
  annotationId = null
) => {
  console.log(`HandeAPI addComment: \n${baseUrl}/addComment`,
    {
      type,
      info,
      commentInput,
      author,
      indexAnnotation,
      annotationId
    });

  let time = new Date();

  axios
    .post(`${baseUrl}/addComment`, {
      type,
      info,
      indexAnnotation,
      commentInput,
      author,
      time,
      annotationId
    })
    .then((data) => {
      console.log(data);
      setCommentInput("");
      // getComments( setListComments, author, annotationId  )
      getCommentsOfAnnotation(setListComments,author,annotationId);
    })
    .catch(err => console.log(err))
}

const updateComment = (
  commentId,
  commentInput,
  setCommentInput,
  setListComments,
  setIsUpdating,
  userId = null,
  annotationId = null
) => {
  console.log("HandleApi updateComment: ", commentId, commentInput, userId, annotationId);
  // setIsLoading(true);

  axios
    .post(`${baseUrl}/updateComment`, { _id: commentId, commentInput, userId, annotationId })
    .then((data) => {
      console.log("data: ", data);
      console.log("data[0]: ", data[0]);
      setCommentInput("");
      setIsUpdating(false);
      // getAllJazzDap(setJazzDap);
      // getComments(type, info, setListComments, indexAnnotation);
      // getComments( setListComments, userId, annotationId )
      getCommentsOfAnnotation(setListComments,userId,annotationId);
      // setIsLoading(false);
    })
    .catch(err => console.log(err))
}

const getComments = (
  // type,
  // info,
  setListComments,
  // indexAnnotation = 0,
  user = null,
  annotationId = null
) => {
  console.log("HandeAPI getComments, annotationId: ", annotationId, ", user: ", user);
  // "type: ", type, ", info: ", info, ", indexAnnotation: ", indexAnnotation, 
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getComments`, {
      params:
      {
        // type: type,
        // info: info,
        // indexAnnotation: indexAnnotation,
        annotationId: annotationId
      }
    })
    .then(({ data }) => {
      console.log('data: ', data);
      setListComments(data);
    })
    .catch(err => console.log(err))
}

const getCommentsOfAnnotation = ( setListComments, user = null, annotationId=null) => {
  console.log("HandeAPI getCommentsOfAnnotation, annotationId: ", annotationId, ", user: ", user);

  axios
    .get(`${baseUrl}/getCommentsOfAnnotation`,{
      params: { annotationId: annotationId }
    })
    .then(({ data }) => {
      console.log('data: ', data);
      setListComments(data);
    })
    .catch(err => console.log(err))
}


const deleteComment = (
  commentId,
  setListComments,
  user = null,
  annotationId = null
) => {
  console.log("HandeAPI deleteComment. commentId: ", commentId, ", setListComments: ", setListComments, ", user: ", user, ", annotationId: ", annotationId);

  axios
    .post(`${baseUrl}/deleteComment`, { _id: commentId })
    .then((data) => {
      console.log(data);
      // getComments( setListComments, user, annotationId );
      getCommentsOfAnnotation(setListComments,user,annotationId)
    })
    .catch(err => console.log(err))
}

/** User info */
const getUserAnnotations = (setListAnnotations, user) => {
  console.log("handleApi getUserAnnotations. user: ", user);

  axios
    .get(`${baseUrl}/getUserAnnotations`, {
      params:
      {
        user: user
      }
    })
    .then(({ data }) => {
      console.log('data: ', data);
      setListAnnotations(data);
    })
    .catch(err => console.log(err))
}

/** Workflows */

const getWorkflowsInfo = (dispatch, setWorkflows, { title = null, time = null, user = null } = {}) => {
  console.log("handleApi getWorkflowsInfo.", { title, time, user });
  axios
    .get(`${baseUrl}/getWorkflowsInfo`, {
      params:
      {
        title: title,
        time: time,
        user: user
      }
    })
    .then(({ data }) => {
      console.log('getWorkflowsInfo data: ', data);
      dispatch(setWorkflows(data))
    })
    .catch(err => console.log(err))
}

// In the case where we create one workflow with one object, there can be one note passed with it
const createWorkflow = (
  title, description, time, author,
  objectsId = [], // the id of the object being listed on MongoDB
  objectsTimes = [], // time of writing
  objectsNote = [], // note at creation
  objectsType = [], // type of object set for EmbeddedWorkflowInteraction call 
  setTitleInput, setDescriptionInput,
  dispatch,
  setWorkflows,
  objectIndexRange = [], // For samples we need to know how far the search goes beyond the first note identified
  privacy='public',
  setShowLoadingIcon,
  // TODO could we pass metadata?
  listLogNumbers = [], infoMusicList=[], listTracks=[]
) => {
  // TODO adapt objectsId if we are creating something that is not relateds to an existing object in database, like a search
  console.log("handleApi createWorkflow. ", {title, description, time, author, objectsId, objectsTimes, objectsNote, objectsType,privacy, listLogNumbers,infoMusicList, listTracks});

  const objects = [];
  for (var i = 0; i < objectsId.length; i++) {
    console.log("i: ", i, ", (typeof i): ", (typeof i), ", (typeof objectsTimes[i]): ", objectsTimes[i]);
    objects.push({
      objectId: objectsId[i],
      objectTime: objectsTimes[i],
      objectIndex: i,
      objectNote: objectsNote[i],
      objectType: objectsType[i],
      objectIndexRange: objectIndexRange[i],
    })
  }


  // New idea: we first load the metadata, after which we set the creation of the workflow
  // Metadata attributes passed can be empty if the workflow is created out of the blue.
  // Kind of dirty... but at least we trust the call to follow an order with the .then section
  if (objectsId.length > 0) {
    if (
      objectsType[0] === 'sample' || 
      objectsType[0] === 'track' || 
      objectsType[0] === 'recording') {
      // first call to get the track id and get the lognumber I get...
      axios.get(`${baseUrl}/get_idContent_sample`, { params: { _id: objectsId[0] } })
      .then( (res) => {
        console.log("ran get_idContent_sample. res: ",res);
        let trackObj = res.data[0];
        let lognumbers = [trackObj.lognumber];
        console.log("trackObj info. lognumber",trackObj.lognumber,", SJA_ID",trackObj['SJA_ID']);

        axios
          .get(`${baseUrl}/getTracksMetadata`, {
            params: { lognumbers: lognumbers, }
          })
          .then((d) => {
            console.log("#### Loaded Metadata for workflow. d: ", d);
            // TODO update so that createWorkflow uses loaded metadata

            // should it be an array or object...? E.g. hashmap...
            let arrMetadataToWorkflow = [];
            trackObj['SJA_ID']
              ? arrMetadataToWorkflow.push(d.data.filter(a => a['SJA_ID'] === trackObj['SJA_ID'])[0])
              : arrMetadataToWorkflow.push(d.data[0]); // I think this is the right approach for BGR
            console.log('arrMetadataToWorkflow: ',arrMetadataToWorkflow);

            axios
              .post(`${baseUrl}/createWorkflow`, {
                title, description, time, author,
                objects,
                privacy,
                arrMetadataToWorkflow
              })
              .then((data) => {
                console.log("Then handleApi createWorkflow");
                setTitleInput("");
                setDescriptionInput("");
                setShowLoadingIcon(false);
                getWorkflowsInfo(
                  dispatch, setWorkflows, { user: author }
                )
              })
              .catch(err => console.log(err))
        })        
      })
    } else {
      console.log("objectType is not a sample. It is a ", objectsType[0]);
      if (objectsType[0] === 'search') {
        // If it's recording or track... it should be exactly the same, right?!
        let fullStr = objectsId[0];
        let  indxArtistF=1, indxRecordingF=2, indxTrackF = 3, indxPercF = 4;
        let strNotes = fullStr.split('_')[0];
        let artistF = fullStr.split('_')[indxArtistF].split('(')[1].substr(0,fullStr.split('_')[indxArtistF].split('(')[1].indexOf(')'))
        let recordingF = fullStr.split('_')[indxRecordingF].split('(')[1].substr(0,fullStr.split('_')[indxRecordingF].split('(')[1].indexOf(')'))
        let trackF = fullStr.split('_')[indxTrackF].split('(')[1].substr(0,fullStr.split('_')[indxTrackF].split('(')[1].indexOf(')'))
        let percF = Number( fullStr.split('_')[indxPercF].split('(')[1].substr(0,fullStr.split('_')[indxPercF].split('(')[1].indexOf(')')) )
        console.log("Parameters of the search: ",{strNotes, artistF, recordingF, trackF, percF});
        // OR specify code in the back end... i.e. take this code and put it in the back-end (PROBABLY MESSY)
        // At least listLogNumbers would work.

        axios.get(`${baseUrl}/getSearchMap`, {
          params: { query: strNotes, filterArtist: artistF, filterRecording: recordingF, filterTrack: trackF, percMatch: percF }
        }).then((resSearchMap) => {
          // TODO update properly (use the _id of the saved SearchMap)
          console.log("Successfully called getSearchMap.resSearchMap: ", resSearchMap);
          // TODO make a call to load metadata? Or use it stored somewhere prior to the call?
          let arrMetadataToWorkflow = [];
          if(infoMusicList.length>0){arrMetadataToWorkflow=infoMusicList}
          // trackObj['SJA_ID']
          //   ? arrMetadataToWorkflow.push(d.data.filter(a => a['SJA_ID'] === trackObj['SJA_ID'])[0])
          //   : arrMetadataToWorkflow.push(d.data[0]); // I think this is the right approach for BGR
          console.log("Was that actually pushed? objects: ", objects);
          // replace objects[0].objectId
          objects[0].objectId = resSearchMap.data[0]._id;

          axios
            .post(`${baseUrl}/createWorkflow`, {
              title, description, time, author, objects, privacy,
              arrMetadataToWorkflow // Big doubt about this...!
            })
            .then((data) => {
              console.log("Then handleApi createWorkflow");
              setTitleInput("");
              setDescriptionInput("");
              setShowLoadingIcon(false);
              getWorkflowsInfo(
                dispatch, setWorkflows, { user: author }
              )
            })
            .catch(err => console.log(err))
        })
      } else {
        console.log("We are not prepared for this item. It is a ", objectsType[0])
        // TODO code is not ready for the types annotation and comment?!
      }
    }
  } else {
    axios
      .post(`${baseUrl}/createWorkflow`, {
        title, description, time, author,
        objects,
        privacy
      })
      .then((data) => {
        console.log("Then handleApi createWorkflow");
        setTitleInput("");
        setDescriptionInput("");
        setShowLoadingIcon(false);
        getWorkflowsInfo(
          dispatch, setWorkflows, { user: author }
        )
      })
      .catch(err => console.log(err))
  }
}

const addContentWorkflow = (
  dispatch, setWorkflows,
  _id, // _id of of the workflow
  textNote, // text to set note related to the object
  time, // time of input
  userId, // identifier of author
  idContent, // _id of object
  typeContent, // type of the content: recording / track / sample / annotation / comment / search (TODO) / ...
  objectsIndex, // make the assumption that this is calculated with the call as the workflow is passed as a parameter... (OR make another call if that isn't passed?! V1 assume it is passed)
  workflow, // TODO doubt about this!
  indexRange = 0, // For samples we need to know how far the search goes beyond the first note identified
) => {
  console.log("handleApi addContentWorkflow. ", {
    _id, textNote, time, userId, idContent, typeContent, objectsIndex
  });

  if (typeContent === 'sample' || typeContent === 'track' || typeContent === 'recording') {
    // first call to get the track id and get the lognumber I get...
    axios.get(`${baseUrl}/get_idContent_sample`, { params: { _id: idContent } })
      .then((res) => {
        console.log("ran get_idContent_sample. res: ", res);
        let trackObj = res.data[0];
        let lognumbers = [trackObj.lognumber];
        console.log("trackObj info. lognumber", trackObj.lognumber, ", SJA_ID", trackObj['SJA_ID']);
        axios
          .get(`${baseUrl}/getTracksMetadata`, {
            params: { lognumbers: lognumbers, }
          })
          .then((d) => {
            console.log("#### Loaded Metadata for workflow. d: ", d);
            // should it be an array or object...? E.g. hashmap...
            let arrMetadataToWorkflow = [];
            trackObj['SJA_ID']
              ? arrMetadataToWorkflow.push(d.data.filter(a => a['SJA_ID'] === trackObj['SJA_ID'])[0])
              : arrMetadataToWorkflow.push(d.data[0]); // I think this is the right approach for BGR
            console.log('arrMetadataToWorkflow: ', arrMetadataToWorkflow);
            // axios call
            axios.post(`${baseUrl}/addContentWorkflow`, {
              _id, textNote, time, userId, idContent, typeContent, objectsIndex, indexRange, arrMetadataToWorkflow
            })
              .then((data) => {
                console.log("Then handleApi addContentWorkflow. data: ", data);
                getWorkflowsInfo(
                  dispatch,
                  setWorkflows,
                  { user: userId }
                );
                // change with dispatch and setWorkflows? (Probably not, it is done in getWorkflowsInfo)
                // workflow.objects.push(data.data.objects[data.data.objects.length-1]);
              })
              .catch(err => console.log(err))
          })
      })
  } else {
    // axios call
    axios.post(`${baseUrl}/addContentWorkflow`, {
      _id, textNote, time, userId, idContent, typeContent, objectsIndex, indexRange
    })
      .then((data) => {
        console.log("Then handleApi addContentWorkflow. data: ", data);
        getWorkflowsInfo(
          dispatch,
          setWorkflows,
          { user: userId }
        );
      })
      .catch(err => console.log(err))
  }
}

const deleteWorkflow = (_id, dispatch, setWorkflows, userId) => {
  console.log("handleApi deleteWorkflow. ", { _id });
  axios.post(`${baseUrl}/deleteWorkflow`, {
    _id
  })
    .then((data) => {
      console.log("Then handleApi deleteWorkflow. data: ", data);
      getWorkflowsInfo(dispatch, setWorkflows, { user: userId });
    })
    .catch(err => console.log(err));
}
  
const getExactMatchWorkflowParameter = (_id, textSearch, selectionParameter, searchWorkflowOutput, setSearchWorkflowOutput, setLoadingSearchWorkflow) => {
  console.log("handleApi deleteWorkflow. ", {_id, textSearch, selectionParameter, searchWorkflowOutput, setSearchWorkflowOutput, setLoadingSearchWorkflow});
  // TODO ... why is this a post? Do we worry about security here?
  axios.post(`${baseUrl}/getExactMatchWorkflowParameter`, {
    _id, textSearch, selectionParameter
  })
    .then((data) => {
      console.log("Then handleApi getExactMatchWorkflowParameter. data: ", data);
      setLoadingSearchWorkflow(false);
      setSearchWorkflowOutput(data.data);
    })
    .catch(err => console.log(err));
}

const changeWorkflowPrivacy = (_id, newPrivacy, selectedWorkflow, setIsWorkerVisible, setSelectedWorkflow, user) => {
  console.log("changeWorkflowPrivacy, ", { _id, newPrivacy, selectedWorkflow, setIsWorkerVisible, setSelectedWorkflow, user });
  axios.post(`${baseUrl}/changeWorkflowPrivacy`, {
    _id, newPrivacy
  })
    .then((data) => {
      console.log("Then changeWorkflowPrivacy. data: ", data);
      getWorkflow(setIsWorkerVisible, setSelectedWorkflow, _id, user);
    })
    .catch(err => console.log(err));
}

// Note: the parameter passed is the _id of the workflow
const deleteWorkflowObject = (_id, objectIndex, workflow,
  // setListWorkflows, 
  dispatch,
  setWorkflows,
  userId) => {
  console.log("handleApi deleteWorkflowObject. ", { _id, objectIndex });
  // TODO assess whether we care about indexes having empty spots... I suppose not 
  axios.post(`${baseUrl}/deleteWorkflowObject`, {
    _id, objectIndex
  })
    .then((data) => {
      console.log("Then handleApi deleteWorkflowObject. data: ", data);
      getWorkflowsInfo(dispatch, setWorkflows, { user: userId });
      // TODO check if this is the right way. Call of workflow should be made with the global variable I think.
      workflow.objects = workflow.objects.filter(item => item["objectIndex"] !== objectIndex);
    })
    .catch(err => console.log(err));
}

// Loading up detail of workflow once as it is loaded is surprisingly complicated... Might as well load everything from the start
const getWorkflow = (setIsWorkerVisible, setSelectedWorkflow, _id, user) => {
  axios
    .get(`${baseUrl}/getWorkflow`, {
      params: { _id: _id, user: user }
    })
    .then(({ data }) => {
      console.log('getWorkflow successful. data: ', data);
      console.log("All objects: ",data.objects);
      console.log("getWorkflow then data: ",data);

      // So we will add content to the data...
      getDatabaseContent(data, setSelectedWorkflow, setIsWorkerVisible);
      console.log("Just did getDatabaseContent")
      // setSelectedWorkflow(data);
      // setIsWorkerVisible(true);
    })
    .catch(err => console.log(err))
}

// TODO awful name. Needs to be rewritten for something like 'getLoadWorkflowContent'
const getDatabaseContent = async (workflow, setSelectedWorkflow, setIsWorkerVisible) => {
  const workflowObjects = workflow.objects;
  console.log("getDatabaseContent. workflowObjects: ", workflowObjects);

  const requests = workflowObjects.map((object) => {
    const _id = object.objectId;
    const typeCaller = object.objectType;
    const indexRange = (object.objectIndexRange!==0)?(object.objectIndexRange-1):0; // doubt about this thing...
    console.log("typeCaller: ",typeCaller,", _id: ",_id,", indexRange: ",indexRange);

    // Probably need to make a different call for the track
    if (["annotation", "comment", "recording", "track", "sample", "search"].includes(typeCaller)) {
      return axios.get(`${baseUrl}/get_idContent_${typeCaller}`, {
        params: { _id: _id, typeCaller: typeCaller, indexRange: indexRange, },
      });
    } else {
      console.log("Issue with typeCaller: (", typeCaller, "), it is not recognized.");
      return Promise.reject("Invalid typeCaller");
    }
  });

  try {
    const responses = await Promise.allSettled(requests);
    console.log("responses:", responses);
    const responseData = responses.map((response) =>
      response.status === "fulfilled" ? response.value.data : null
    );
    console.log("responseData:", responseData);

    const updatedWorkflowObjects = workflowObjects.map((object, i) => {
      return { ...object, content: responseData[i] };
    });

    const updatedWorkflow = { ...workflow, objects: updatedWorkflowObjects };
    console.log("updatedWorkflow after enrichment: ", updatedWorkflow);

    setSelectedWorkflow(updatedWorkflow);
    setIsWorkerVisible(true);
  } catch (error) {
    console.log("Error:", error);
  }
};

/** Fuzzy Scores */
const getListFuzzyScores = async (first_id, notes) => {
  console.log("getListFuzzyScores. first_id: ", first_id,", notes: ",notes);
  // setIsLoading(true);
  axios
    .get(`${baseUrl}/getListFuzzyScores`, {
      params: { first_id: first_id },
    })
    .then((d) => {
      console.log("Loaded getListFuzzyScores. d: ", d);
      setIsLoading(false);
    });
}
const getAllFuzzyScores = async (score, notes) => {
  console.log("getAllFuzzyScores. score: ", score,", notes: ",notes);
  setIsLoading(true);
  axios
    .get(`${baseUrl}/getAllFuzzyScores`, {
      params: { score: score },
    })
    .then((d) => {
      console.log("Loaded getAllFuzzyScores. d: ", d);
      setIsLoading(false);
    });
}
const getListFuzzyDist = async (score, distance, notes) => {
  console.log("getListFuzzyDist. score: ", score,", distance: ",distance,", notes: ",notes);
  setIsLoading(true);
  axios
    .get(`${baseUrl}/getListFuzzyDist`, {
      params: { score:score, distance:distance },
    })
    .then((d) => {
      console.log("Loaded getListFuzzyDist. d: ", d);
      setIsLoading(false);
    });
}

/** SearchMap */
// TODO adapt code with a function for it to enrich melodic search (and maybe the workflow save and search)
// TODO consider the isLoading usage...!
const getSearchMap = async(query, filterArtist='', filterRecording='', filterTrack='') => {
  console.log("---getSearchMap. ",{query, filterArtist, filterRecording, filterTrack});
  setIsLoading(true);
  axios
    .get(`${baseUrl}/getSearchMap`, {
      params: { query: query, filterArtist: filterArtist, filterRecording: filterRecording, filterTrack: filterTrack },
    })
    .then((d) => {
      console.log("Loaded getSearchMap. d: ", d);
      setIsLoading(false);
    });

}

// TODO consider what else should be done here...
const createSearchMap = async (query, filterArtist = '', filterRecording = '', filterTrack = '', resIds = []) => {
  console.log("---createSearchMap. ", { query, filterArtist, filterRecording, filterTrack, resIds });
  axios
    .post(`${baseUrl}/createSearchMap`, {
      query, filterArtist, filterRecording, filterTrack, resIds
    })
    .then((data) => {
      console.log("Then handleApi createSearchMap. data: ", data);
    })
    .catch(err => console.log(err))
}


export {
  getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap,
  getMusicMIDI, getSampleMIDI, getMatchLevenshteinDistance,
  getTrackMetadata, getTracksMetadata,
  getMetadataFromAttribute, 
  getTrackMetaFromNoteId,
  addAnnotation, getAnnotations, deleteAnnotation, updateAnnotation,
  addComment, getComments, getCommentsOfAnnotation, deleteComment, updateComment,
  getUserAnnotations,
  getWorkflow, getWorkflowsInfo, createWorkflow, deleteWorkflow,
  addContentWorkflow, deleteWorkflowObject,
  getExactMatchWorkflowParameter, changeWorkflowPrivacy,
  getDatabaseContent,
  getListFuzzyScores, getAllFuzzyScores, getListFuzzyDist,
  getFuzzyLevenshtein,
  getSearchMap, createSearchMap
}
