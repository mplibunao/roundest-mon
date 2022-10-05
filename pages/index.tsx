import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
	return (
		<div className='flex-col justify-center w-screen h-screen flex items-center'>
			<div className='text-2xl'>Which Pokemon is rounder?</div>
			<div className='p-2' />
			<div className='border rounded p-8 flex justify-between max-w-2xl items-center'>
				<div className='w-16 h-16 bg-red-200' />
				<div className='p-8'>Vs</div>
				<div className='w-16 h-16 bg-red-200' />
			</div>
		</div>
	)
}

export default Home
