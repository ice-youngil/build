// ToolSettings.jsx
import React, { useState } from 'react';
import 'assets/css/ToolSettings.css';
import penCloseButtonIcon from 'assets/icon/pen-close.png';

const BackgroundSettings = ({ selectedBackgroundColor, setSelectedBackgroundColor, closeSettings }) => {

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedBackgroundColor(newColor);
  };

  return (
    <div className="background-settings">
      <div className="background-picker-container">
        <input
          id="canvas-background-color"
          type="color"
          value={selectedBackgroundColor}
          onChange={handleColorChange}
        />
      </div>
      <div className="background-close-button">
        <button className="background-close" onClick={closeSettings}>
          <img src={penCloseButtonIcon} alt="Close Settings" />
        </button>
      </div>
    </div>
  );
};

export default BackgroundSettings;