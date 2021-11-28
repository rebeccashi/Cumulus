import React from 'react';

import './SearchPage.css';

import ResultsPage from '../ResultsPage';

import Input from '../../components/Input';
import Heading from '../../components/Heading';
import Text from '../../components/Text';
import { OverviewPage } from '../OverviewPage/OverviewPage';

export const SearchPage = ({ searchValue }) => {
  const [autocomplete, setAutocomplete] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [selectedObject, setSelectedObject] = React.useState(null);
  
  const emptyData = {
    query: '',
    results: []
  }
  const [data, setData] = React.useState(emptyData);

  React.useEffect(() => {
    if (data.results.length > 0) {
      const first = data.results[0].name;
      setAutocomplete(first.slice(query.length + first.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())))
    } else {
      setAutocomplete('')
    }
  }, [data, setAutocomplete, query])

  React.useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      setQuery(searchValue);
    }
  }, [searchValue])

  React.useEffect(() => {
    setSelectedObject(null)

    const controller = new AbortController();

    const updateMockData = () => {
      setData({
        query,
        results: [
          { name: 'Software Engineer', listings: '33,307' },
          { name: 'Microsoft Co.', listings: '14,566' },
          { name: 'Software Developer', listings: '13,724' },
          { name: 'SoFi Co.', listings: '4,194' },
          { name: 'Cloud Software Engineer', listings: '3,163' },
          { name: 'Sofitel Co.', listings: '789' },
          { name: 'Software Security', listings: '273' },
          { name: 'Cisco (Software)', listings: '156' },
          { name: 'Softbank Co.', listings: '89' },
        ]
      })
    }

    fetch('http://neverssl.com', {mode: 'no-cors', signal: controller.signal})
      .then(updateMockData)
      .catch(err => {});
    
    return () => { controller.abort() }
  }, [query])

  return (
    <>
      <div className='search'>
        <div className='sidebar'>
          <Heading variant='h2'>
            /search
          </Heading>
          <Input 
            autofocus={true}
            autocomplete={autocomplete}
            placeholder='Job title, keywords, company, or location'
            withIcon={true} 
            iconVariant='search' 
            value={selectedObject == null ? query : selectedObject.name}
            setValue={(newValue) => {
              setQuery(newValue)
            }}
            onSubmit={() => {
              if (data.results.length > 0) {
                setAutocomplete('')
                setSelectedObject(data.results[0])
              }
            }}
            style={{
              width: '100%'
            }}
          />
          <br />
          <Text>
            Auto-generated suggestions will appear here throughout your search.
          </Text>
        </div>
        <div className='main'>
          {
            selectedObject == null ?
            (
              query === '' ?
              (
                <>
                  <Heading variant='h1'>Always helpful</Heading>
                  <Text>
                    As you type, we'll display a few results that match.
                  </Text>
                </>
              ) :
              <ResultsPage query={query} data={data.query === query ? data : emptyData} ready={data.query === query} setSelectedObject={(obj) => { setAutocomplete(''); setSelectedObject(obj); }} />
            ) :
            <>
              <OverviewPage data={selectedObject} />
            </>
          }
        </div>
      </div>
    </>
  )
}
