import express from "express";

const router = express.Router();
const root = "./";

router.get('^/$|/login(.html)?', (req, res) => {
    res.sendFile('login.html', { root: root });
})

router.get('signup(.html)?', (req, res) => {
    res.sendFile('login/signup.html', { root: root });
})

export default router;