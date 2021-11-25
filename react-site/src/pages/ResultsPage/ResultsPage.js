import React from 'react';

import './ResultsPage.css';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import Placeholder from '../../components/Placeholder';
import Text from '../../components/Text';

export const ResultsPage = ({ query, setSelectedObject }) => {
  const [data, setData] = React.useState([
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
    { name: 'Software Engineer', listings: '13,505' },
  ]);

  return (
    <>
      <Heading variant='h1'>Looking for &ldquo;{query}&rdquo;</Heading>
      <div className="results">
        <div className="featured">
          {
            data.length === 0 ?
            (
              Array.from(Array(4)).map(() => {
                return (
                  <div className='result'>
                    <Placeholder style={{
                      height: '128px',
                      width: '100%'
                    }} />
                  </div>
                )
              })
            ) :
            (
              data.slice(0,4).map(result => {
                return (
                  <div className='result'>
                    <Card
                      variant='interactive'
                      color='white'
                      onClick={() => {
                        setSelectedObject(result.name)
                      }}
                      style={{
                        width: '100%'
                      }}
                    >
                      <Heading variant='h3'>{result.name}</Heading>
                      <Text><strong>Listings:</strong> {result.listings}</Text>
                    </Card>
                  </div>
                )
              })
            )
          }
        </div>
        <div className="more">
          <Heading variant='h2'>More results</Heading>
          {
            data.length === 0 ?
            (
              Array.from(Array(8)).map(() => {
                return (
                  <div className='result'>
                    <Placeholder style={{
                      height: '64px',
                      width: '100%'
                    }} />
                  </div>
                )
              })
            ) :
            (
              data.slice(4).map(result => {
                return (
                  <div className='result'>
                    <Card
                      variant='interactive'
                      color='white'
                      onClick={() => {
                        setSelectedObject(result.name)
                      }}
                      style={{
                        width: '100%'
                      }}
                    >
                      <Heading variant='h3'>{result.name}</Heading>
                    </Card>
                  </div>
                )
              })
            )
          }
        </div>
      </div>
    </>
  )
}
