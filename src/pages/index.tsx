import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { inferQueryResponse } from './api/trpc/[trpc]'

const Home: NextPage = () => {
	const {
		data: pokemonPair,
		refetch,
		isLoading,
	} = trpc.useQuery(['get-pokemon-pair'], {
		refetchInterval: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
	})

	const voteMutation = trpc.useMutation(['cast-vote'])

	const voteForRoundest = (selected: number) => {
		if (!pokemonPair) return

		const { firstPokemon, secondPokemon } = pokemonPair

		if (selected === firstPokemon.id) {
			voteMutation.mutate({
				votedFor: firstPokemon.id,
				votedAgainst: secondPokemon.id,
			})
		} else {
			voteMutation.mutate({
				votedFor: secondPokemon.id,
				votedAgainst: firstPokemon.id,
			})
		}

		refetch()
	}

	const fetchingNext = voteMutation.isLoading || isLoading

	return (
		<div className='flex-col justify-between w-screen h-screen flex items-center relative'>
			<div className='text-2xl pt-8 text-center'>Which Pokemon is rounder?</div>

			{pokemonPair ? (
				<div className='p-8 flex justify-between items-center max-w-2xl flex-col md:flex-row animate-fade-in'>
					<PokemonListing
						pokemon={pokemonPair.firstPokemon}
						vote={() => voteForRoundest(pokemonPair.firstPokemon.id)}
						disabled={fetchingNext}
					/>
					<div className='p-8 italic text-xl'>or</div>
					<PokemonListing
						pokemon={pokemonPair.secondPokemon}
						vote={() => voteForRoundest(pokemonPair.secondPokemon.id)}
						disabled={fetchingNext}
					/>
					<div className='p-2' />
				</div>
			) : (
				<Image src='/rings.svg' width={192} height={192} alt='loading...' />
			)}

			<div className='w-full text-xl text-center pb-2'>
				<Link
					href='https://twitter.com/mpradorbrandy'
					passHref
					target='_blank'
					rel='noopener noreferrer'
				>
					<a>Twitter</a>
				</Link>

				<span className='p-1'>-</span>

				<Link
					href='https://github.com/mplibunao/roundest-mon'
					target='_blank'
					rel='noopener noreferrer'
					passHref
				>
					<a>Github</a>
				</Link>

				<span className='p-1'>-</span>

				<Link href='/results' passHref>
					<a>Results</a>
				</Link>
			</div>
		</div>
	)
}

interface PokemonListingProps {
	pokemon: inferQueryResponse<'get-pokemon-pair'>['firstPokemon']
	children?: React.ReactNode
	vote: () => void
	disabled: boolean
}

export const PokemonListing = ({
	pokemon,
	vote,
	disabled,
}: PokemonListingProps): JSX.Element => {
	return (
		<div
			className={`flex flex-col items-center transition-opacity ${
				disabled && 'opacity-0'
			}`}
		>
			<div className='capitalize text-xl text-center mt-[-0.5rem]'>
				{pokemon.name}
			</div>

			<Image
				src={pokemon.spriteUrl}
				alt='1st pokemon image to vote on'
				height={256}
				width={256}
				layout='fixed'
				className='pixelated'
			/>

			<button
				className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
				onClick={() => vote()}
				disabled={disabled}
			>
				Rounder
			</button>
		</div>
	)
}

export default Home
