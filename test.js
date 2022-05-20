const deribit = require('./index')

;(async function () {
    //   const data = await deribitApi.socketConnect()
    //   const btcUsd = await deribitApi.subscribeBtcUsd()
    //   console.log(btcUsd)
    const token = await deribit.getToken()
    const deribitApi = deribit.use({ token: token })

    setTimeout(() => {
        deribitApi.subscribeBtcUsd()
    }, 2000) 
})()

