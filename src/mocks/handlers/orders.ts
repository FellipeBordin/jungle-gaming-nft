
import { http, HttpResponse, delay } from 'msw'

interface OrderItem {
  nftId: string
  quantity: number
}

interface CreateOrderRequest {
  name: string
  email: string
  wallet: string
  items: OrderItem[]
}

interface StoredOrder {
  id: string
  name: string
  email: string
  wallet: string
  items: OrderItem[]
  status: 'confirmed'
  createdAt: string
}

const ORDERS_KEY = 'kurio_mock_orders'

function getStoredOrders(): StoredOrder[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY)

    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)

    return Array.isArray(parsed)
      ? (parsed as StoredOrder[])
      : []
  } catch {
    return []
  }
}

function saveOrders(orders: StoredOrder[]) {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders),
  )
}

export const orderHandlers = [
  // CRIAR PEDIDO
  http.post('/api/orders', async ({ request }) => {
    await delay(600)

    const body =
      (await request.json()) as CreateOrderRequest

    if (
      !body.name?.trim() ||
      !body.email?.trim() ||
      !body.wallet?.trim() ||
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.some(
        (item) =>
          !item.nftId ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1,
      )
    ) {
      return HttpResponse.json(
        { message: 'Dados do pedido inválidos.' },
        { status: 400 },
      )
    }

    const order: StoredOrder = {
      id: `KUR-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      wallet: body.wallet.trim(),
      items: body.items,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    const orders = getStoredOrders()

    saveOrders([order, ...orders])

    return HttpResponse.json(
      {
        id: order.id,
        status: order.status,
        message: 'Pedido confirmado com sucesso.',
      },
      { status: 201 },
    )
  }),

  // LISTAR PEDIDOS
  http.get('/api/orders', async ({ request }) => {
    await delay(350)

    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    if (!email?.trim()) {
      return HttpResponse.json(
        { message: 'E-mail obrigatório.' },
        { status: 400 },
      )
    }

    const orders = getStoredOrders()

    const userOrders = orders.filter(
      (order) =>
        order.email === email.trim().toLowerCase(),
    )

    return HttpResponse.json(userOrders)
  }),
]
