const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/basketItem', async (req, res) => {
  const { userId, quantity, menuItemId } = req.body;

  try {
    const existingBasketItem = await prisma.basketItem.findFirst({
      where: {
        customerId: userId,
        menuItemId,
      },
    });

    if (existingBasketItem) {
      const updatedBasketItem = await prisma.basketItem.update({
        where: {
          id: existingBasketItem.id,
        },
        data: {
          quantity: existingBasketItem.quantity + quantity,
        },
        include: {
          menuItem: true,
        },
      });

      res.status(200).json(updatedBasketItem);
    } else {
      const newBasketItem = await prisma.basketItem.create({
        data: {
          customerId: userId,
          quantity,
          menuItem: {
            connect: {
              id: menuItemId,
            },
          },
        },
        include: {
          menuItem: true,
        },
      });

      res.status(201).json(newBasketItem);
    }
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).json({ message: 'Error creating/updating basket item.' });
  }
});

router.put('/basketItem/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
  
    try {
      const basketItem = await prisma.basketItem.findUnique({
        where: { id: parseInt(id) },
        include: { menuItem: true },
      });
  
      const updatedBasketItem = await prisma.basketItem.update({
        where: { id: parseInt(id) },
        data: {
          quantity: parseInt(quantity),
        },
        include: { menuItem: true },
      });
  
      res.status(200).json(updatedBasketItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update order item' });
    }
  });

router.delete('/basketItem/:id', async (req, res) => {
const { id } = req.params;

try {
    const deletedBasketItem = await prisma.basketItem.delete({
    where: { id: parseInt(id) },
    });

    res.status(200).json(deletedBasketItem);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete order item' });
}
});


router.get('/basketItem', async (req, res, next) => {
    try {      
      const basketItems = await prisma.basketItem.findMany({
       include: {
        menuItem: true
       }
      });
      res.json(basketItems);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to get order items' });
    }
  });
module.exports = router;