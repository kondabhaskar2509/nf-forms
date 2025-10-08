import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FormResponse = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`http://localhost:5000/forms/${id}`);
      const data = await response.json();
      setForm(data);
      setResponses(new Array(data.questions.length).fill(''));
    };
    fetchForm();
  }, [id]);

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '') {
      alert('Please enter your email.');
      return;
    }
    if (responses.some(response => response === '')) {
      alert('Please answer all questions.');
      return;
    }
    const response = await fetch('http://localhost:5000/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        form_no: parseInt(id, 10),
        responses: responses,
        email: email,
      }),
    });
    if (response.ok) {
      alert('Response submitted successfully!');
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{form.title}</h1>
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm border border-gray-200">
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
            />
          </div>
          {form.questions.map((question, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm border border-gray-200">
              <label className="block text-lg font-medium mb-2">{question.question}</label>
              <input
                type="text"
                value={responses[index]}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <div className="mt-12 border-t-2 pt-8 flex justify-end">
            <button
              type="submit"
              disabled={form.questions.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormResponse;
