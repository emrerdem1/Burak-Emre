import React, { useState, useEffect } from "react";

const EditableInput = ({ childRef, text, type, placeholder, children, ...props }) => {
  const [isEditing, setEditing] = useState(false);

  const handleKeyDown = (event, type) => {
    const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey];

    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false);
    }
  };

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus();
    }
  }, [isEditing, childRef]);

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={e => handleKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
          <div
            onClick={() => setEditing(true)}
          >
            <span>
              {text || placeholder || "Write a name"}
            </span>
          </div>
        )}
    </section>
  );
};

export default EditableInput;