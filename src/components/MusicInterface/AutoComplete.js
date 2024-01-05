// TODO fix the way the suggestions appear. It still looks a bit janky. But we have to focus on other points.
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
