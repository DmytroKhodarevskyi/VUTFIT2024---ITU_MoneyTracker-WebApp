import React, { useState } from "react";
import "./NewTransactionCard.css"


function ColorPicker( {onChange} ) {
  // Default color is set to red
  const [selectedColor, setSelectedColor] = useState("#ff0000");

  // Handler to update color when user picks a new one
  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
    onChange(event.target.value);
  };

  return (
      <div>
        <input className="hitbox"
          id="color-picker"
          type="color"
          onChange={handleColorChange} // Update color when 
        />
      </div>
  );
}

export default ColorPicker;
