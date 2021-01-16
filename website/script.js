const mockLinks = () => {
  Array.from(document.querySelectorAll('.mock-link')).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Sorry, this doesn\'t work right now!');
    });
  });
}

let submitting = false;

const doLandingSearchForm = () => {
  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');
  let svg = searchForm.querySelector('svg');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (submitting) return;
    submitting = true;

    svg.classList.add('submitted');

    unloadLanding()
      .then(() => {
        let query = input.value;
        window.history.pushState({ query }, '', `?q=${encodeURIComponent(query)}`);
        submitting = false;
        loadSearch(query);
      })
  });
}

const doSearchSearchForm = () => {
  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');
  let svg = searchForm.querySelector('svg');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (submitting) return;
    submitting = true;

    svg.classList.add('submitted');

    let query = input.value;
    window.history.pushState({ query }, '', `?q=${encodeURIComponent(query)}`);
    getResults(input.value);
    setTimeout(() => { if (svg.classList.contains('submitted')) svg.classList.remove('submitted'); submitting = false }, 800);
  });
}

const doFilters = () => {

}

const doLoad = (el) => {
  let ctr = 100;

  Array.from(el.querySelectorAll('.loader')).forEach(load => {
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

  doLoad(main);
  unloadCurrent = unloadLanding;

  mockLinks();
  doLandingSearchForm();
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

async function fetchAndBuildResults(resultEl, query) {
  const response = await fetch('mockTopKeywords.json');
  const data = await response.json();

  await doUnload(resultEl);

  resultEl.innerHTML = '';
  data.query = query;
      
  resultEl.appendChild(buildTopKeywords(data));
      
  resultEl.appendChild(buildTopKeywords(data));
      
  resultEl.appendChild(buildTopKeywords(data));
      
  resultEl.appendChild(buildTopKeywords(data));

  doLoad(resultEl);
}

const getResults = (query) => {
  let resultEl = document.querySelector('#search-results');

  if (!resultEl || !query) return;

  // parsing here!

  fetchAndBuildResults(resultEl, query);
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

  getResults(q);

  doLoad(main);
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

const menuBtnListener = () => {
  if (window.innerWidth < 1000) {
    let cta = document.querySelector('.cta');

    document.querySelector('.menubtn').addEventListener('click', () => {
      console.log(cta, cta.style.right);
      if (cta.style.right !== '0px') {
        cta.style.right = '0px';
      } else {
        cta.style.right = '-100vw';
      }
    });
  }
}

window.addEventListener('touchmove', () => {
  if (document.querySelector('.cta').style.right === '0px') {
    document.querySelector('.menubtn').dispatchEvent( new Event('click') );
  }
})

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
  });

  menuBtnListener();
});

window.addEventListener('resize', () => {
  menuBtnListener();
});

window.addEventListener('popstate', (e) => {
  if (e.state && e.state.query) {
    if (unloadCurrent === unloadSearch) {
      getResults(e.state.query);
    }
    else {
      unloadCurrent()
        .then(() => {
          loadSearch(e.state.query);
        })
    }
  } else {
    unloadCurrent()
      .then(() => {
        loadLanding();
      })
  }
});