import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import React from 'react'
import Image from 'next/image'
import { inferQueryResponse } from './api/trpc/[trpc]'

const Home: NextPage = () => {
	const [[first, second], setIds] = React.useState<number[]>([0, 0])

	React.useEffect(() => {
		setIds(getOptionsForVote())
	}, [])

	const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
	const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])

	const voteForRoundest = (selected: number) => {
		// todo fire mutation to persist changes

		setIds(getOptionsForVote())
	}

	return (
		<div className='flex-col justify-center w-screen h-screen flex items-center'>
			<div className='text-2xl'>Which Pokemon is rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				{!firstPokemon.isLoading &&
					firstPokemon.data &&
					!secondPokemon.isLoading &&
					secondPokemon.data && (
						<>
							<PokemonListing
								pokemon={firstPokemon.data}
								vote={() => voteForRoundest(first)}
							/>
							<div className='p-8'>Vs</div>
							<PokemonListing
								pokemon={secondPokemon.data}
								vote={() => voteForRoundest(second)}
							/>
						</>
					)}
				<div className='p-2' />
			</div>
		</div>
	)
}

interface PokemonListingProps {
	pokemon: inferQueryResponse<'get-pokemon-by-id'>
	children?: React.ReactNode
	vote: () => void
}

export const PokemonListing = ({
	pokemon,
	vote,
}: PokemonListingProps): JSX.Element => {
	return (
		<div className='w-64 h-64 flex flex-col items-center'>
			<Image
				src={pokemon.sprites.front_default as string}
				alt='1st pokemon image to vote on'
				height={256}
				width={256}
			/>
			<div className='capitalize text-xl text-center mt-[-2rem]'>
				{pokemon.name}
			</div>
			<button
				className='inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
				onClick={() => vote()}
			>
				Rounder
			</button>
		</div>
	)
}

export default Home
