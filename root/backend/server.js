import express from "express";
import recipeRouter from "./routes/recipes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const root = '../'

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Leave this in for now in case I need it to serve static files for frontend later, delete if unneccessary
// app.use(express.static('frontend/', { root: root }))

app.get('^/$|/index.(html)?', (req, res) => {
    res.sendFile('frontend/index.html', { root: root })
})

app.get('/page2(.html)?', (req, res) => {
    res.sendFile('frontend/page2.html', { root: root });
})

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});