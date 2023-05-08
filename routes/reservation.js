const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { DateTime } = require('luxon');

router.post('/booking', async (req, res) => {
    const { selectedDate, selectedTimeslots,selectedTableSlots, customerId, additionalNotes, paymentIntentId } = req.body
  
   /*    const createReservation = await prisma.reservation.create({
            data:{
                customerId,
                fee,
                paymentStatus: "Fulfilled",
                additionalNotes,
                paymentIntentId,
            }
        })
     */
        try {
            const data = selectedTableSlots.map((tableSlotId) => {
             return selectedTimeslots.map((timeSlot) =>{
                const endIsoDate = DateTime.fromISO(timeSlot, {
                    setZone: true,
                })
                .plus({
                    hour: 1,
                })
                .toISO()

                if(!endIsoDate) throw new Error("Computed invalid end time")

                return {
                    startIsoDate: timeSlot,
                    endIsoDate,
                    reservationTableId: tableSlotId,
                }
             }) 
            })
            .flat(1)

            const resevation = await prisma.reservation.create({
                data: {
                    customerId: customerId,
                    paymentIntentId: paymentIntentId,
                    fee: 150,
                    selectedDate,
                    paymentStatus: "Fulfilled",
                    additionalNotes: additionalNotes,
                    reservationSlots: {
                        createMany: {
                        data,
                        },
                    },
                },
                include: {
                    reservationSlots: true,
                    
                }
            })
          
          
            res.json(resevation);
          } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
          }
        
  })


router.get('/reservationSlot', async(req, res)=>{
    const { selectedTimeslots } = req.query;
    try {
        const reservationSlotsForSelectedTimeslots = await prisma.reservationSlot.findMany({
            where: {
                startIsoDate: {
                    in: selectedTimeslots
                }
            }
        })
        const reservationTables = await prisma.reservationTable.findMany()
        const availableReservationTableIds = reservationTables
          .filter(
            (reservationTable) =>
              !reservationSlotsForSelectedTimeslots.some(
                (reservationSlot) =>
                  reservationSlot.reservationTableId === reservationTable.id
              )
          )
          .map((reservationTable) => reservationTable.id)
        console.log(selectedTimeslots)
        res.send(availableReservationTableIds)
    } catch (error) {
        console.log(error)
    }

    
})

router.get('/reservations/:customerId', async(req,res)=>{
    const {customerId} = req.params;
    const getReservation = await prisma.reservation.findMany({
        where:{
            customerId: customerId
        },
        include:{
            reservationSlots: true,
            
        }
    })

    res.json(getReservation)
})

router.get('/reservation/:id', async(req,res)=>{
    const {id} = req.params;
    const getReservation = await prisma.reservation.findFirst({
        where:{
            id: parseInt(id)
        },
        include:{
            reservationSlots: {
                include:{
                    reservationTable: true
                }
            }
        }
    })

    res.json(getReservation)
})
router.put('/reservation/:id', async(req, res)=>{
    const {id} = req.params
    const updateReservationStatus = await prisma.reservation.update({
        where:{
            id: parseInt(id),
        },
        data:{
            attendedStatus: 'Cancelled',
        }
    })
    res.json(updateReservationStatus)
})
  
module.exports = router;