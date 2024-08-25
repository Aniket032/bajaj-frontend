"use client";

import { useState } from "react";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const validateJSON = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateJSON(jsonInput)) {
      setError("Invalid JSON format");
      setOptionsVisible(false);
      return;
    }

    setError("");

    const parsedInput = JSON.parse(jsonInput);

    const res = await fetch(
      "https://backend-bajaj.netlify.app/.netlify/functions/api",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      }
    );

    const data = await res.json();
    if (data.is_success) {
      setResponse(data);
      console.log(data);
      setOptionsVisible(true);
    } else {
      setError("API returned an error");
    }
  };

  const handleOptionChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(value);
  };

  const renderResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = response;

    return (
      <div className="mt-4">
        {selectedOptions.includes("Numbers") && (
          <div className="mb-2">
            <strong>Numbers:</strong> {numbers.join(", ")}
          </div>
        )}
        {selectedOptions.includes("Alphabets") && (
          <div className="mb-2">
            <strong>Alphabets:</strong> {alphabets.join(", ")}
          </div>
        )}
        {selectedOptions.includes("Highest lowercase alphabet") && (
          <div className="mb-2">
            <strong>Highest lowercase alphabet:</strong>{" "}
            {highest_lowercase_alphabet.join(", ")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-xl font-semibold mb-4">API Input</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={4}
        />
        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 w-full"
        >
          Submit
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {optionsVisible && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Multi Filter</h2>
          <select
            multiple
            onChange={handleOptionChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">
              Highest lowercase alphabet
            </option>
          </select>
        </div>
      )}
      {renderResponse()}
    </div>
  );
}
