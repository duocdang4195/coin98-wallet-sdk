const { io } = require('socket.io-client')

let socketService

const useSocket = () => {
  const emitGasPrice = (chain) => {
    return new Promise(async (resolve, reject) => {
      socketService.emit('gas_price', chain, (gas) => {
        resolve(gas)
      })
    })
  }

  const emitTxs = (txs) => {
    socketService.emit('tracking_txs', txs)
  }

  const emitCoinMarket = (id) => {
    required(id, 0)

    return new Promise((resolve) => {
      socketService.emit('market_info', id, (data) => {
        return resolve(data)
      })
    })
  }

  const activeSocket = (isReconnect = true) => {
    try {
      if (socketService) {
        socketService.removeAllListeners()
        socketService.disconnect()
        socketService = null
      }

      setTimeout(() => {
        if (isReconnect) {
          socketService = io('https://socket.c98staging.dev', {
            transports: ['websocket']
          })

          socketService.on('connect', async () => {

          })
        }
      }, 500)
    } catch (error) {
      activeSocket(true)
    }
  }

  return {
    emitGasPrice,
    emitTxs,
    emitCoinMarket,
    activeSocket
  }
}

export default useSocket
