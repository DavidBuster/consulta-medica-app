import React from 'react'
import './ExpandIcon.css'

export const ExpandIcon = ({ expanded }) => {
	return (
		<div
			className={`flex justify-center items-center relative ${
				expanded ? 'expanded' : ''
			}`}
			style={{
				height: '10px',
				width: '10px'
			}}
		>
			<div
				className='crossHor'
				style={{
					height: '1px',
					width: '100%'
				}}
			/>
			<div
				className='crossVert'
				style={{
					height: '100%',
					width: '1px'
				}}
			/>
		</div>
	)
}
