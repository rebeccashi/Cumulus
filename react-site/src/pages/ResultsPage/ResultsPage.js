import React from 'react';

import './ResultsPage.css';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import Placeholder from '../../components/Placeholder';
import Text from '../../components/Text';

const FEATUREDLENGTH = 4;

export const ResultsPage = ({ query, data, ready, setSelectedObject }) => {

  return (
    <>
      <Heading variant='h1'>Looking for &ldquo;{query}&rdquo;</Heading>
      <div className="results">
        <div className="featured">
          {
            !ready ?
            (
              Array.from(Array(FEATUREDLENGTH)).map((_, i) => {
                return (
                  <div key={i} className='result'>
                    <Placeholder style={{
                      height: '128px',
                      width: '100%'
                    }} />
                  </div>
                )
              })
            ) :
            (
              data.results.slice(0,FEATUREDLENGTH).map((result, i) => {
                return (
                  <div key={i} className='result'>
                    <Card
                      variant='interactive'
                      color='white'
                      onClick={() => {
                        setSelectedObject(result)
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
            !ready ?
            (
              Array.from(Array(2*FEATUREDLENGTH)).map((_, i) => {
                return (
                  <div key={i} className='result'>
                    <Placeholder style={{
                      height: '64px',
                      width: '100%'
                    }} />
                  </div>
                )
              })
            ) :
            (
              data.results.slice(FEATUREDLENGTH).map((result, i) => {
                return (
                  <div key={i} className='result'>
                    <Card
                      variant='interactive'
                      color='white'
                      onClick={() => {
                        setSelectedObject(result)
                      }}
                      style={{
                        width: '100%'
                      }}
                    >
                      <Heading variant='h6'>{result.name}</Heading>
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
