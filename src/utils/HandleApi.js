import axios from 'axios'
import { setIsLoading } from '../App';


const baseUrl = "http://localhost:5000" // can be used for development
// const baseUrl = "https://fullstack-proto-jazzdap-backend.onrender.com"


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


const getMusicMIDI = (recording = "BGR0082-T1", user = null, transformFunc = null, playMusicFunc = null) => {
  console.log("-- handleAPI. getMusicMIDI. recording: ", recording, ", user: ", user, ", transformFunc: ", transformFunc, ", playMusicFunc: ", playMusicFunc);
  // setIsLoading(true);

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

      // setIsLoading(false);
      return d;
    })
    .catch((err) => console.log(err));
};


const getSampleMIDI = (recording = "BGR0082-T1", firstNoteIndex = 0, lastNodeIndex = null, user = null, transformFunc = null, playMusicFunc = null) => {
  console.log("-- handleAPI. getMusicMIDI. recording: ", recording, ", user: ", user, ", transformFunc: ", transformFunc, ", playMusicFunc: ", playMusicFunc);
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getSampleMIDI`, {
      params: {
        recording: recording,
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
  console.log("---- HandleApi / getTracksMetadata. lognumbers: ", lognumbers,", infoMusicList: ",infoMusicList,", setInfoMusicList: ",setInfoMusicList);
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getTracksMetadata`, {
      params: {
        lognumbers: lognumbers,
      }
    })
    .then((d) => {
      console.log("#### Then of getTracksMetadata ####");
      console.log("d: ", d);
      
      // TODO low-priority change names of columns in the files, then updated in databased (automate with Python)
      let transf_info_metadata = [];
      for ( let i in d.data){
        transf_info_metadata.push({
          lognumber: d.data[i].lognumber,
          contents: d.data[i].Contents,
          configuration: d.data[i].Configuration,
          tape_stock: d.data[i]["Tape stock"],
          recording_location: d.data[i]["Recording location"],
        })
      }
      console.log("transf_info_metadata: ",transf_info_metadata);
      setInfoMusicList(transf_info_metadata);
      // setIsLoading(false);
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
      console.log("! infoMusicList.some(a => a.lognumber === d.data[0].lognumber ): ", ! infoMusicList.some(a => a.lognumber === d.data[0].lognumber ))
      if ( ! infoMusicList.some(a => a.lognumber === d.data[0].lognumber ) ) {
        setInfoMusicList([...infoMusicList,
        {
          lognumber: d.data[0].lognumber,
          contents: d.data[0].Contents,
          tape_stock: d.data[0]["Tape stock"],
          recording_location: d.data[0]["Recording location"],
        }
        ])
      }
      // setIsLoading(false);
    })
}

