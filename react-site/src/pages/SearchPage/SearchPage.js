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

  React.useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      setQuery(searchValue);
    }
  }, [searchValue])

  React.useEffect(() => {
    if (selectedObject != null) {
      setSelectedObject(null)
    }
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
              (
                <>
                  <ResultsPage query={query} setAutocomplete={setAutocomplete} setSelectedObject={setSelectedObject} />
                </>
              )
            ) :
            (
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
            )
          }
        </div>
      </div>
    </>
  )
}
