require('dotenv').config()

const axios = require('axios')
const { WebSocket } = require('ws')

const API_URL = process.env.DERIBIT_API_TEST
const CLIENT_ID = process.env.DERIBIT_CLIENT_ID
const CLIENT_SECRET = process.env.DERIBIT_CLIENT_SECRET

async function getToken() {
  var msg = {
    jsonrpc: '2.0',
    id: 9929,
    method: 'public/auth',
    params: {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    },
  }

  try {
    const {
      data: { result },
    } = await axios.post(API_URL, msg)
    return result.access_token
  } catch (err) {
    console.log({ err })
  }
}

function use({ token }) {
  function socketAuth() {
    const ws = new WebSocket('wss://test.deribit.com/ws/api/v2')
    const msg = {
      jsonrpc: '2.0',
      id: 9929,
      method: 'public/auth',
      params: {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    }

    ws.onmessage = function (e) {
      console.log('received from server xx: ', e.data)
    }
    ws.onopen = function () {
      ws.send(JSON.stringify(msg))
    }
  }

  async function getIndexPrice(indexName) {
    const msg = {
      method: 'public/get_index_price',
      params: {
        index_name: indexName,
      },
      jsonrpc: '2.0',
      id: 6,
    }

    try {
      const { data } = await axios.post(API_URL, msg, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      return data
    } catch (err) {
      console.log(err)
    }
  }

  function subscribeBtcUsd() {
    const ws = new WebSocket('wss://test.deribit.com/ws/api/v2')
    // console.log(token + '')

    const msg = {
      jsonrpc: '2.0',
      id: 4235,
      method: 'private/subscribe',
      params: {
        channels: ['deribit_price_index.btc_usd'],
        scope:
          'block_trade:read connection custody:read mainaccount trade:read',
        token_type: 'bearer',
        access_token: token,
      },
    }
    ws.onmessage = function (e) {
      // do something with the response...
      console.log('received from server : ', e.data)
    }
    ws.onopen = function () {
      ws.send(JSON.stringify(msg))
    }
  }

  return {
    getIndexPrice,
    subscribeBtcUsd,
    socketAuth,
  }
}

module.exports = { use, getToken }

//   function setToken({ token }) {
//     ACCESS_TOKEN = token;
//     const client = axios.create({
//       baseURL: API_URL,
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     return client;
//   }
