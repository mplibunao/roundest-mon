import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import React from 'react'
import Image from 'next/image'

const Home: NextPage = () => {
	const [[first, second], setIds] = React.useState<number[]>([0, 0])

	React.useEffect(() => {
		setIds(getOptionsForVote())
	}, [])

	const firstPokemon = trpc.useQuery(['get-pokemon-by-id', { id: first }])
	const secondPokemon = trpc.useQuery(['get-pokemon-by-id', { id: second }])

	if (firstPokemon.isLoading || secondPokemon.isLoading) {
		return null
	}

	const voteForRoundest = (selected: number) => {
		// todo fire mutation to persist changes

		setIds(getOptionsForVote())
	}

	console.log('firstPokemon', firstPokemon) // eslint-disable-line no-console
	return (
		<div className='flex-col justify-center w-screen h-screen flex items-center'>
			<div className='text-2xl'>Which Pokemon is rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				<div className='w-64 h-64 flex flex-col items-center'>
					<Image
						src={firstPokemon.data?.sprites.front_default as string}
						className='w-full'
						alt='1st pokemon image to vote on'
						height={256}
						width={256}
					/>
					<div className='capitalize text-xl text-center mt-[-2rem]'>
						{firstPokemon.data?.name}
					</div>
					<button
						className='inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
						onClick={() => voteForRoundest(first)}
					>
						Rounder
					</button>
				</div>
				<div className='p-8'>Vs</div>
				<div className='w-64 h-64 flex flex-col items-center'>
					<Image
						src={secondPokemon.data?.sprites.front_default as string}
						alt='2nd pokemon image to vote on'
						height={256}
						width={256}
					/>
					<div className='capitalize text-xl text-center mt-[-2rem]'>
						{secondPokemon.data?.name}
					</div>
					<button
						className='inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
						onClick={() => voteForRoundest(second)}
					>
						Rounder
					</button>
				</div>
				<div className='p-2' />
			</div>
		</div>
	)
}

export default Home
