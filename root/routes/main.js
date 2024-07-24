import express from "express";

const router = express.Router();
const root = './';

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile('view/index.html', { root: root });
  })

router.get('/page2(.html)?', (req, res) => {
    res.sendFile('view/page2.html', { root: root });
})

export default router;