import express from 'express';
import { askTutor } from '../services/aiService';


const router = express.Router();


router.post("/chat",async(req,res)=> {
    const { messages,history} = req.body;


    try {
        const reply  = await askTutor(messages,history);
        res.json({reply})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error:"AI tutor failed"});
    }
});


export default router;