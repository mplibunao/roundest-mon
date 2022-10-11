import { GetStaticProps } from 'next'
import { prisma } from '@/backend/utils/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'
import Image from 'next/image'

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

export interface ResultsPageProps {
	pokemon: PokemonQueryResult
}

export default function ResultsPage({
	pokemon,
}: ResultsPageProps): JSX.Element {
	return (
		<div className='flex flex-col items-center'>
			<h2 className='text-2xl p-4'>ResultsPage</h2>

			<div className='flex flex-col max-w-2xl w-full border'>
				{pokemon
					.sort((a, b) => generateCountPercent(b) - generateCountPercent(a))
					.map((currentPokemon, rank) => (
						<PokemonListing
							pokemon={currentPokemon}
							key={currentPokemon.id}
							rank={rank + 1}
						/>
					))}
			</div>
		</div>
	)
}

const getPokemonInOrder = async () => {
	return prisma.pokemon.findMany({
		orderBy: { voteFor: { _count: 'desc' } },
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			_count: {
				select: {
					voteFor: true,
					voteAgainst: true,
				},
			},
		},
	})
}

export const getStaticProps: GetStaticProps<ResultsPageProps> = async () => {
	const pokemonOrdered = await getPokemonInOrder()

	return {
		props: { pokemon: pokemonOrdered },
		revalidate: 60,
	}
}

interface PokemonListingProps {
	pokemon: PokemonQueryResult[number]
	rank: number
}

const PokemonListing = ({ pokemon, rank }: PokemonListingProps) => {
	return (
		<div className='flex border-b p-2 items-center justify-between'>
			<div className='flex items-center'>
				<Image
					src={pokemon.spriteUrl}
					width={64}
					height={64}
					alt={`${pokemon.name} is rank ${rank} in roundness`}
					layout='fixed'
				/>
				<div className='capitalize'>{pokemon.name}</div>
			</div>
			<div className='pr-4'>{`${generateCountPercent(pokemon).toFixed(
				2
			)}%`}</div>
		</div>
	)
}

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
	const { voteFor, voteAgainst } = pokemon._count

	if (voteFor + voteAgainst === 0) {
		return 0
	}

	return (voteFor / (voteAgainst + voteFor)) * 100
}
