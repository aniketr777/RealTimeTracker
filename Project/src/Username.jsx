// UsernameInput.js
import React, { useState } from "react";

const UsernameInput = ({ setUsername }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(input); // Update the username in the parent component
    setInput(""); // Clear the input field after submitting (optional)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your username"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UsernameInput;
