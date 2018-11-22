import React from 'react';
import { TestCaseSingle } from '../types';
import { Box, Details, Button } from '@primer/components';

const ItemJSON = ({obj}:{obj:object}) => {
  return <pre className="highlight">{JSON.stringify(obj, null, 2)}</pre>;
}

export const Item = ({test}: {test: TestCaseSingle}) => {
  return (
    <Details mt={3} render={ ({open, toggle} : { open: boolean, toggle: Function }) => (
      <>
        <Button is="summary" onClick={toggle}>
          {open ? 'Hide' : 'Show'} Zotero Entry
        </Button>
        <Box mt={3} className="markdown-body">
          <ItemJSON obj={test.item} />
        </Box>
      </>
    )} />
  )
}

