import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import React from 'react'

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

	console.log('firstPokemon', firstPokemon) // eslint-disable-line no-console
	return (
		<div className='flex-col justify-center w-screen h-screen flex items-center'>
			<div className='text-2xl'>Which Pokemon is rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				<div className='w-64 h-64 flex flex-col'>
					<img
						src={firstPokemon.data?.sprites.front_default}
						className='w-full'
					/>
					<div className='capitalize text-xl text-center mt-[-2rem]'>
						{firstPokemon.data?.name}
					</div>
				</div>
				<div className='p-8'>Vs</div>
				<div className='w-64 h-64 flex flex-col'>
					<img
						src={secondPokemon.data?.sprites.front_default}
						className='w-full'
					/>
					<div className='capitalize text-xl text-center mt-[-2rem]'>
						{secondPokemon.data?.name}
					</div>
				</div>
				<div className='p-2' />
			</div>
		</div>
	)
}

export default Home
