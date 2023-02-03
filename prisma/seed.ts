import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John fulis',
      email: 'john.fulis@gmail.com',
      avatarUrl: 'https://github.com/velosos.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Pool test 1',
      code: 'BOL321',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2023-03-09T14:00:00.201Z',
      firstTeam: 'DE',
      secondTeam: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2023-03-01T14:00:00.201Z',
      firstTeam: 'BR',
      secondTeam: 'AR',
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 4,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}
main()