import { getOptionsForVote } from '@/utils/getRandomPokemon'
import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'
import React from 'react'

const Home: NextPage = () => {
	const [[first, second], setIds] = React.useState<number[]>([0, 0])

	React.useEffect(() => {
		setIds(getOptionsForVote())
	}, [])
	return (
		<div className='flex-col justify-center w-screen h-screen flex items-center'>
			<div className='text-2xl'>Which Pokemon is rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				<div className='w-16 h-16 bg-red-800'>{first}</div>
				<div className='p-8'>Vs</div>
				<div className='w-16 h-16 bg-red-800'>{second}</div>
			</div>
		</div>
	)
}

export default Home
