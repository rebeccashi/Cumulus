const mockLinks = () => {
  Array.from(document.querySelectorAll('.mock-link')).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Sorry, this doesn\'t work right now!');
    });
  });
}

const doLandingSearchForm = () => {
  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    unloadLanding()
      .then(() => {
        let query = input.value;
        window.history.pushState({ query }, '', `?q=${encodeURIComponent(query)}`);
        loadSearch(query);
      })
  });
}

const doSearchSearchForm = () => {
  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    alert(e);
  });
}

const doFilters = () => {

}

const doLoad = () => {
  let ctr = 100;

  Array.from(document.querySelectorAll('.loader')).forEach(load => {
    setTimeout(() => { load.classList.add('loaded') }, ctr);
    if (!load.classList.contains('no-load-time')) ctr += 150;
  });
}

const doUnload = (el) => {
  return new Promise((resolve, reject) => {
    let ctr = 100;
  
    Array.from(el.querySelectorAll('.loader.loaded')).forEach(load => {
      setTimeout(() => { load.classList.add('unloaded') }, ctr);
      if (!load.classList.contains('no-load-time')) ctr += 150;
    });

    setTimeout(resolve, ctr);
  });
}

const loadLanding = () => {
  let main = document.querySelector('main');

  main.innerHTML = '';

  if (main.classList.contains('search')) main.classList.remove('search');
  main.classList.add('landing');

  main.appendChild(document.querySelector('#landing-template').content.cloneNode(true));

  doLoad();
  unloadCurrent = unloadLanding;

  mockLinks();
  doLandingSearchForm();
}

const mockTopKeywords = () => {
  return {
    time_period: 'Jan 1 to Mar 3',
    keywords: [
      { keyword: 'JavaScript', popularity: 0.86 },
      { keyword: 'React.js', popularity: 0.74 },
      { keyword: 'Node.js', popularity: 0.72 },
      { keyword: 'Vue.js', popularity: 0.54 },
      { keyword: 'Next.js', popularity: 0.51 },
      { keyword: 'Gatsby', popularity: 0.23 },
      { keyword: 'Eleventy', popularity: 0.11 },
      { keyword: 'Hugo', popularity: 0.09 },
      { keyword: 'Angular', popularity: 0.07 },
      { keyword: 'Golang', popularity: 0.05 },
    ]
  }
}

const buildTopKeywords = (data) => {
  let tk = document.querySelector('#top-keywords-template').content.cloneNode(true);

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.innerHTML = data[slot.dataset.slot];
  });

  let tbody = tk.querySelector('tbody');

  data.keywords.forEach(keyword => {
    tbody.insertAdjacentHTML('beforeEnd', `
      <tr>
        <td>${keyword.keyword}</td>
        <td>${Math.round(keyword.popularity * 100)}%</td>
      </tr>
    `)
  });

  return tk;
}

const getResults = (resultEl, query) => {
  if (!resultEl || !query) return;

  // parsing here!

  doUnload(resultEl)
  .then(() => {
    resultEl.innerHTML = '';
  
    let data = mockTopKeywords();
  
    resultEl.appendChild(buildTopKeywords(data));
  })
}

const unloadLanding = () => {
  return new Promise((resolve, reject) => {
    doUnload(document.querySelector('main'))
      .then(() => resolve());
  });
}

const loadSearch = (q) => {
  if (!q) {
    loadLanding();
    return;
  }

  let main = document.querySelector('main');

  main.innerHTML = '';

  if (main.classList.contains('landing')) main.classList.remove('landing');
  main.classList.add('search');

  main.appendChild(document.querySelector('#search-template').content.cloneNode(true));

  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');

  input.value = q;

  let results = document.querySelector('#search-results');

  results.appendChild(document.querySelector('#load-search-results-template').content.cloneNode(true));

  getResults(results, q);

  doLoad();
  unloadCurrent = unloadSearch;

  mockLinks();
  doSearchSearchForm();
  doFilters();
}

const unloadSearch = () => {
  return new Promise((resolve, reject) => {
    doUnload(document.querySelector('main'))
      .then(() => resolve());
  });
}

let unloadCurrent = null;

window.addEventListener('load', () => {
  let url = new URLSearchParams(window.location.search);

  console.log(url);

  if (!url.has('q')) {
    unloadCurrent = unloadSearch;
    loadLanding();
  } else {
    unloadCurrent = unloadLanding;
    loadSearch(url.get('q'));
  }

  document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();

    if (unloadCurrent === unloadLanding) return;

    unloadCurrent()
      .then(() => {
        window.history.pushState({ query: null }, '', '?');
        loadLanding();
      })
  })
});

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.query) {
    unloadCurrent()
      .then(() => {
        loadSearch(e.state.query);
      })
  } else {
    unloadCurrent()
      .then(() => {
        loadLanding();
      })
  }
})

