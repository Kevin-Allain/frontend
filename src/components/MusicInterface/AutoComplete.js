// import React, { useState, useRef, useEffect } from 'react';

// // const AutoComplete = ({ title, potentialInputs }) => {
// const AutoComplete = ({ title, potentialInputs, inputValue, onInputChange }) => {
//     const [userInput, setUserInput] = useState('');
//     const [filteredInputs, setFilteredInputs] = useState([]);
//     const [isFocused, setIsFocused] = useState(false);
//     const inputRef = useRef(null);

//     useEffect(() => {
//         const handleDocumentClick = (e) => {
//             if (inputRef.current && inputRef.current.contains(e.target)) {
//                 onInputChange(e); // Call the provided onInputChange function
//                 // Click is inside the AutoComplete component
//                 setIsFocused(true);
//             } else {
//                 // Click is outside the AutoComplete component
//                 setIsFocused(false);
//             }
//         };
//         document.addEventListener('click', handleDocumentClick);
//         return () => { document.removeEventListener('click', handleDocumentClick); };
//     }, []);

//     const handleInputChange = (e) => {
//         onInputChange(e); // Call the provided onInputChange function

//         const input = e.target.value;
//         setUserInput(input);
//         const filtered = potentialInputs.filter(item =>
//             item.toLowerCase().startsWith(input.toLowerCase())
//         );
//         setFilteredInputs(filtered);
//     };

//     const handleItemClick = (item) => {
//         setUserInput(item);
//         inputRef.current.focus();
//     };

//     return (
//         <div style={{ position: 'relative' }}>
//             <p style={{ color: 'white' }}>{title}:</p>
//             <input
//                 type="text"
//                 // value={userInput}
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 placeholder="Type here..."
//                 ref={inputRef}
//             />
//             {isFocused && userInput.length > 0 && filteredInputs.length > 0 && (
//                 <div style={{
//                     // position: 'absolute', 
//                     // top: '100%', 
//                     // left: 0, 
//                     color: "black",
//                     display: "inline-flex",
//                     border: '1px solid #ccc',
//                     background: '#fff',
//                     minWidth: '200px',
//                     maxWidth: '600px'
//                 }}>
//                     <ul>
//                         {filteredInputs.map((item, index) => (
//                             <li
//                                 key={index}
//                                 onClick={() => handleItemClick(item)}
//                                 style={{ cursor: 'pointer' }}>
//                                 {item}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AutoComplete;


import React, { useState, useRef, useEffect } from 'react';
import "./AutoComplete.css"

const AutoComplete = ({ title, potentialInputs, inputValue, onInputChange }) => {
    const [filteredInputs, setFilteredInputs] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleDocumentClick = (e) => {
            if (inputRef.current && inputRef.current.contains(e.target)) {
                onInputChange(e); // Call the provided onInputChange function
                // Click is inside the AutoComplete component
                setIsFocused(true);
            } else {
                // Click is outside the AutoComplete component
                setIsFocused(false);
            }
        };
        document.addEventListener('click', handleDocumentClick);
        return () => { document.removeEventListener('click', handleDocumentClick); };
    }, [onInputChange]);

    const handleInputChange = (e) => {
        onInputChange(e); // Call the provided onInputChange function

        const input = e.target.value;
        const filtered = potentialInputs.filter(item =>
            item.toLowerCase().startsWith(input.toLowerCase())
        );
        setFilteredInputs(filtered);
    };

    const handleItemClick = (item) => {
        onInputChange({ target: { value: item } }); // Set the input value to the clicked item
        inputRef.current.focus();
    };

    return (
        <div style={{ position: 'relative' }}>
            <p style={{ color: 'white' }}>{title}:</p>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type here..."
                ref={inputRef}
            />
            {isFocused && inputValue.length > 0 && filteredInputs.length > 0 && (
                // <div style={{
                //     color: "black",
                //     display: "inline-flex",
                //     border: '1px solid #ccc',
                //     background: '#fff',
                //     minWidth: '200px',
                //     maxWidth: '600px',
                //     maxHeight: '300px',
                //     'scroll-behavior': 'auto',
                //     overflow: 'scroll',
                // }}>
                <div className={`auto-complete-dropdown ${isFocused ? 'show' : ''}`}>
                    <ul>
                        {filteredInputs.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleItemClick(item)}
                                style={{ cursor: 'pointer', color: "black" }}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AutoComplete;
