const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/order', async (req, res) => {
  const { customerName, customerId, address, contactNumber, deliveryFee, paymentIntentId, additionalNotes } = req.body;

  try {
    const basketItems = await prisma.basketItem.findMany({
      where: {
        customerId,
      },
      include: {
        menuItem: true,
      },
    });

  

    const order = await prisma.order.create({
      data: {
        customerName: customerName,
        mode: 'Online',
        paymentStatus: 'Fulfilled',
        onlineOrders: {
          create: {
            customerId,
            address: address,
            contactNumber: contactNumber,
            paymentIntentId,
            deliveryFee,
            deliveryStatus: 'Pending',
            additionalNotes
          },
        },
      },
      include: {
        onlineOrders: true,
        orderItems: true, // include orderItems in the returned order object
      },
    });

    const orderItems = basketItems.map((basketItem) => ({
      orderId: order.id,
      menuItemId: basketItem.menuItemId,
      quantity: basketItem.quantity,
      price: basketItem.menuItem.price * basketItem.quantity,
      discount: 0.0,
  }));

    const createOrderItems = await prisma.orderItem.createMany({
      data: orderItems
    })

    // Delete the basket items
    await prisma.basketItem.deleteMany({
      where: {
        customerId,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order.' });
  }
});

  router.get('/orders/:id', async(req, res)=>{

    const { id } = req.params;

    const orders = await prisma.order.findMany({
        where: { 
          onlineOrders: {
               every: {
                customerId: id,
              },
            },  
        },
        include: {
            orderItems: true,
            onlineOrders: true
        }
    });

    console.log(orders)
    res.send(orders)
  })

router.get('/order/:orderId', async(req,res) =>{
  const { orderId } = req.params;

  const order = await prisma.order.findUnique({
    where:{
      id: parseInt(orderId)
    },
    include: {
        orderItems: {
          include:{
            menuItem: true
          }
        },
        onlineOrders: true
    }
  })
  console.log(order)
  res.send(order);
})

router.put('/order/:orderId' , async(req, res)=>{
  const {orderId} = req.params;
  const {status} = req.body;

  const updateOnlineOrderStatus = await prisma.order.update({
    where:{
    id: parseInt(orderId),
    },
    data:{
      onlineOrders:{
        deliveryFee: status
      }
    },
    include:{
      onlineOrders: true
    }
  })
  console.log(status)
  res.send(updateOnlineOrderStatus)
})
router.put('/order/:orderId/onlineOrder' , async(req, res)=>{
  const {orderId} = req.params;

  const updateOnlineOrderStatus = await prisma.onlineOrder.update({
    where:{
    id: parseInt(orderId),
    },
    data:{
      deliveryStatus: 'Cancelled'
    },
    include:{
      order: true,
    }
  })
  res.send(updateOnlineOrderStatus)
})
router.put('/order/:orderId/received' , async(req, res)=>{
  const {orderId} = req.params;

  const updateOnlineOrderStatus = await prisma.onlineOrder.update({
    where:{
    id: parseInt(orderId),
    },
    data:{
      deliveryStatus: 'Received'
    },
    include:{
      order: true,
    }
  })
  res.send(updateOnlineOrderStatus)
})
module.exports = router;