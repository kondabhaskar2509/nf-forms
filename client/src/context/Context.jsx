import React, { createContext, useState } from "react";
export const context = createContext();

const Context = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  const value = { authenticated , setAuthenticated ,name , email , setName , setEmail};

  return <context.Provider value={value}>{props.children}</context.Provider>;
};

export default Context;
