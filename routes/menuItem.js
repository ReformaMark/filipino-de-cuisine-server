const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all menu items
router.get('/menuItems', async (req, res, next) => {
   try {
    const menuItem = await prisma.menuItem.findMany({

    })
    res.json(menuItem)
   } catch (error) {
    next(error)
   }
  });
  
  module.exports = router;