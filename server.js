import express from "express";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "super-secret-key";

// Example hardcoded user
const user = {
  email: "admin@example.com",
  password: "123456",
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === user.email && password === user.password) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

app.get("/dashboard", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: "Welcome to the Dashboard!", user });
  });
});

app.listen(5000, () => console.log("Server running at http://localhost:5000"));