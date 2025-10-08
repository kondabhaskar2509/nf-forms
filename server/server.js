import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import "dotenv/config.js";
const { Client } = pg;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const databaseUrl = process.env.DATABASE_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

const port = 5000;

const CREATE_TABLE = {
  login: `create table if not exists login (
    id serial primary key,
    name text not null,
    email text unique not null,
    created_at timestamptz default now()
  );`,
  forms: `create table if not exists forms (
    id serial primary key,
    title text not null,
    questions jsonb not null,
    created_by text ,
    created_at timestamptz default now()
  );`,
  responses: `create table if not exists responses (
    id serial primary key,
    form_no integer ,
    responses jsonb not null,
    filled_by text not null,
    created_at timestamptz default now()
  );`,
};

async function createTables() {
  if (databaseUrl) {
    try {
      const client = new Client({ connectionString: databaseUrl });
      await client.connect();
      await client.query(CREATE_TABLE.login);
      await client.query(CREATE_TABLE.forms);
      await client.query(CREATE_TABLE.responses);
      await client.end();
      console.log('Created tables "login", "forms", and "responses"');
      return;
    } catch (err) {
      console.error("Error creating tables:", err.message || err);
    }
  }
}

(async () => {
  await createTables();

  app.locals.supabase = supabase;
  app.locals.tables = {
    login: "login",
    forms: "forms",
    responses: "responses",
  };


  app.post("/forms", async (req, res) => {
    const { title, questions, email } = req.body;
    const { data, error } = await supabase
      .from("forms")
      .insert([{ title, questions, created_by: email }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  });

  app.post("/responses", async (req, res) => {
    const { form_no, responses, email } = req.body;
    const { data, error } = await supabase
      .from("responses")
      .insert([{ form_no, responses, filled_by: email }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  });

  app.get("/forms/:id", async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  });

    app.put("/forms/:id", async (req, res) => {
    const { id } = req.params;
    const { title, questions } = req.body;
    const { data, error } = await supabase
      .from("forms")
      .update({ title, questions })
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  });


  app.get("/my-forms/:email", async (req, res) => {
    const { email } = req.params;
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("created_by", email);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  });


  app.post("/signin", async (req, res) => {
    try {

      const { code } = req.body;
      const tokenresponse = await fetch(
        "https://auth.delta.nitt.edu/api/oauth/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "http://localhost:5173/signin",
          }),
        }
      );
      const tokendata = await tokenresponse.json();

      const userresponse = await fetch(
        "https://auth.delta.nitt.edu/api/resources/user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokendata.access_token}`,
          },
        }
      );
      const userdata = await userresponse.json();

      if (userdata && userdata.email && userdata.name) {
        const { error } = await supabase
          .from("login")
          .insert([{ name: userdata.name, email: userdata.email }]);

        if (error && error.code !== "23505") {
          console.error("Error inserting user data:", error);
        }

        const userdetails = {
          name: userdata.name,
          email: userdata.email,
        };

        return res.json({
          status: "success",
          user: userdetails,
        });
      } else {
        return res
          .status(400)
          .json({ status: "error", error: "Invalid user data from DAuth" });
      }
    } catch (e) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();