import React from 'react'
import { Link } from 'react-router-dom'
import LinkBase from '@Shared/LinkBase'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  margin: 16px 0;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 16px;
`

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  flex: 1 0 auto;
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

const LoadingOverlay = styled.div<{visible:boolean}>`
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  font-size: 20px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity .2s linear;
  pointer-events: ${props => props.visible ? 'all' : 'none'};

  &::after {
    content: "Loading..."
  }
`

const NotFound = styled.p`
  margin: 0;
  font-size: 20px;
`

export default function ContentTable ({ title, items, viewAllUrl = undefined, loading = false, actions = [] }) {
  return (
    <Container>
      <Toolbar>
        <Title>{title}</Title>
        {actions}
      </Toolbar>
      {items.length === 0 && (
        <NotFound>
          Nothing to show here...
        </NotFound>
      )}
      {items.length > 0 && (
        <Items>
          {items.map(({ primary, secondary, url }, index) => (
            <Item key={index} to={url}>
              <PrimaryText>{primary}</PrimaryText>
              <SecondaryText>{secondary}</SecondaryText>
            </Item>
          ))}
        </Items>
      )}
      {viewAllUrl && (
        <Center>
          <ViewAllLink to={viewAllUrl}>
            View all &rarr;
          </ViewAllLink>
        </Center>
      )}
      <LoadingOverlay visible={loading} />
    </Container>
  )
}
