const mockLinks = () => {
  Array.from(document.querySelectorAll('.mock-link')).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Sorry, this doesn\'t work right now!');
    });
  });
}

let submitting = false;

const doFeaturedSearches = () => {
  Array.from(document.querySelectorAll('.featured-card')).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (submitting) return;
      submitting = true;

      unloadSearch()
        .then(() => {
          let query = link.dataset.search;
          window.history.pushState({ search: true, query }, '', `/search?q=${encodeURIComponent(query)}`);
          submitting = false;
          loadResults(query);
        })
    });
  });
}

const doLandingSearchForm = () => {
  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');
  let svg = searchForm.querySelector('svg');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (submitting) return;
    submitting = true;

    window.scrollTo(0, 0)

    svg.classList.add('submitted');

    unloadSearch()
      .then(() => {
        let query = input.value;
        window.history.pushState({ search: true, query }, '', `/search?q=${encodeURIComponent(query)}`);
        submitting = false;
        loadResults(query);
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

    window.scrollTo(0, 0)

    svg.classList.add('submitted');

    let query = input.value;
    window.history.pushState({ search: true, query }, '', `/search?q=${encodeURIComponent(query)}`);
    getResults(input.value);
    setTimeout(() => { if (svg.classList.contains('submitted')) svg.classList.remove('submitted'); submitting = false }, 800);
  });
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

const truncateLabel = (label) => {
  // truncate to 8
  return label.length <= 8 ? label : label.slice(0,5).concat('...');
}

const buildTopKeywords = (resultEl, data, hide) => {
  let tk = document.querySelector('#top-keywords-template').content.cloneNode(true);

  if (hide) {
    tk.querySelector('.result-card').classList.add('hidden');
    tk.querySelector('.result-card').classList.add('top-keywords');
  }

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
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
    slot.textContent = data[slot.dataset.slot];
  });

  data = data.keywords;

  resultEl.appendChild(tk);

  // set the dimensions and margins of the graph
  let margin = {top: 20, right: 20, bottom: 50, left: 40},
  width = 480 - margin.left - margin.right,
  height = 240 - margin.top - margin.bottom;

  // set the ranges
  let x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);
  let y = d3.scaleLinear()
        .range([height, 0]);

  x.domain(data.map(function(d) { return d.language; }));
  y.domain([0, d3.max(data, function(d) { return parseFloat(d.count); })]);

  let svg = d3.select('.visualization-container:not(.selected)')
    .attr('class', 'visualization-container selected')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let div = d3.select('body')
      .select('div.tooltip')

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.language); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(parseFloat(d.count)); })
    .on('mouseover', function(e, d) {
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div	.html(`<span class="title">${d.language}</span><span class="value">${d.count} appearance${d.count > 1 ? 's' : ''}</span>`)	
          .style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mousemove', function(e) {
      div	.style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mouseout', function() {
      div.transition()		
          .duration(500)		
          .style("opacity", 0);	
    })

  // add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(function(d) { return truncateLabel(d); }))
    .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)" );

  const yAxisTicks = y.ticks()
  .filter(Number.isInteger);

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y)
              .tickValues(yAxisTicks)
              .tickFormat(d3.format("d")));
}

const buildTopCompanies = (resultEl, data, hide) => {
  let tk = document.querySelector('#top-companies-template').content.cloneNode(true);

  if (hide) {
    tk.querySelector('.result-card').classList.add('hidden');
    tk.querySelector('.result-card').classList.add('top-companies');
  }

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  let tbody = tk.querySelector('tbody');

  data.companies.forEach(company => {
    tbody.insertAdjacentHTML('beforeEnd', `
      <tr>
        <td>${company.company.charAt(0).toUpperCase() + company.company.substr(1)}</td>
        <td>${parseFloat(company.count)}</td>
      </tr>
    `)
  });

  resultEl.appendChild(tk);
}

