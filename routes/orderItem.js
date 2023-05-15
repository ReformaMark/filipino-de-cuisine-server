const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/orderItem', async (req, res) => {
  const { userId, quantity, menuItemId } = req.body;

  try {
    const existingOrderItem = await prisma.orderItem.findFirst({
      where: {
        userId,
        orderId: null,
        menuItemId,
      },
    });

    if (existingOrderItem) {
      const updatedOrderItem = await prisma.orderItem.update({
        where: {
          id: existingOrderItem.id,
        },
        data: {
          quantity: existingOrderItem.quantity + quantity,
        },
        include: {
          menuItem: true,
        },
      });

      res.status(200).json(updatedOrderItem);
    } else {
      const menuItem = await prisma.menuItem.findUnique({
        where: {
          id: menuItemId,
        },
        select: {
          price: true,
        },
      });

      const totalprice = menuItem.price * quantity;

      const newOrderItem = await prisma.orderItem.create({
        data: {
          userId,
          quantity,
          price: totalprice,
          discount: 0.0,
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

      res.status(201).json(newOrderItem);
    }
  } catch (error) {
    console.error(error);
    console.log(error.message);
    res.status(500).json({ message: 'Error creating/updating order item.' });
  }
});

router.put('/orderitem/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
  
    try {
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: parseInt(id) },
        include: { menuItem: true },
      });
  
      const price = orderItem.menuItem.price * parseInt(quantity);
      const updatedOrderItem = await prisma.orderItem.update({
        where: { id: parseInt(id) },
        data: {
          quantity: parseInt(quantity),
          price: price,
        },
        include: { menuItem: true },
      });
  
      res.status(200).json(updatedOrderItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update order item' });
    }
  });

router.delete('/orderitem/:id', async (req, res) => {
const { id } = req.params;

try {
    const deletedOrderItem = await prisma.orderItem.delete({
    where: { id: parseInt(id) },
    });

    res.status(200).json(deletedOrderItem);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete order item' });
}
});


router.get('/orderItem', async (req, res, next) => {
    try {      
      const orderItems = await prisma.orderItem.findMany({
       include: {
        menuItem: true
       }
      });
      res.json(orderItems);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Failed to get order items' });
    }
  });


  router.get('/orderItems/:category', async (req, res) => {
    const {category}= req.params
    try {
      const orderItems = await prisma.orderItem.findMany({
        where:{
          menuItem:{
            is:{
              category: category,
            }
          }
        },
        include: {
          menuItem: true,
        },
      });
  
      const uniqueMenuItems = orderItems.reduce((unique, orderItem) => {
        const menuItem = orderItem.menuItem;
  
        if (!unique.some((item) => item.id === menuItem.id)) {
          unique.push(menuItem);
        }
  
        return unique;
      }, []);
  
      res.send(uniqueMenuItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error getting order items.' });
    }
  });


  router.get('/most-ordered-item', async (req, res) => {
    try {
      const mostOrderedItems = await prisma.menuItem.findMany({
        include: {
          orderItems: true,
        },
        orderBy: {
          orderItems: {
            _count: 'desc',
          },
        },
        take: 1,
      });
  
      res.json(mostOrderedItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports = router;