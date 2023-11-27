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
const AnnotationSystem = ({ type, info, index=0, idCaller = null }) => {
  console.log("-- AnnotationSystem -- ", { type, info, index, idCaller});
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
    <div className="annotationInput border border-2 border-inherit rounded p-[0.2rem] h-fit ">
      {/* w-fit -> small doubt about the  */}
      {/* button to show or hide... could be a good place to make the query about the annotations... */}
      {/* Button should only be visible if user is logged in? beforePrivateBeta -> Actions only, but reading should be fine... */}
      
        <div className='buttonShowAnnotation icon flex' onClick={
          () => handleShowAndLoadAnnotations(type, info, getAnnotations)
        }>
          <div className='icon flex text-[15px] items-center'>Annotation about the {type}{" "}<HiOutlineAnnotation className='icon annotationIcon' /> </div>
        </div>
      
      {showInputAnnotation &&
        <div className='areaAnnotation'>
          {typeof (localStorage.token) !== 'undefined' &&
            <div className='areaInputAnnotation'>
              <input
                type="text"
                placeholder={"Add annotation about " + type}
                name="AddAnnotation"
                id="AddAnnotation"
                className='annotation'
                value={textInputAnnotation}
                onChange={(e) => setTextInputAnnotation(e.target.value)} />
              <select className='selectPrivacy' value={selectedPrivacyOption} onChange={handleChangeOption}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <div className="add" onClick={(textInputAnnotation !== '') ?
                (isUpdating
                  ? () => updateAnnotation(annotationId, textInputAnnotation, setTextInputAnnotation, index, type, info,
                    setListAnnotations, setIsUpdating,
                    localStorage?.username)
                  : () => addAnnotation(type, info, index, textInputAnnotation,
                    setTextInputAnnotation,
                    setListAnnotations,
                    localStorage?.username, selectedPrivacyOption))
                : () => console.log('empty')
              }
              >
                {isUpdating ? "Update" : "Add"}
              </div>
            </div>
          }
          <div className='outerAreaDisplayAnnotation'>
            <div className='areaDisplayAnnotation'>
              {listAnnotations.length===0 && <p className='text-black'>No annotation made for this {type}.</p>}
              {listAnnotations.map((item, i) => (
                  <Annotation
                    key={item._id}
                    _id={item._id}
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
                    updateMode={ () => updateMode(item._id, item.annotationInput, localStorage?.username) }
                    deleteAnnotation={ () => deleteAnnotation(item._id, item.type, item.info, setListAnnotations) }
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
