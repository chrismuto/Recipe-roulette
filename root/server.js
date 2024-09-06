import express from "express";
import login from "./routes/login.js";
import main from "./routes/main.js";
import user from "./routes/api/user.js";
import register from "./routes/register.js";
import auth from "./routes/auth.js";
// import recipeRouter from "./routes/recipes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const root = './';


//check https://www.youtube.com/watch?v=f2EqECiTBL8 for usage of middleware, 404 error section and cors options if I add later
// app.use(express.urlencoded({ extended: false }));

//possibly add cors options here, use separate config file and folder

app.use(express.json());

app.use(express.static('view', { root: root }));

app.use('/', main);
app.use('/register', register);
app.use('/auth', auth);
app.use('/login', login);
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

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});