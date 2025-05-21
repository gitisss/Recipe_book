import express from "express";

export const login = (req: express.Request, res: express.Response): void => {
  checkLogIn(req, res);
};

const checkLogIn = (req: express.Request, res: express.Response): void => {
  console.log(req.body);

  const { username, password } = req.body;
  try {
    if (username === "admin" && password === "admin") {
      res.status(200).json({ message: "Login successful" });
    } else {
      console.log("Invalid credentials");
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
