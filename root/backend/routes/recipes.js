import express from "express";

const router = express.Router();

router.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const end = Date.now();
        const length = (end - start)/1000;
        console.log(`${req.method} ${req.url} Complete in ${length} seconds`);
    })
    next();
})

async function call() {
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    return response.json();
}

router.get('/', async (req, res, next) => {
    try {
        const recipeInfo = await call();
        res.json(recipeInfo);
    } catch(err) {
        next(err);
    }
})

export default router;