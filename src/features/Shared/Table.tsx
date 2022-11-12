import React, { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import LinkBase from '@features/Shared/LinkBase'
import styled from 'styled-components'
import { Breaker } from '@styles/CommonStyles'

const Container = styled.div`
  padding: 20px;
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 4px;
  position: relative;
  margin: 16px 0;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 16px;

  & > *:not(:last-child) {
    margin-right: 16px;
  }
`

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  flex: 1 0 auto;
`

const Items = styled.div`
  margin: 16px 0;
`

const Item = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  text-decoration: none;
  margin: 0 -10px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background-color 0.2s ease-in;
  position: relative;
  z-index: 2;

  :hover {
    background-color: ${props => props.theme.colors.backgroundHover};
    transition: background-color 0.1s ease-in;
  }
`

const PrimaryText = styled.div`
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 45%;
`

const SecondaryText = styled.div`
  color: ${props => props.theme.colors.textFaded};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 45%;
`

const ViewAllLink = styled(LinkBase).attrs({ color: 'black' })`
  text-decoration: none;
  font-size: 20px;
`

const Center = styled.div`
  text-align: center;
`

const LoadingOverlay = styled.div<{ visible: boolean }>`
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
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.2s linear;
  pointer-events: ${props => (props.visible ? 'all' : 'none')};

  &::after {
    content: 'Loading...';
  }
`

const NotFound = styled.p`
  margin: 0;
  font-size: 20px;
`

export default function ContentTable({
  title,
  items,
  viewAllUrl = undefined,
  loading = false,
  actions = undefined,
  mapper = item => item
}) {
  const mappedItems = useMemo(() => items.map(mapper), [items, mapper])

  return (
    <Container>
      <Toolbar>
        <Title>{title}</Title>
        {actions}
      </Toolbar>
      {mappedItems.length === 0 && <NotFound>Nothing to show here...</NotFound>}
      {mappedItems.length > 0 && (
        <Items>
          {mappedItems.map(({ primary, secondary, url }, index) => (
            <Fragment key={index}>
              <Item to={url}>
                <PrimaryText>{primary}</PrimaryText>
                <SecondaryText>{secondary}</SecondaryText>
              </Item>
              {index !== mappedItems.length - 1 && <Breaker />}
            </Fragment>
          ))}
        </Items>
      )}
      {viewAllUrl && (
        <Center>
          <ViewAllLink to={viewAllUrl}>View all &rarr;</ViewAllLink>
        </Center>
      )}
      <LoadingOverlay visible={loading} />
    </Container>
  )
}
