import React, { useState } from 'react';
import { HiOutlineAnnotation } from 'react-icons/hi'

const AnnotationSystem = ( {type} ) => {

  const [textInputAnnotation, setTextInputAnnotation] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [annotationId, setAnnotatoinId] = useState("");

  const [showInputAnnotation, setShowInputAnnotation] = useState(false);

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
              placeholder={"Add annotation about "+type}
              name="AddAnnotation"
              id="AddAnnotation"
              className='annotation'
              value={textInputAnnotation}
              onChange={(e) => setTextInputAnnotation(e.target.value)} />
              <div className="add annotation" onClick={isUpdating
                ? () => console.log("will try to update")
                : () => console.log("wil try to add")}
              >
                {isUpdating ? "Update" : "Add"}
              </div>
            </div>
        }
      </div>
    )
}


export default AnnotationSystem;
