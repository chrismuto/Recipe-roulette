import env from "dotenv";
import express from "express";
// import login from "./routes/login.js";
import main from "./routes/main.js";
import user from "./routes/api/user.js";
import register from "./routes/register.js";
import auth from "./routes/auth.js";
import refresh from "./routes/refresh.js";
import logout from "./routes/logout.js";
import verifyJWT from "./middleware/verifyJWT.js";
import cookieParser from "cookie-parser";
// import recipeRouter from "./routes/recipes.js";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
const PORT = process.env.PORT || 3000;

env.config()

//connect to MongoDB
connectDB();

const app = express();
const root = './';


//check https://www.youtube.com/watch?v=f2EqECiTBL8 for usage of middleware, 404 error section and cors options if I add later
app.use(express.urlencoded({ extended: false }));

//possibly add cors options here, use separate config file and folder

app.use(express.json());

//middleware for cookies
app.use(cookieParser())

app.use(express.static('view', { root: root }));

app.use('/', main);
app.use('/register', register);
app.use('/auth', auth);
app.use('/refresh', refresh);
app.use('/logout', logout);
// app.use('/login', login);

app.use(verifyJWT);
app.use('/model/users', user);

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile('view/404.html', { root: root })
  } else if (req.accepts('json')) {
    res.json({ "error": "404 Not Found" })
  }
})

// add errorHandler functions here later if needed with app.use

mongoose.connection.once('open', () => {
  console.log(`connected to MongoDB`);
  app.listen(PORT, () => console.log(`Express server running at http://localhost:${PORT}/`));
});