const buildTopCompaniesGraph = (resultEl, data) => {
  let tk = document.querySelector('#top-companies-graph-template').content.cloneNode(true);
  
  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  data = data.companies;

  resultEl.appendChild(tk);

  // set the dimensions and margins of the graph
  let margin = {top: 20, right: 20, bottom: 50, left: 40},
  width = 480 - margin.left - margin.right,
  height = 240 - margin.top - margin.bottom;

  // set the ranges
  let x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);
  let y = d3.scaleLinear()
        .range([height, 0]);
  // let xAxis = d3.svg.axis()
  // .scale(x);

  x.domain(data.map(function(d) { return d.company; }));
  y.domain([0, d3.max(data, function(d) { return parseFloat(d.count); })]);

  let svg = d3.select('.visualization-container:not(.selected)')
    .attr('class', 'visualization-container selected')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let div = d3.select('body')
    .select('div.tooltip')

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.company); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(parseFloat(d.count)); })
    .on('mouseover', function(e, d) {
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div	.html(`<span class="title">${d.company}</span><span class="value">${d.count} posting${d.count > 1 ? 's' : ''}</span>`)	
          .style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mousemove', function(e) {
      div	.style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mouseout', function() {
      div.transition()		
          .duration(500)		
          .style("opacity", 0);	
    })

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(function(d) { return truncateLabel(d); }))
      .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-40)" );
      // .call(xAxis)
      // .attr("transform", "rotate(90)")

  const yAxisTicks = y.ticks()
  .filter(Number.isInteger);

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y)
              .tickValues(yAxisTicks)
              .tickFormat(d3.format("d")));
}

const buildTopMajors = (resultEl, data, hide) => {
  let tk = document.querySelector('#top-majors-template').content.cloneNode(true);

  if (hide) {
    tk.querySelector('.result-card').classList.add('hidden');
    tk.querySelector('.result-card').classList.add('top-majors');
  }

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  let tbody = tk.querySelector('tbody');

  data.majors.forEach(major => {
    tbody.insertAdjacentHTML('beforeEnd', `
      <tr>
        <td>${major.major.charAt(0).toUpperCase() + major.major.substr(1)}</td>
        <td>${Math.round(parseFloat(major.percent) * 100)}%</td>
      </tr>
    `)
  });

  resultEl.appendChild(tk);
}

const buildTopMajorsGraph = (resultEl, data) => {
  let tk = document.querySelector('#top-majors-graph-template').content.cloneNode(true);

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  data = data.majors;

  resultEl.appendChild(tk);

  // set the dimensions and margins of the graph
  let margin = {top: 20, right: 20, bottom: 50, left: 40},
  width = 480 - margin.left - margin.right,
  height = 240 - margin.top - margin.bottom;

  // set the ranges
  let x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);
  let y = d3.scaleLinear()
        .range([height, 0]);

  x.domain(data.map(function(d) { return d.major; }));
  y.domain([0, d3.max(data, function(d) { return parseFloat(d.count); })]);

  let svg = d3.select('.visualization-container:not(.selected)')
    .attr('class', 'visualization-container selected')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let div = d3.select('body')
      .select('div.tooltip')

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.major); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(parseFloat(d.count)); })
    .on('mouseover', function(e, d) {
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div	.html(`<span class="title">${d.major}</span><span class="value">${d.count} appearance${d.count > 1 ? 's' : ''}</span>`)	
          .style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mousemove', function(e) {
      div	.style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mouseout', function() {
      div.transition()		
          .duration(500)		
          .style("opacity", 0);	
    })

  // add the x Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(function(d) { return truncateLabel(d); }))
    .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-40)" );

  const yAxisTicks = y.ticks()
  .filter(Number.isInteger);

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y)
              .tickValues(yAxisTicks)
              .tickFormat(d3.format("d")));
}

const buildTopTypes = (resultEl, data, hide) => {
  let tk = document.querySelector('#top-types-template').content.cloneNode(true);

  if (hide) {
    tk.querySelector('.result-card').classList.add('hidden');
    tk.querySelector('.result-card').classList.add('top-types');
  }

  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  let tbody = tk.querySelector('tbody');

  data.types.forEach(type => {
    tbody.insertAdjacentHTML('beforeEnd', `
      <tr>
        <td>${type.type.charAt(0).toUpperCase() + type.type.substr(1)}</td>
        <td>${parseFloat(type.count)}</td>
      </tr>
    `)
  });

  resultEl.appendChild(tk);
}

