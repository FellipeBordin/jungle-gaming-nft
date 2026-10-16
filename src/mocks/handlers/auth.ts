
import { http, HttpResponse, delay } from 'msw'

interface User {
  id: string
  name: string
  email: string
}

interface StoredUser extends User {
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface LoginRequest {
  email: string
  password: string
}

const USERS_KEY = 'kurio_mock_users'

function getUsers(): StoredUser[] {
  try {
    const saved = localStorage.getItem(USERS_KEY)

    return saved ? (JSON.parse(saved) as StoredUser[]) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function publicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export const authHandlers = [
  // CADASTRO
  http.post('/api/auth/register', async ({ request }) => {
    await delay(500)

    const body = (await request.json()) as RegisterRequest

    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (
      !name ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !password ||
      password.length < 6
    ) {
      return HttpResponse.json(
        { message: 'Informe dados válidos e uma senha de pelo menos 6 caracteres.' },
        { status: 400 },
      )
    }

    const users = getUsers()

    if (users.some((user) => user.email === email)) {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado.' },
        { status: 409 },
      )
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    }

    saveUsers([...users, newUser])

    return HttpResponse.json(
      {
        user: publicUser(newUser),
        token: `mock-token-${newUser.id}`,
      },
      { status: 201 },
    )
  }),

  // LOGIN
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)

    const body = (await request.json()) as LoginRequest

    const email = body.email?.trim().toLowerCase()
    const password = body.password

    const user = getUsers().find(
      (item) =>
        item.email === email && item.password === password,
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos.' },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      user: publicUser(user),
      token: `mock-token-${user.id}`,
    })
  }),

  // CONSULTAR USUÁRIO AUTENTICADO
  http.get('/api/auth/me', async ({ request }) => {
    await delay(200)

    const authorization = request.headers.get('Authorization')

    if (!authorization?.startsWith('Bearer mock-token-')) {
      return HttpResponse.json(
        { message: 'Não autorizado.' },
        { status: 401 },
      )
    }

    const userId = authorization.replace(
      'Bearer mock-token-',
      '',
    )

    const user = getUsers().find(
      (item) => item.id === userId,
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'Usuário não encontrado.' },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      user: publicUser(user),
    })
  }),
]
