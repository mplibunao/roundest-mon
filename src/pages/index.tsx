import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { inferQueryResponse } from './api/trpc/[trpc]'

const Home: NextPage = () => {
	const [[first, second], setIds] = React.useState<number[]>([0, 0])

	React.useEffect(() => {
		setIds(getOptionsForVote())
	}, [])

	const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
	const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])

	const voteMutation = trpc.useMutation(['cast-vote'])

	const voteForRoundest = (selected: number) => {
		if (selected === first) {
			voteMutation.mutate({ votedFor: first, votedAgainst: second })
		} else {
			voteMutation.mutate({ votedFor: second, votedAgainst: first })
		}

		setIds(getOptionsForVote())
	}

	return (
		<div className='flex-col justify-between w-screen h-screen flex items-center relative'>
			<div className='text-2xl pt-8'>Which Pokemon is rounder?</div>

			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				{firstPokemon.data && secondPokemon.data ? (
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
				) : (
					<Image src='/rings.svg' width={192} height={192} alt='loading...' />
				)}

				<div className='p-2' />
			</div>

			<div className='w-full text-xl text-center pb-2'>
				<Link
					href='https://twitter.com/mpradorbrandy'
					passHref
					target='_blank'
					rel='noopener noreferrer'
				>
					<a>Twitter</a>
				</Link>

				<span className='p-4'>-</span>

				<Link
					href='https://github.com/mplibunao/roundest-mon'
					target='_blank'
					rel='noopener noreferrer'
					passHref
				>
					<a>Github</a>
				</Link>

				<span className='p-4'>-</span>

				<Link href='/results' passHref>
					<a>Results</a>
				</Link>
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
				src={pokemon.spriteUrl}
				alt='1st pokemon image to vote on'
				height={256}
				width={256}
				layout='fixed'
				priority
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
