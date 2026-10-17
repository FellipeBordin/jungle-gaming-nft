
const { Server } = require('socket.io')
const http = require('node:http')

const PORT = Number(process.env.PORT || 3001)

// Servidor HTTP
const httpServer = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
    })

    res.end('Kurio Socket.IO ativo')
})

// Configuração do Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: [
            'http://localhost:5173',
            'https://jungle-gaming-nft.vercel.app',
        ],
        methods: ['GET', 'POST'],
    },
})

// Conexão dos clientes
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)

    // Preparação para acompanhar atualizações de pedidos
    socket.on('order.subscribe', ({ orderId } = {}) => {
        if (typeof orderId !== 'string' || !orderId.trim()) {
            return
        }

        socket.join(`order:${orderId}`)

        console.log(`Cliente inscrito no pedido ${orderId}`)
    })

    // Desconexão
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id)
    })
})

// IDs dos NFTs
const nftIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

// Controle de versão individual de cada NFT
const nftVersions = new Map(
    nftIds.map((id) => [id, 100]),
)

let currentIndex = 0
let previousNftId = null

// Envia atualização de disponibilidade
function emitNFTUpdate(nftId, available) {
    const version = (nftVersions.get(nftId) ?? 100) + 1

    nftVersions.set(nftId, version)

    const event = {
        nftId,
        version,
        available,
        updatedAt: new Date().toISOString(),
    }

    io.emit('nft.updated', event)

    console.log(
        `NFT ${nftId}: ${available === 0 ? 'Indisponível' : 'Disponível'
        }`,
    )
}

// Simula atualizações em tempo real
setInterval(() => {
    // Libera o NFT anterior
    if (previousNftId !== null) {
        emitNFTUpdate(previousNftId, 5)
    }

    // Indisponibiliza o próximo NFT
    const currentNftId = nftIds[currentIndex]

    emitNFTUpdate(currentNftId, 0)

    previousNftId = currentNftId

    currentIndex = (currentIndex + 1) % nftIds.length
}, 10000)


const orders = new Map()

httpServer.on('request', (req, res) => {
    // As rotas HTTP serão configuradas na próxima etapa.
})
// Inicia o servidor
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Socket.IO ativo na porta ${PORT}`)
})
