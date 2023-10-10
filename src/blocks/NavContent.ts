import styled from 'styled-components'

import Page from '@blocks/Page'

export default styled(Page)`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: min-content min-content;
  grid-template-areas: 'logo username' 'links username';
  align-items: center;
  height: 100%;
`
