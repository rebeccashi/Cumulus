import './Icon.css';

import { ReactComponent as Add } from './img/Add.svg';
import { ReactComponent as Compare } from './img/Compare.svg';
import { ReactComponent as Details } from './img/Details.svg';
import { ReactComponent as Dropdown } from './img/Dropdown.svg';
import { ReactComponent as Explore } from './img/Explore.svg';
import { ReactComponent as Filter } from './img/Filter.svg';
import { ReactComponent as Individual } from './img/Individual.svg';
import { ReactComponent as Search } from './img/Search.svg';
import { ReactComponent as Sort } from './img/Sort.svg';

export const Icon = ({
  variant='add',
  color='purple',
  size='sm'
}) => {
  const colorClass = `icon-color--${color}`;
  const sizeClass = `icon-size--${size}`;

  return (
    <>
      <div className={`${colorClass} ${sizeClass}`}>
        {(() => {
          switch (variant) {
            case 'add': return <Add className='icon-img' />;
            case 'compare': return <Compare className='icon-img' />;
            case 'details': return <Details className='icon-img' />;
            case 'dropdown': return <Dropdown className='icon-img' />;
            case 'explore': return <Explore className='icon-img' />;
            case 'filter': return <Filter className='icon-img' />;
            case 'individual': return <Individual className='icon-img' />;
            case 'search': return <Search className='icon-img' />;
            case 'sort': return <Sort className='icon-img' />;
            default: return <Add className='icon-img' />;
          }
        })()}
      </div>
    </>
  );
}