const getMatchLevenshteinDistance = (
  stringNotes = "",
  percMatch = 1,
  user = null,
  transformFunc = null,
  playMusicFunc = null,
  levenshteinDistanceFunc = null,
  setListSearchRes = null,
  setListLogNumbers = null, 
  setListTracks=null
) => {
  console.log("-- handleAPI / getMatchLevenshteinDistance. stringNotes: ", stringNotes,
    ", percMatch: ", percMatch,
    " user: ", user,
    ", transformFunc: ", transformFunc,
    ", playMusicFunc: ", playMusicFunc,
    ", levenshteinDistanceFunc: ", levenshteinDistanceFunc);


    setIsLoading(true);


  axios
    .get(`${baseUrl}/getMatchLevenshteinDistance2`, { // test
      params: {
        stringNotes: stringNotes,
        percMatch: percMatch,
        user: user,
      },
    })
    .then((d) => {
      console.log("#### Then of getMatchLevenshteinDistance ####");
      console.log("d", d);
      console.log("d.data: ", d.data);

      console.log("TIME AFTER QUERY: ",new Date());


      /** TODO
       * This is a lot of code and most likely should be passed as a function
       */
      /** TODO 2
       * What to do when the data returned is the result from a query without matches?
       */

      // In retrospect, we probably don't want to play songs directly... we want to list the matching bits.
      if (levenshteinDistanceFunc == null) {
        console.log("We are missing a function to calculate distance!");
      } else {
        // structure data
        const arrayStrNotes = stringNotes.split('-')
        const arrayNotesInput = arrayStrNotes.map(a => parseInt(a))
        const numNotesInput = arrayNotesInput.length;
        console.log("numNotesInput: ", numNotesInput);
        const allRecording = [...new Set(d.data.map(a => a.recording))]
        console.log("allRecording: ", allRecording);

        let notesPerRecording = {};
        for (let i in allRecording) {
          notesPerRecording[allRecording[i]] =
            d.data.filter(a => a.recording === allRecording[i])
        }
        console.log("notesPerRecording :", notesPerRecording);
        // Tricky to split the data into sections... might have to do it from previous step actually!

        // split according to recording
        let dataSplitByRecording = {};
        for (let i in allRecording) {
          let filteredByRecording = d.data.filter(a => a.recording === allRecording[i])
          dataSplitByRecording[allRecording[i]] = {}
          dataSplitByRecording[allRecording[i]].data = filteredByRecording;
        }

        for (let i in dataSplitByRecording) {
          // sort notes
          dataSplitByRecording[i].data = 
            dataSplitByRecording[i].data.sort((a, b) => a.recording - b.recording || a.m_id - b.m_id);
          dataSplitByRecording[i].sequences = [];
          // let startSeQuences = dataSplitByRecording[i].data.filter(a => a.startSequence);
          for (let ds in dataSplitByRecording[i].data) {
            if (dataSplitByRecording[i].data[ds].startSequence) {
              let slice = dataSplitByRecording[i].data.slice(parseInt(ds), (parseInt(ds) + parseInt(numNotesInput)));
              dataSplitByRecording[i].sequences.push(slice);
            }
          }
        }

        // ugly... but we messed up structure here...
        let resArray = []
        let resAggreg = [];
        for (let i in dataSplitByRecording) {
          dataSplitByRecording[i].distances = []
          dataSplitByRecording[i].slicesDist = [];
          for (let j in dataSplitByRecording[i].sequences) {
            let curArrNotes = dataSplitByRecording[i].sequences[j].map(a => a.pitch)
            let curArrTime = dataSplitByRecording[i].sequences[j].map(a => a.onset)
            let curArrDurations = dataSplitByRecording[i].sequences[j].map(a => a.duration)
            // console.log("arrNotes: ", arrNotes);
            // let strArrNotes=arrNotes.toString().replaceAll(',','-');
            let distCalc = levenshteinDistanceFunc(arrayNotesInput, curArrNotes);
            dataSplitByRecording[i].distances.push(distCalc);
            dataSplitByRecording[i].slicesDist.push({
              arrNotes: curArrNotes,
              arrTime: curArrTime.map((num) => Number(num.toFixed(2))),
              arrDurations: curArrDurations.map((num) => Number(num.toFixed(2))),
              distCalc: distCalc,
              recording: i
            });
          }
          resArray.push({ "recording": i })
          resArray[resArray.length - 1].data = dataSplitByRecording[i].data;
          resArray[resArray.length - 1].distances = dataSplitByRecording[i].distances;
          resArray[resArray.length - 1].sequences = dataSplitByRecording[i].sequences;
          resArray[resArray.length - 1].slicesDist = dataSplitByRecording[i].slicesDist;
          resAggreg = resAggreg.concat(dataSplitByRecording[i].slicesDist);
        }

        resAggreg.sort((a, b) => a.distCalc - b.distCalc);
        console.log("TIME AFTER ORGANIZING RES, CALCULATING DISTANCE, AND SORTING: ",new Date());

        console.log("dataSplitByRecording: ", dataSplitByRecording);
        // Will be better to later allow filter
        console.log("resArray: ", resArray);
        console.log("resAggreg: ", resAggreg);
        console.log("typeof resAggreg: ", typeof resAggreg);

        const allLogNumber =  [...new Set(resAggreg.map( a => a.recording.split('-')[0] ))] 
        // console.log("allLogNumber: ", allLogNumber);
        setListLogNumbers(allLogNumber);
        setListSearchRes(resAggreg);
        // TODO
        setListTracks(  [...new Set(resAggreg.map(obj => obj.recording))].sort() )
      }

      setIsLoading(false);
      return d;
    })
    .catch((err) => console.log(err));
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
  author = null,
  privacy='public'
  ) => {
  console.log(`HandeAPI addAnnotation: \n${baseUrl}/saveAnnotation`, { type, info, annotationInput, author, indexAnnotation, privacy });
  // setIsLoading(true);

  let time = new Date();

  axios
    .post(`${baseUrl}/addAnnotation`, { type, info, indexAnnotation, annotationInput, author, privacy, time })
    .then((data) => {
      console.log(data);
      setAnnotationInput("");
      getAnnotations(
        type, 
        info,
        setListAnnotations, 
        indexAnnotation, 
        localStorage.username ? localStorage.username : null)

        // setIsLoading(false);        
    })
    .catch(err => console.log(err))
}

