import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box } from '@primer/components';

export const Markdown = (props: any) =>
    <Box className="markdown-body">
      <ReactMarkdown {...props} />
    </Box>

