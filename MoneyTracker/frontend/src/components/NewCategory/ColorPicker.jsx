/**
 * File: ColoPicker.jsx
 * Description: Component for color picker.
 * Author: Dmytro Khodarevskyi
 * 
 * Notes:
 * - _
 */


import React, { useState } from "react";
import "./NewTransactionCard.css"


function ColorPicker( {onChange} ) {
  
  const [selectedColor, setSelectedColor] = useState("#ff0000");

  
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    onChange(event.target.value);
  };

  return (
      <div>
        <input className="hitbox"
          id="color-picker"
          type="color"
          onChange={handleColorChange} 
        />
      </div>
  );
}

export default ColorPicker;
