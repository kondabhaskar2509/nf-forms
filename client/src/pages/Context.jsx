import React, { createContext, useState } from "react";
export const Context = createContext();

const ContextProvider = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  const value = { authenticated , setAuthenticated ,name , email , setName , setEmail};

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
