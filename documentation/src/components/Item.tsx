import React from 'react';
import { Box, Details, Button } from '@primer/components';
import { LibraryContext } from './LibraryContext';

const ItemJSON = ({obj}:{obj:object}) => {
  return <pre className="highlight">{
    JSON.stringify(obj, null, 2)
  }</pre>;
}

export const Item = ({citeId}: {citeId: string}) => {
  return (
    <Details mt={3} render={ ({open, toggle} : { open: boolean, toggle: Function }) => (
      <LibraryContext.Consumer>
        { library => (<>
          <Button is="summary" onClick={toggle}>
            {open ? 'Hide' : 'Show'} Zotero Entry
          </Button>
          <Box mt={3} className="markdown-body">
            <ItemJSON obj={library[citeId]} />
          </Box>
        </>) }
      </LibraryContext.Consumer>
    )} />
  )
}

