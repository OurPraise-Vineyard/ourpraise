import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
  width: 100%;
  background: rgb(159,159,159);
  background: linear-gradient(0deg, rgba(159,159,159,1) 0%, rgba(170,170,170,1) 35%, rgba(171,171,171,1) 100%);
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  padding: 10px 20px 10px 10px;
  color: white;
  border: 0;
  border-radius: 4px;
  margin: 0;
  cursor: pointer;
  font-size: 20px;
`

export default function BackButton () {
  const { songId } = useParams()
  const navigate = useNavigate()

  const handleBack = () => {
    if (songId) {
      navigate('/home')
    }
  }

  return (
    <Button onClick={handleBack}>
      &larr; Back
    </Button>
  )
}
