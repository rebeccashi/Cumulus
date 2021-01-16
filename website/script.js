const mockLinks = () => {
  Array.from(document.querySelectorAll('.mock-link')).forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Sorry, this doesn\'t work right now!');
    });
  });
}

const doSearchForm = () => {
  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    alert(input.value);

    loadSearch();
  });
}

const doFilters = () => {

}

const loadLanding = () => {
  let main = document.querySelector('main');

  if (main.classList.contains('search')) main.classList.remove('search');
  main.classList.add('landing');

  main.appendChild(document.querySelector('#landing-template').content.cloneNode(true));
  mockLinks();
  doSearchForm();
}

const unloadLanding = () => {

}

const loadSearch = (q) => {
  if (!q) {
    loadLanding();
    return;
  }

  let main = document.querySelector('main');

  if (main.classList.contains('landing')) main.classList.remove('landing');
  main.classList.add('search');

  main.appendChild(document.querySelector('#search-template').content.cloneNode(true));

  let searchForm = document.querySelector('form.search-area');
  let input = searchForm.querySelector('.search-input');

  input.value = q;

  mockLinks();
  doSearchForm();
  doFilters();
}

const unloadSearch = () => {

}

window.addEventListener('load', () => {
  let url = new URLSearchParams(window.location.search);

  console.log(url);

  if (!url.has('q')) {
    loadLanding();
  } else {
    loadSearch(url.get('q'));
  }
})

