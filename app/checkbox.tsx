//Create CheckBox component:

"use client"
import React from "react";

const Checkbox = ({ label, checked, onChange }) => {
    return (
      <div className="checkbox-wrapper">
        <label>
          <input type="checkbox" checked={checked} onChange={onChange} />
          <span>{label}</span>
        </label>
      </div>
    );
};

export default Checkbox;
