import React from 'react';

import './OverviewPage.css';

import Heading from '../../components/Heading';
import RadioGroup  from '../../components/RadioGroup';

const VIEWS = {
  DETAILS: 'details',
  SORT: 'sort',
  FILTER: 'filter',
  COMPARE: 'compare'
}

export const OverviewPage = ({ data }) => {
  const [view, setView] = React.useState(VIEWS.DETAILS)

  return (
    <>
      <Heading variant='h1'>{data.name}</Heading>
      <RadioGroup
        options={[
          {
            label: 'Details',
            value: VIEWS.DETAILS
          },
          {
            label: 'Sort',
            value: VIEWS.SORT
          },
          {
            label: 'Filter',
            value: VIEWS.FILTER
          },
          {
            label: 'Compare',
            value: VIEWS.COMPARE
          }
        ]}
        value={view}
        setValue={setView}
      />
      {(() => {
        switch(view) {
          case VIEWS.DETAILS: return <>DETAILS</>;
          case VIEWS.SORT: return <>SORT</>;
          case VIEWS.FILTER: return <>FILTER</>;
          case VIEWS.COMPARE: return <>COMPARE</>;
        }
      })()}
    </>
  )
}
