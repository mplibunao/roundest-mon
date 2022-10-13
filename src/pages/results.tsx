import { GetStaticProps } from 'next'
import { prisma } from '@/backend/utils/prisma'
import { AsyncReturnType } from '@/utils/ts-bs'
import Image from 'next/image'
import SEO from '@/components/SEO'

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>

export interface ResultsPageProps {
	pokemon: PokemonQueryResult
}

export default function ResultsPage({
	pokemon,
}: ResultsPageProps): JSX.Element {
	return (
		<>
			<SEO
				title='Results'
				description='View the voting results on which pokemon is roundest'
			/>
			<div className='flex flex-col items-center'>
				<h2 className='text-2xl p-4'>ResultsPage</h2>

				<div className='flex flex-col max-w-2xl w-full border'>
					{pokemon
						.sort((a, b) => {
							const difference =
								generateCountPercent(b) - generateCountPercent(a)

							if (difference === 0) {
								return b._count.voteFor - a._count.voteFor
							}

							return difference
						})
						.map((currentPokemon, rank) => (
							<PokemonListing
								pokemon={currentPokemon}
								key={currentPokemon.id}
								rank={rank + 1}
							/>
						))}
				</div>
			</div>
		</>
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
		revalidate: 60 * 60 * 24,
	}
}

interface PokemonListingProps {
	pokemon: PokemonQueryResult[number]
	rank: number
}

const PokemonListing = ({ pokemon, rank }: PokemonListingProps) => {
	return (
		<div className='relative flex border-b p-2 items-center justify-between'>
			<div className='flex items-center'>
				<div className='flex items-center pl-4'>
					<Image
						src={pokemon.spriteUrl}
						width={64}
						height={64}
						alt={`${pokemon.name} is rank ${rank} in roundness`}
						layout='fixed'
					/>
					<div className='pl-2 capitalize'>{pokemon.name}</div>
				</div>
			</div>
			<div className='pr-4'>
				{`${generateCountPercent(pokemon).toFixed(2)}%`}
			</div>
			<div className='absolute top-0 left-0 z-20 flex items-center justify-center px-2 font-semibold text-white bg-gray-600 border border-gray-500 shadow-lg rounded-br-md'>
				{rank}
			</div>
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
