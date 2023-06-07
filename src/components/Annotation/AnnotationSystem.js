import React, { useState } from 'react';
import { HiOutlineAnnotation } from 'react-icons/hi'
import {
  addAnnotation,
  getAnnotations,
  deleteAnnotation,
  updateAnnotation
} from "../../utils/HandleApi";

import Annotation from "./Annotation.js"
import "./AnnotationSystem.css"


// TODO assess how we want to convey information about the object that uses the annotation system. 
// We need to standardize (maybe use a different structure?)
const AnnotationSystem = ({ type, info, index=0 }) => {

  const [textInputAnnotation, setTextInputAnnotation] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [annotationId, setAnnotationId] = useState("");

  const [showInputAnnotation, setShowInputAnnotation] = useState(false);

  const [listAnnotations, setListAnnotations] = useState([]);

  const [selectedPrivacyOption, setSelectedPrivacyOption] = useState('public');


  const updateMode = (_id, text) => {
    console.log("updateMode AnnotationSystem. text: ",text);
    setIsUpdating(true);
    setTextInputAnnotation(text);
    setAnnotationId(_id);
  };

  const handleShowAndLoadAnnotations = (type, info, getAnnotations) => {
    setShowInputAnnotation(!showInputAnnotation)
    console.log("type: ",type,", info: ",info,", index: ",index ,", getAnnotations: ", getAnnotations,", showInputAnnotation: ",showInputAnnotation)
    if (!showInputAnnotation){
      getAnnotations(
        type, 
        info, 
        setListAnnotations, 
        index, 
        localStorage.username ? localStorage.username : null);
    }
  }

  const handleChangeOption = (event) => {
    setSelectedPrivacyOption(event.target.value);
  };


  const handleShowAndLoadCommentsSystem = (annotationId) => {
    console.log("handleShowAndLoadCommentsSystem. annotationId: ", annotationId);
    // setShowInputAnnotation(!showInputAnnotation)
    console.log("type: ",type,", info: ",info,", index: ",index ,", getAnnotations: ", getAnnotations,", showInputAnnotation: ",showInputAnnotation)
  }

  return (
    <div className="annotationInput">
      {/* button to show or hide... could be a good place to make the query about the annotations... */}
      <button className='buttonShowAnnotation' onClick={
        () => handleShowAndLoadAnnotations(type, info, getAnnotations)
      }>
        <HiOutlineAnnotation className='icon' />
      </button>
      {/* TODO think about whether the addition of annotations should be open without making an account... probably not? */}
      {showInputAnnotation &&
        <div className='areaAnnotation'>
          
          <div className='areaInputAnnotation'>
          <input
            type="text"
            placeholder={"Add annotation about " + type}
            name="AddAnnotation"
            id="AddAnnotation"
            className='annotation'
            value={textInputAnnotation}
            onChange={(e) => setTextInputAnnotation(e.target.value)} />
          <select value={selectedPrivacyOption} onChange={handleChangeOption}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <div className="add" onClick={(textInputAnnotation!=='')?
            (isUpdating
              ? () => updateAnnotation( annotationId, textInputAnnotation , setTextInputAnnotation, index, type, info,
                setListAnnotations, setIsUpdating,
                localStorage?.username)
              : () => addAnnotation( type, info, index, textInputAnnotation, 
                setTextInputAnnotation,
                setListAnnotations,
                localStorage?.username, selectedPrivacyOption))
              : () => console.log('empty')
          }
          >
            {isUpdating ? "Update" : "Add"}
          </div>
          </div>
          <div className='outerAreaDisplayAnnotation'>
            <div className='areaDisplayAnnotation'>
              {listAnnotations.map((item, i) => (
                  <Annotation
                    key={item._id}
                    annotationInput={item.annotationInput}
                    info={item.info}
                    type={item.type}
                    author={item.author}
                    privacy={item.privacy}
                    indexAnnotation = {i}
                    time={item.time}
                    // TODO (and think about more) e.g. star
                    handleShowAndLoadCommentsSystem={ 
                      () => handleShowAndLoadCommentsSystem(item._id, ) 
                    }
                    updateMode={
                      () => updateMode(item._id, item.annotationInput, localStorage?.username)}
                    deleteAnnotation={() => deleteAnnotation(item._id, item.type, item.info, setListAnnotations)}
                  />
                ))}
            </div>
          </div>
           
        </div>
      }
    </div>
  )
}


export default AnnotationSystem;
