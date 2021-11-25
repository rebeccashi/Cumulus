import React from 'react';

import './SearchPage.css';

import ResultsPage from '../ResultsPage';

import Button from '../../components/Button';
import Input from '../../components/Input';
import Heading from '../../components/Heading';
import Text from '../../components/Text';

export const SearchPage = ({ searchValue }) => {
  const [autocomplete, setAutocomplete] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [selectedObject, setSelectedObject] = React.useState(null);
  
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
    if (searchValue && searchValue.length > 0) {
      setQuery(searchValue);
    }
  }, [searchValue])

  React.useEffect(() => {
    if (selectedObject != null) {
      setSelectedObject(null)
    }
    
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
            value={selectedObject == null ? query : selectedObject}
            setValue={(newValue) => {
              setQuery(newValue)
            }}
            onSubmit={(value) => {
              setSelectedObject(value)
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
              <ResultsPage query={query} data={data} ready={ready} setAutocomplete={setAutocomplete} setSelectedObject={setSelectedObject} />
            ) :
            <>
              <Heading variant='h1'>{selectedObject}</Heading>
              <Button
                color='white'
                onClick={() => {
                  setSelectedObject(null)
                }}
                label='Unselect'
              />
            </>
          }
        </div>
      </div>
    </>
  )
}
