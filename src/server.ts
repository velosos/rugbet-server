import Fastify from "fastify"
import cors from "@fastify/cors"
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
  log: ['query'],
})

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })


  await fastify.register(cors, {
    origin: true,
  })

  fastify.get('/bets/count', async () => {
    const count = await prisma.pool.count()
    return { count }
  })

  fastify.get('/user/count', async () => {
    const count = await prisma.user.count()
    return { count }
  })

  fastify.get('/guess/count', async () => {
    const count = await prisma.guess.count()
    return { count }
  })

  fastify.post('/bets', async (request, reply) => {
    const createBetsBody = z.object({
      title: z.string(),
    })
    const { title } = createBetsBody.parse(request.body)
    const generate = new ShortUniqueId({ length: 4 })
    const code = String(generate()).toUpperCase()
    await prisma.pool.create({
      data: {
        title,
        code
      }
    })
    return reply.status(201).send({ code })

  })

  await fastify.listen({ port: 3333, host: '0.0.0.0' })

}

bootstrap()