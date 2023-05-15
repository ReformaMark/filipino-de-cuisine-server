const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { DateTime } = require('luxon');

    router.post('/booking', async (req, res) => {
        const { selectedDate, selectedTimeslots,selectedTableSlots, customerId, additionalNotes, paymentIntentId } = req.body
    
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

                const reservationSelectedTables = selectedTableSlots.map(table => ({ table }));
                const reservationSelectedTimes = selectedTimeslots.map(time => ({ time }));
            
                const reservation = await prisma.reservation.create({
                  data: {
                    customerId,
                    paymentIntentId,
                    fee: 150,
                    selectedDate,
                    paymentStatus: "Fulfilled",
                    additionalNotes,
                    reservationSlots: {
                      createMany: {
                        data,
                      },
                    },
                    reservationSelectedTables: {
                      createMany: {
                        data: reservationSelectedTables,
                      },
                    },
                    reservationSelectedTimes: {
                      createMany: {
                        data: reservationSelectedTimes,
                      },
                    },
                  },
                  include: {
                    reservationSlots: true,
                    reservationSelectedTables: true,
                    reservationSelectedTimes: true,
                  },
                });

                res.json(reservation);
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

router.get('/reservationTable/:id', async(req, res)=>{
    const {id} = req.params;

    const getReservationTable = await prisma.reservationSelectedTable.findMany({
        where:{
            reservationId: parseInt(id),
        }
    })

    res.json(getReservationTable)
})
module.exports = router;