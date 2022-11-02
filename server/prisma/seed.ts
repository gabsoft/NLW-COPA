import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://github.com/gabsoft'
        }
    })

    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerId: user.id,
            participants: { // forma mais rápida de associar um registro de uma tabela a outra sem precisar montar a variável como lá abaixo "participant"
                create: {
                    userId: user.id
                }
            }

        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-03T18:00:00.637Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'
        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-04T18:00:00.637Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

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

    // const participant = await prisma.participant.create({ // forma de criar um participante relacionando pelos ids
    //     data: {
    //         poolId: pool.id,
    //         userId: user.id
    //     }
    // })
}

main()