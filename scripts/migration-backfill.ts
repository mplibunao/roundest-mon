import { prisma } from '../src/backend/utils/prisma'

const migrationBackFill = async () => {
	const result =
		await prisma.$executeRaw`UPDATE Vote SET votedForId = votedFor, votedAgainstId = votedAgainst;`
	console.log('result', result) // eslint-disable-line no-console
}

migrationBackFill()