const updateAnnotation = (
  annotationId,
  annotationInput,
  setAnnotationInput,
  indexAnnotation=0,
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

const getAnnotations = (type, info, setListAnnotations, indexAnnotation = 0, user = null) => {
  console.log("HandeAPI getAnnotations type: ", type, ", info: ", info, ", indexAnnotation: ", indexAnnotation, ", user: ", user);
  // setIsLoading(true);

  axios
    .get(`${baseUrl}/getAnnotations`, {
      params: {
        type: type,
        info: info,
        indexAnnotation: indexAnnotation,
        user: user
      }
    })
    .then(({ data }) => {
      console.log('data: ', data);
      setListAnnotations(data);
      // setIsLoading(false);
    })
    .catch(err => console.log(err))
}

const deleteAnnotation = (annotationId, type, info, setListAnnotations, indexAnnotation=0) => {
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
  annotationId=null
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
      getComments(
        setListComments, 
        author,
        annotationId
      )
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
      getComments(
        setListComments, 
        userId ,
        annotationId
      )

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
  annotationId= null 
  ) => {
  console.log("HandeAPI getComments, annotationId: ",annotationId, ", user: ",user);
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

const deleteComment = (
  commentId, 
  setListComments,
  user = null,
  annotationId= null 
  ) => {
  console.log("HandeAPI deleteComment. commentId: ", commentId, ", setListComments: ", setListComments,", user: ",user,", annotationId: ",annotationId);

  axios
    .post(`${baseUrl}/deleteComment`, { _id: commentId })
    .then((data) => {
      console.log(data);
      getComments(
        setListComments,
        user,
        annotationId
        );
    })
    .catch(err => console.log(err))
}

/** User info */
const getUserAnnotations = (setListAnnotations, user) => {
  console.log("handleApi getUserAnnotations. user: ",user);

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

const getWorkflow = (setIsWorkerVisible, setSelectedWorkflow, _id, user) => {
  console.log("handleApi getWorkflow. setIsWorkerVisible: ",setIsWorkerVisible,", setSelectedWorkflow: ",setSelectedWorkflow,", _id: ",_id,", user: ",user);
  
  axios
    .get(`${baseUrl}/getWorkflow`, {
      params:
        { 
          _id:_id,
          user: user
        }
    })
    .then(({ data }) => {
      console.log('getWorkflow successful. data: ', data);
      // TODO
      setSelectedWorkflow(data);
      setIsWorkerVisible(true);
    })
    .catch(err => console.log(err))
}


const getWorkflowsInfo = (setListWorkflows, { title = null, time = null, user = null } = {}) => {
  console.log("handleApi getWorkflowsInfo.", { title, time, user });

  axios
    .get(`${baseUrl}/getWorkflowsInfo`, {
      params:
        { 
          title:title,
          time:time,
          user: user
        }
    })
    .then(({ data }) => {
      console.log('getWorkflowsInfo data: ', data);
      setListWorkflows(data);
    })
    .catch(err => console.log(err))
}

// In the case where we create one workflow with one object, there can be one note passed with it
const createWorkflow = (
  title, 
  description, 
  time, 
  author, 
  objects=[],
  objectsTimes=[],
  objectNote = '',
  objectsType=[],
  setTitleInput,
  setDescriptionInput,
  getUserWorkflows,
  setListWorkflows
  ) => {
    console.log("handleApi createWorkflow. ", { 
      title, 
      description, 
      time, 
      author, 
      objects, 
      objectsTimes,
      objectNote,
      objectsType
    } );

    const objectIndexes = [0];
    const objectNotes = (objectNote!=='')?[objectNote]:[];

    axios
    .post(`${baseUrl}/createWorkflow`, { 
      title, 
      description, 
      time, 
      author, 
      objects,
      objectsTimes,
      objectNotes,
      objectIndexes,
      objectsType
    })
    .then((data) => {
      console.log("Then handleApi createWorkflow");
      setTitleInput("");
      setDescriptionInput("");
      getUserWorkflows(setListWorkflows,author)
    })
    .catch(err => console.log(err))
  
}

const addContentWorkflow = (
  setListWorkflows,
  _id, // _id of of the workflow
  textNote, // text to set note related to the object
  time, // time of input
  userId, // identifier of author
  idContent, // _id of object
  typeContent, // type of the content: recording / track / sample / annotation / comment / search (TODO) / ...
  objectsIndex, // make the assumption that this is calculated with the call as the workflow is passed as a parameter... (OR make another call if that isn't passed?! V1 assume it is passed)
  workflow // TODO doubt about this!
) => {
  console.log("handleApi createWorkflow. ", { 
    _id, // _id of of the workflow
    textNote, // text to set note related to the object
    time, // time of input
    userId, // identifier of author
    idContent, // _id of object
    typeContent, // type of the content
    objectsIndex // index of object passed
  });

  // axios call
  axios.post(`${baseUrl}/addContentWorkflow`,{
    _id, // _id of of the workflow
    textNote, // text to set note related to the object
    time, // time of input
    userId, // identifier of author
    idContent, // _id of object
    typeContent, // type of the content
    objectsIndex // index of object passed
  })
  .then((data) => {
    console.log("Then handleApi addContentWorkflow. data: ",data);
    // TODO ... do more? Maybe do another call to get the list of workflows?
    getWorkflowsInfo(setListWorkflows, {user:userId});
    workflow.objects.push(data.data.objects[data.data.objects.length-1]); // TODO this works... but should find something better!
  })
  .catch(err => console.log(err))

}

export {
  getAllJazzDap, addJazzDap, updateJazzDap, deleteJazzDap,
  getMusicMIDI, getSampleMIDI, getMatchLevenshteinDistance,
  getTrackMetadata, getTracksMetadata,
  addAnnotation, getAnnotations, deleteAnnotation, updateAnnotation,
  addComment, getComments, deleteComment, updateComment,
  getUserAnnotations, 
  getWorkflow, getWorkflowsInfo, createWorkflow, addContentWorkflow
}
