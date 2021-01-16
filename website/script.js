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

const buildTopKeywords = (resultEl, data) => {
  let tk = document.querySelector('#top-keywords-template').content.cloneNode(true);

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.innerHTML = data[slot.dataset.slot];
  });

  let tbody = tk.querySelector('tbody');

  data.keywords.forEach(keyword => {
    tbody.insertAdjacentHTML('beforeEnd', `
      <tr>
        <td>${keyword.language.charAt(0).toUpperCase() + keyword.language.substr(1)}</td>
        <td>${Math.round(parseFloat(keyword.percent) * 100)}%</td>
      </tr>
    `)
  });

  resultEl.appendChild(tk);
}

const buildTopKeywordsGraph = (resultEl, data) => {
  let tk = document.querySelector('#top-keywords-graph-template').content.cloneNode(true);

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.innerHTML = data[slot.dataset.slot];
  });

  data = data.keywords;

  resultEl.appendChild(tk);

  // set the dimensions and margins of the graph
  let margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 480 - margin.left - margin.right,
  height = 240 - margin.top - margin.bottom;

  // set the ranges
  let x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);
  let y = d3.scaleLinear()
        .range([height, 0]);

  x.domain(data.map(function(d) { return d.language; }));
  y.domain([0, d3.max(data, function(d) { return parseFloat(d.percent); })]);

  let svg = d3.select('.visualization-container')
  .append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  svg.selectAll(".bar")
      .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.language); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.percent); })
        .attr("height", function(d) { return height - y(parseFloat(d.percent)); });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
}

async function fetchAndBuildResults(resultEl, query) {
  const response = await fetch('/api/keywords?q=' + query.trim());
  const data = await response.json();

  await doUnload(resultEl);

  resultEl.innerHTML = '';

  let dataobj = {
    keywords: data,
    query
  }
      
  buildTopKeywords(resultEl, dataobj);
      
  buildTopKeywordsGraph(resultEl, dataobj);

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