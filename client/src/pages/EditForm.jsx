import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from './Context';

const EditForm = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const { email } = useContext(Context);
  const [formLink, setFormLink] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`http://localhost:5000/forms/${id}`);
      const data = await response.json();
      setTitle(data.title);
      setQuestions(data.questions);
    };
    fetchForm();
  }, [id]);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: 'Untitled Question',
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestionText = (id, newText) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, question: newText } : q
    ));
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateForm = async () => {
    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, questions }),
      });
      if (response.ok) {
        alert('Form updated successfully!');
        setFormLink(`${window.location.origin}/form/${id}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update form: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating form:', error);
      alert('An error occurred while updating the form.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Form</h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-2 mb-8"
          placeholder="Form Title"
        />

        {questions.map((question, index) => (
          <div key={question.id} className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">Question {index + 1}</span>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestionText(question.id, e.target.value)}
              className="w-full border-2 border-gray-200 rounded-md p-3 focus:border-blue-400 focus:ring-blue-400 outline-none"
              placeholder="Enter your question"
            />
          </div>
        ))}

        <div className="flex justify-center mt-8">
          <button
            onClick={addQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Add Question
          </button>
        </div>

        <div className="mt-12 border-t-2 pt-8 flex justify-end">
          <button
            onClick={updateForm}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            Update Form
          </button>
        </div>

        {formLink && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold mb-2">Share this link to get responses:</h2>
            <div className="flex items-center justify-center">
              <input
                type="text"
                value={formLink}
                readOnly
                className="w-full max-w-md bg-gray-100 border-2 border-gray-300 rounded-lg p-2 text-center"
              />
              <button
                onClick={() => navigator.clipboard.writeText(formLink)}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditForm;
