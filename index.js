const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()

app.use(express.json())


const orders = []

//Middleware para checar o id
const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const methodHttp = (request, response, next) => {
    const method = request.method
    const url = request.url

    console.log(`Method: ${method}, and Url: ${url}`)

    next()
}

app.get('/order', methodHttp, (request, response) => {
    return response.json(orders)
})

app.get('/order/:id', checkUserId, methodHttp, (request, response) => {
    const index = request.orderIndex
    const order = orders[index]
    return response.json(order)
})

app.post('/order', methodHttp, (request, response) => {
    const { clientOrder, clientName, price } = request.body

    const order = { id: uuid.v4(), clientOrder, clientName, price, status: "Em preparação" }

    orders.push(order) //push sobe os elementos da variavel pra o vetor

    return response.status(201).json(order)
})

app.put('/order/:id', checkUserId, methodHttp, (request, response) => {
    const { clientName, order, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatePedido = { id, clientName, order, price, status: "Em preparação" }

    orders[index] = updatePedido

    return response.json(updatePedido)
})

app.patch('/order/:id', checkUserId, methodHttp, (request, response) => {
    const index = request.orderIndex

    const order = orders[index]
    order.status = "Pedido Pronto"

    return response.json(order)
})

app.delete('/order/:id', checkUserId, methodHttp, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀 server started on port ${port}`)
})