const buildTopTypesGraph = (resultEl, data) => {
  let tk = document.querySelector('#top-types-graph-template').content.cloneNode(true);
  
  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  data = data.types;

  resultEl.appendChild(tk);

  // set the dimensions and margins of the graph
  let margin = {top: 20, right: 20, bottom: 50, left: 40},
  width = 480 - margin.left - margin.right,
  height = 240 - margin.top - margin.bottom;

  // set the ranges
  let x = d3.scaleBand()
        .range([0, width])
        .padding(0.3);
  let y = d3.scaleLinear()
        .range([height, 0]);
  // let xAxis = d3.svg.axis()
  // .scale(x);

  x.domain(data.map(function(d) { return d.type; }));
  y.domain([0, d3.max(data, function(d) { return parseFloat(d.count); })]);

  let svg = d3.select('.visualization-container:not(.selected)')
    .attr('class', 'visualization-container selected')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let div = d3.select('body')
    .select('div.tooltip')

  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.type); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d.count); })
    .attr("height", function(d) { return height - y(parseFloat(d.count)); })
    .on('mouseover', function(e, d) {
      div.transition()		
          .duration(200)		
          .style("opacity", .9);		
      div	.html(`<span class="title">${d.type}</span><span class="value">${d.count} posting${d.count > 1 ? 's' : ''}</span>`)	
          .style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mousemove', function(e) {
      div	.style("left", (e.clientX) + "px")		
          .style("top", (e.clientY) + "px");
    })
    .on('mouseout', function() {
      div.transition()		
          .duration(500)		
          .style("opacity", 0);	
    })

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(function(d) { return truncateLabel(d); }))
      .selectAll("text")  
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-40)" );
      // .call(xAxis)
      // .attr("transform", "rotate(90)")

  const yAxisTicks = y.ticks()
  .filter(Number.isInteger);

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y)
              .tickValues(yAxisTicks)
              .tickFormat(d3.format("d")));
}

const buildTopTypesPieChart = (resultEl, data) => {
  let tk = document.querySelector('#top-types-graph-template').content.cloneNode(true);
  
  Array.from(tk.querySelectorAll('.slot')).forEach(slot => {
    slot.textContent = data[slot.dataset.slot];
  });

  data = data.types;

  resultEl.appendChild(tk);

  // TODO: MAKE SVG SMALLER
  let margin = {top: 30, right: 20, bottom: 20, left: 50};
  let width = 480 - margin.left - margin.right;
  let height = 480 - margin.top - margin.bottom;
  let x = width /2 + margin.left;
  let y = width/2 + margin.top;

  let svg = d3.select('.visualization-container:not(.selected)')
            .attr('class', 'visualization-container selected')
            .append('svg')
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", "translate(" + x + "," + y + ")");        

  let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1)

  let arcLabel = () =>{
      let radius = Math.min(width, height) / 2 * 0.8;
      return d3.arc().innerRadius(radius).outerRadius(radius);
  }

  let color = d3.scaleOrdinal()
    .domain(data.map(d => d.type))
    .range(d3.schemeBlues[data.length])
  
  let pie = d3.pie() 
    .value(d => d.count)

  let arcs =  pie(data);

  svg.attr("stroke", "white")
  .selectAll("path")
  .data(arcs)
  .join("path")
    .attr("fill", d => color(d.data.type))
    .attr("d", arc)
  .append("title")
    .text(d => `${d.type}: ${d.count}`);

  svg.append("g")
    // .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
  .selectAll("text")
  .data(arcs)
  .join("text")
    .attr("stroke", "black")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        // .attr("font-weight", "bold")
        .text(d => d.data.type))
    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.count.toLocaleString()));

}

