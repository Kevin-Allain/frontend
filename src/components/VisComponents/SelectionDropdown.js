// SelectionDropdown.js
import React from 'react';

const SelectionDropdown = ({ attributeMix, selectedAttributeMix, onChange }) => (
  <div className="mx-[0.5rem] inline-flex items-center">
    <label>Information selection</label>
    <select
      className="mx-[0.5rem]"
      onChange={(e) => onChange(e.target.value)}
      value={selectedAttributeMix}
    >
      {attributeMix.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default SelectionDropdown;
