const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all menu items
router.post('/message', async (req, res, next) => {
    const {name, email, body} = req.body;
   try {
    const message = await prisma.message.create({
        data:{
            name: name,
            email: email,
            body: body,
        }
    })
    res.json(message)
   } catch (error) {
    console.log(error)
   }
  });
  
  module.exports = router;