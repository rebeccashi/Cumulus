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
        color='white'
        options={[
          {
            label: 'Details',
            value: VIEWS.DETAILS,
            icon: 'details'
          },
          {
            label: 'Sort',
            value: VIEWS.SORT,
            icon: 'sort'
          },
          {
            label: 'Filter',
            value: VIEWS.FILTER,
            icon: 'filter'
          },
          {
            label: 'Compare',
            value: VIEWS.COMPARE,
            icon: 'compare'
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
