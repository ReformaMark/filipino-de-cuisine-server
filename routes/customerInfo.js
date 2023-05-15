const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/customerinfo', async (req, res) => {
  const { id, dateOfBirth, defaultContactNumber, defaultAddress } = req.body;

  try {
    const customerInfo = await prisma.customerInfo.create({
      data: {
        id,
        dateOfBirth,
        defaultContactNumber,
        defaultAddress,
      },
    });

    res.json(customerInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create customer information' });
  }
});

router.put('/customerInfo/:id', async(req,res) =>{
  const { id } = req.params;
  const { name, defaultAddress, defaultContactNumber, dateOfBirth } = req.body;
  try {
    const customerInfo = await prisma.orderItem.findUnique({
      where: { id: id }
    });

    const updateCustomerInfo = await prisma.orderItem.update({
      where: { id: id },
      data: {
        name: name,
        defaultAddress: defaultAddress,
        defaultContactNumber: defaultContactNumber,
        dateOfBirth: dateOfBirth,
      },
    });

    res.status(200).json(updateCustomerInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update customer info' });
  }
});

router.put('/customerInfo/:id/account', async(req,res) =>{
  const { id } = req.params;
  const {  defaultAddress, defaultContactNumber } = req.body;
  try {

    const updateCustomerInfo = await prisma.customerInfo.update({
      where: { id: id },
      data: {
        defaultAddress: defaultAddress,
        defaultContactNumber: defaultContactNumber,
      },
    });

    res.status(200).json(updateCustomerInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update customer info' });
  }
});
router.get('/customerInfo/:id', async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const customerInfo = await prisma.customerInfo.findUnique({
        where: {
          id,
        },
      });
  
      if (!customerInfo) {
        return res.status(404).json({ error: 'Customer information not found' });
      }
      console.log(customerInfo);
      res.send(customerInfo);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
module.exports = router;