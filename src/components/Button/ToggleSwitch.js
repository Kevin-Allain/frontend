// ToggleSwitch.js
import React from "react";
import "./stylesButtons.css"; // Import the CSS file

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="switchButton">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="sliderButton"></span>
    </label>
  );
};

export default ToggleSwitch;
