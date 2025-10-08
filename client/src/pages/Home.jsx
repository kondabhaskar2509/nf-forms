import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Context";

const Home = () => {
  const navigate = useNavigate();
  const { authenticated, email } = useContext(Context);
  const [forms, setForms] = useState([]);

  const DAUTH_CLIENT_ID = "8c6Bna.YrZM1M8GC";
  const DAUTH_REDIRECT_URI = "http://localhost:5173/signin";
  const DAUTH_SCOPE = "email openid profile user";
  const DAUTH_AUTH_URL = "https://auth.delta.nitt.edu/authorize";

  function generateRandomString(length = 16) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const state = generateRandomString(12);
  const nonce = generateRandomString(12);

  const dauthUrl = `${DAUTH_AUTH_URL}?client_id=${encodeURIComponent(
    DAUTH_CLIENT_ID
  )}&redirect_uri=${encodeURIComponent(
    DAUTH_REDIRECT_URI
  )}&response_type=code&grant_type=authorization_code&scope=${encodeURIComponent(
    DAUTH_SCOPE
  )}&state=${state}&nonce=${nonce}`;

  useEffect(() => {
    if (authenticated) {
      const fetchForms = async () => {
        const response = await fetch(`http://localhost:5000/my-forms/${email}`);
        const data = await response.json();
        setForms(data);
      };
      fetchForms();
    }
  }, [authenticated, email]);

  return (
    <>
      <div className="text-3xl text-center font-bold mt-3">NF Forms</div>
      {!authenticated ? (
        <button
          className="w-[25%] mx-[38%] mt-5  text-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-md text-lg transition"
          onClick={() => {
            window.location.href = dauthUrl;
          }}>
          Signin with DAuth
        </button>
      ) : (
        <>
          <button
            className="w-[25%] mx-[38%] mt-5  text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md text-lg transition"
            onClick={() => {
              navigate("/profile");
            }}>
            View Your Profile
          </button>
          <button
            className="w-[25%] mx-[38%] mt-5  text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md text-lg transition"
            onClick={() => {
              navigate("/createform");
            }}>
            Create a NF Form
          </button>
          <div className="mt-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">My Forms</h2>
            {forms.map((form) => (
              <div key={form.id} className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center">
                <h3 className="text-xl font-bold">{form.title}</h3>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate(`/edit-form/${form.id}`)}>
                  Edit Form
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;