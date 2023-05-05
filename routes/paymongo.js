const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');


const API_KEY = "sk_test_G4CzofaPsXhimUn9kud4zstc";

let paymentIntent;
let paymentMethodId;

router.post('/payment_intents', async (req, res) => {
  const {amount} = req.body;
    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/payment_intents',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${Buffer.from(API_KEY).toString(
          "base64"
        )}`,
      },
      data: {
        data: {
          attributes: {
            amount: amount,
            payment_method_allowed: ['atome', 'card', 'dob', 'paymaya', 'billease', 'gcash', 'grab_pay'],
            payment_method_options: {card: {request_three_d_secure: 'any'}},
            currency: 'PHP',
            capture_type: 'automatic'
          }
        }
      }
    };
    
    axios
      .request(options)
      .then(function (response) {
        paymentIntent = response.data.data.id;
        console.log(paymentIntent);
        res.send(paymentIntent);
      })
      .catch(function (error) {
        console.error(error);
      });
});

router.get('/payment_intents', async (req, res) => {
  const paymentIntentId = paymentIntent.id
  const options = {
    method: 'GET',
    url: `https://api.paymongo.com/v1/payment_intents/${paymentIntent.id}`,
    headers: {
      accept: 'application/json',
      authorization: `Basic ${Buffer.from(API_KEY).toString(
        "base64"
      )}`,
    }
  };
  
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      const paymentStatus = response.data.data.attributes.status;
      res.send({paymentIntentId, paymentStatus})
    })
    .catch(function (error) {
      console.error(error);
    });
});


router.post('/payment_methods', async(req, res) => {
  const { paymentMethod } = req.body;
  if(paymentMethod === "MAYA"){
    console.log(paymentMethod)
  const options = {
    method: 'POST',
    url: 'https://api.paymongo.com/v1/payment_methods',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: `Basic ${Buffer.from(API_KEY).toString(
        "base64"
      )}`,
    },
    data: {data: {attributes: {type: 'paymaya'}}}
  };
  
  axios
    .request(options)
    .then(function (response) {
      paymentMethodId = response.data.data.id
      console.log(response.data.data.id);
      res.send(paymentMethodId);
    })
    .catch(function (error) {
      console.error(error);
    });

  } else if(paymentMethod === "GCASH") {
    const options = {
      method: 'POST',
      url: 'https://api.paymongo.com/v1/payment_methods',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from(API_KEY).toString(
          "base64"
        )}`,
      },
      data: {data: {attributes: {type: 'gcash'}}}
    };
    
    axios
      .request(options)
      .then(function (response) {
        paymentMethodId = response.data.data.id
        console.log(response.data.data.id);
        res.send(paymentMethodId);
      })
      .catch(function (error) {
        console.error(error);
      });
      
  }
});


router.post('/attach_payment_method_intent', async(req, res) =>{

  const options = {
    method: 'POST',
    url: `https://api.paymongo.com/v1/payment_intents/${paymentIntent}/attach`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Basic c2tfdGVzdF9HNEN6b2ZhUHNYaGltVW45a3VkNHpzdGM6'
    },
    data: {
      data: {
        attributes: {
          payment_method: paymentMethodId,
          return_url: 'https://2fd7-136-158-8-106.ngrok-free.app'
        }
      }
    }
  };
  
  axios
    .request(options)
    .then(function (response) {
      paymentIntent = response.data.data
      console.log(paymentIntent);
      res.send(paymentIntent)
    })
    .catch(function (error) {
      console.error(error);
    });
  });

router.post('/source', async(req, res) =>{
  const options = {
    method: 'POST',
    url: 'https://api.paymongo.com/v1/sources',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Basic c2tfdGVzdF9HNEN6b2ZhUHNYaGltVW45a3VkNHpzdGM6'
    },
    data: {
      data: {
        attributes: {
          amount: 10000,
          redirect: {
            success: 'http://192.168.100.18:3000/api/',
            failed: 'http://192.168.100.18:3000/api/'
          },
          type: 'gcash',
          currency: 'PHP'
        }
      }
    }
  };
  
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data.data.attributes.next_action.url);
     
    })
    .catch(function (error) {
      console.error(error);
    });
})

module.exports = router;