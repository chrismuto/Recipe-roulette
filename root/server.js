import express from "express";
import login from "./routes/login.js";
import main from "./routes/main.js";
import user from "./routes/api/user.js";
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
app.use('/login', login);
app.use('/model/users', user);

// app.get('/*', (req, res) => {
  // res.status(404).sendFile(add 404 page here)
// })

// add errorHandler functions here later if needed with app.use

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});