async function fetchAndBuildResults(resultEl, query) {
  const keywordsResponse = await fetch('http://localhost:3000/api/keywords?q=' + query.trim());
  const keywordsData = await keywordsResponse.json();

  const companiesResponse = await fetch('http://localhost:3000/api/companies?q=' + query.trim());
  let companiesData = await companiesResponse.json();

  const majorsResponse = await fetch('http://localhost:3000/api/majors?q=' + query.trim());
  let majorsData = await majorsResponse.json();

  const typesResponse = await fetch('http://localhost:3000/api/types?q=' + query.trim());
  let typesData = await typesResponse.json();

  await doUnload(resultEl);

  resultEl.innerHTML = '';

  let keywordsObj = {
    keywords: keywordsData,
    query
  }
  let companiesObj = {
    companies: companiesData,
    query
  }
  let majorsObj = {
    majors: majorsData,
    query
  }
  let typesObj = {
    types: typesData,
    query
  }
  let div = d3.select('body')
              .append('div')
              .attr('class', 'tooltip')			
              .style("opacity", 0);
  
  if (window.innerWidth < 1000) {
    buildTopKeywords(resultEl, keywordsObj, false);
    buildTopCompanies(resultEl, companiesObj, false);
    buildTopMajors(resultEl, majorsObj, false);
    buildTopTypes(resultEl, typesObj, false);
  } else {
    buildTopKeywordsGraph(resultEl, keywordsObj);
    buildTopKeywords(resultEl, keywordsObj, true);
    buildTopCompaniesGraph(resultEl, companiesObj);
    buildTopCompanies(resultEl, companiesObj, true);
    buildTopMajorsGraph(resultEl, majorsObj);
    buildTopMajors(resultEl, majorsObj, true);
    // buildTopTypesGraph(resultEl, typesObj);
    buildTopTypesPieChart(resultEl, typesObj);
    buildTopTypes(resultEl, typesObj, true);

    Array.from(resultEl.querySelectorAll('.show-data')).forEach(el => {
      el.addEventListener('click', () => {
        if (el.dataset.hidden === "true") {
          resultEl.querySelector(`.${el.dataset.selector}`).classList.remove('hidden');
          el.dataset.hidden = "false";
          el.textContent = "Hide data";
        } else {
          resultEl.querySelector(`.${el.dataset.selector}`).classList.add('hidden');
          el.dataset.hidden = "true";
          el.textContent = "Show data";
        }
      });
    });
  }

  doLoad(resultEl);
}

const getResults = (query) => {
  let resultEl = document.querySelector('#search-results');

  if (!resultEl || !query) return;

  // parsing here!

  fetchAndBuildResults(resultEl, query);
}

const loadSearch = () => {
  let main = document.querySelector('main');

  main.innerHTML = '';

  if (main.classList.contains('search')) main.classList.remove('search');
  if (main.classList.contains('landing')) main.classList.remove('landing');

  main.appendChild(document.querySelector('#search-template').content.cloneNode(true));

  doLoad(main);
  unloadCurrent = unloadSearch;

  mockLinks();
  doLandingSearchForm();
  doFeaturedSearches();
}

const unloadSearch = () => {
  return new Promise((resolve, reject) => {
    doUnload(document.querySelector('main'))
      .then(() => resolve());
  });
}

const loadResults = (q) => {
  if (!q) {
    loadSearch();
    return;
  }

  let main = document.querySelector('main');

  main.innerHTML = '';

  if (main.classList.contains('landing')) main.classList.remove('landing');
  main.classList.add('search');

  main.appendChild(document.querySelector('#results-template').content.cloneNode(true));

  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');

  input.value = q;

  let results = document.querySelector('#search-results');

  results.appendChild(document.querySelector('#load-search-results-template').content.cloneNode(true));

  getResults(q);

  doLoad(main);
  unloadCurrent = unloadResults;

  mockLinks();
  doSearchSearchForm();
}

const unloadResults = () => {
  return new Promise((resolve, reject) => {
    let div = document.querySelector('div.tooltip');

    if (div) {
      div.parentNode.removeChild(div);
    }

    doUnload(document.querySelector('main'))
      .then(() => resolve());
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

  document.querySelector('.cta-card').addEventListener('click', () => {
    unloadLanding()
      .then(() => {
        window.history.pushState({ search: true, query: null }, '', `/search`);
        loadSearch();
      })
  });
}

const unloadLanding = () => {
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

  if (window.location.pathname.includes('search') && !url.has('q')) {
    window.history.pushState({ search: true, query: null }, '', `/search`);
    unloadCurrent = unloadResults;
    loadSearch();
  } else if (window.location.pathname.includes('search') && url.has('q')) {
    window.history.pushState({ search: true, query: url.get('q') }, '', `/search?q=${encodeURIComponent(url.get('q'))}`);
    unloadCurrent = unloadSearch;
    loadResults(url.get('q'));
  } else {
    window.history.pushState(null, '', `/`);
    unloadCurrent = unloadLanding;
    loadLanding();
  }

  document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();

    if (unloadCurrent === unloadLanding) return;

    unloadCurrent()
      .then(() => {
        window.history.pushState({ search: false, query: null }, '', '/');
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
    if (unloadCurrent === unloadResults) {
      getResults(e.state.query);
    }
    else {
      unloadCurrent()
        .then(() => {
          loadResults(e.state.query);
        })
    }
  } else if (e.state !== null) {
    unloadCurrent()
      .then(() => {
        loadSearch();
      })
  } else {
    unloadCurrent()
      .then(() => {
        loadLanding();
      })
  }
});