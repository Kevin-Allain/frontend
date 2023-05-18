import React, { useState } from 'react';
import { HiOutlineAnnotation } from 'react-icons/hi'

// TODO assess how we want to convey information about the object that uses the annotation system. 
// We need to standardize (maybe use a different structure?)
const AnnotationSystem = ({ type, info, addAnnotation }) => {

  const [textInputAnnotation, setTextInputAnnotation] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [annotationId, setAnnotatoinId] = useState("");

  const [showInputAnnotation, setShowInputAnnotation] = useState(false);

  // localStorage.username ? localStorage.username : null

  return (
    <div className="annotationInput">

      {/* button to show or hide */}
      <button className='buttonShowAnnotation' onClick={() => setShowInputAnnotation(!showInputAnnotation)}>
        <HiOutlineAnnotation className='icon' />
      </button>
      {showInputAnnotation &&
        <div className='areaAnnotation'>
          <input
            type="text"
            placeholder={"Add annotation about " + type}
            name="AddAnnotation"
            id="AddAnnotation"
            className='annotation'
            value={textInputAnnotation}
            onChange={(e) => setTextInputAnnotation(e.target.value)} />
          <div className="add annotation" onClick={isUpdating
            ? () => console.log("will try to update")
            : () => addAnnotation(
              type,
              info,
              textInputAnnotation,
              setTextInputAnnotation,
              null, // TODO fix
              localStorage?.username)
          }
          >
            {isUpdating ? "Update" : "Add"}
          </div>
        </div>
      }
    </div>
  )
}


export default AnnotationSystem;
