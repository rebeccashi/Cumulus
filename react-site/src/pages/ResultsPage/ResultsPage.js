import React from 'react';

import './ResultsPage.css';

import Card from '../../components/Card';
import Heading from '../../components/Heading';
import Placeholder from '../../components/Placeholder';
import Text from '../../components/Text';

const FEATUREDLENGTH = 4;

export const ResultsPage = ({ query, setAutocomplete, setSelectedObject }) => {
  const [ready, setReady] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (data.length > 0) {
      const first = data[0].name;
      setAutocomplete(first.slice(query.length + first.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())))
    } else {
      setAutocomplete('')
    }
  }, [data, setAutocomplete, query])

  React.useEffect(() => {
    setReady(false)

    const updateMockData = () => {
      setData([
        { name: 'Software Engineer', listings: '33,307' },
        { name: 'Microsoft Co.', listings: '14,566' },
        { name: 'Software Development', listings: '13,724' },
        { name: 'SoFi Co.', listings: '4,194' },
        { name: 'Cloud Software Engineer', listings: '3,163' },
        { name: 'Sofitel Co.', listings: '789' },
        { name: 'Software Security', listings: '273' },
        { name: 'Cisco (Software)', listings: '156' },
        { name: 'Softbank Co.', listings: '89' },
      ])
      setReady(true)
    }

    fetch('https://www.slowwebsite.com', {mode: 'no-cors'})
      .then(updateMockData)
      .catch(updateMockData)
  }, [query])

  return (
    <>
      <Heading variant='h1'>Looking for &ldquo;{query}&rdquo;</Heading>
      <div className="results">
        <div className="featured">
          {
            !ready ?
            (
              Array.from(Array(FEATUREDLENGTH)).map(() => {
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
              data.slice(0,FEATUREDLENGTH).map(result => {
                return (
                  <div className='result'>
                    <Card
                      variant='interactive'
                      color='white'
                      onClick={() => {
                        setAutocomplete('')
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
            !ready ?
            (
              Array.from(Array(2*FEATUREDLENGTH)).map(() => {
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
              data.slice(FEATUREDLENGTH).map(result => {
                return (
                  <div className='result'>
                    <Card
                      variant='interactive'
                      color='white'
                      onClick={() => {
                        setAutocomplete('')
                        setSelectedObject(result.name)
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
