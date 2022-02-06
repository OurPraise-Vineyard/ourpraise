import React from 'react'
import { Link } from 'react-router-dom'
import LinkBase from 'Shared/LinkBase'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`

const Title = styled.h2`
  font-size: 24px;
`

const Items = styled.div`
  margin: 32px 0;
`

const Item = styled(Link)`
  border-bottom: 1px solid #AAAAAA;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  text-decoration: none;
  margin-bottom: 8px;
  transition: background-color .2s ease-in;

  :hover {
    background-color: #ebebeb;
  }
`

const PrimaryText = styled.span`
  color: black;
`

const SecondaryText = styled.span`
  color: #AAAAAA;
`

const ViewAllLink = styled(LinkBase).attrs({ color: 'black' })`
  text-decoration: none;
  font-size: 20px;
`

const Center = styled.div`
  text-align: center;
`

export default function ContentTable ({ title, items, viewAllUrl }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Items>
        {items.map(({ primary, secondary, url }, index) => (
          <Item key={index} to={url}>
            <PrimaryText>{primary}</PrimaryText>
            <SecondaryText>{secondary}</SecondaryText>
          </Item>
        ))}
      </Items>
      {viewAllUrl && (
        <Center>
          <ViewAllLink to={viewAllUrl}>
            View all &rarr;
          </ViewAllLink>
        </Center>
      )}
    </Container>
  )
}
