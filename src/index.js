import { Notify } from 'notiflix/build/notiflix-notify-aio';
import * as Lodash from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const search = document.querySelector('#search-box')
const list = document.querySelector('.country-list')
const info = document.querySelector('.country-info')

search.addEventListener('input', Lodash(searchQuery, DEBOUNCE_DELAY));

function searchQuery() {
	list.innerHTML = '';
	info.innerHTML = '';
	const name = search.value.trim()
	if (name) {
		fetchCountries(name)
			.then(response => {
				if (response.length > 10) {
					Notify.info('Too many matches found. Please enter a more specific name.')
				} else if (response.length > 1) {
					list.insertAdjacentHTML('beforeend', response.map(el => `<li class="list-item">
					<img class="flag" src="${el.flags.svg}" alt="${el.name.official}">
					<p>${el.name.official}</p>
					</li>`).join(''));
				} else {
					info.insertAdjacentHTML('beforeend', `<ul class="info-list">
					<li class="list-item">
						<img class="flag" src="${response[0].flags.svg}" alt="${response[0].name.official}">
						<h1>${response[0].name.official}</h1></li>
					<li class="list-item"><h2>Capital: </h2><p>${response[0].capital}</p></li>
					<li class="list-item"><h2>Population: </h2><p>${response[0].population}</p></li>
					<li class="list-item"><h2>Languages: </h2><p>${Object.values(response[0].languages).join(', ')}</p></li>
					</ul>`);
				}
			})
			.catch(err => {
				Notify.failure('Oops, there is no country with that name')
			});
	}
}