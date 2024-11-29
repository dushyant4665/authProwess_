import React from 'react'

const Label = ({htmlfor,title}) => {
  return (
    <div>
        <label htmlFor={htmlfor} className='block text-sm font-medium leading-6 text-white mt-2'> {title} </label>
        
        
    </div>
  )
}

export default Label
