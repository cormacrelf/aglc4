import React from 'react';
import ReactDOM from 'react-dom';

export const TitlePortal = ({title} : { title: string }) => {
  return ReactDOM.createPortal(<span>{title}</span>, document.getElementById('csl-title') as Element);
}

