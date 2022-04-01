import React from 'react'
import styled from 'styled-components'

const Button = styled.a`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #aaa;
  background: transparent;
  padding: 8px;
  font-size: 20px;
  text-decoration: none;
  text-align: center;
  display: block;
  color: black;
  margin-top: 16px;

  :visited {
    color: black;
  }
`

export default function DownloadPdf ({ label = 'Download PDF', link }) {
  return (
    <Button
      href={link}
      target="_blank"
    >
      {label}
    </Button>
  )
}
