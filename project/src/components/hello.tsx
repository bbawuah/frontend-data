import React from 'react'

interface Props {
  title: string
}

export const Hello: React.FC<Props> = ({ title }) => {
  return (
    <div className="hello">
      <div className="greeting">
        <h1>{title}</h1>
        <div className="wrapper"></div>
      </div>
    </div>
  )
}
