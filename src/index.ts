import { Hono } from 'hono'
import todoRoutes from './routes/todo.route'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => {
  return c.text('OK')
})

app.get('/', (c) => {
  return c.json({ status: true, message: "todo api successfully!" })
})

app.route('/todo', todoRoutes)

export default app
