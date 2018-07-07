var config = require('./config');

export default class ApiClient {

	static get(endpoint, headers) {
		return fetch(`${config.API_ADDRESS}${endpoint}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					...headers,
				},
			})
			.then(response => {
				return response.json();
			})
			.then(responseJSON => {
				return responseJSON;
			})
			.catch(err => {
				//err = err.replace('<', '').replace('>', '');
				console.error(err);
			});
	}

	static post(endpoint, headers, body) {
		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...headers,
			},
			body: JSON.stringify(body),
		})
		.catch(err => {
			console.error(err);
		});
	};

	static put(endpoint, headers, body) {
		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...headers,
			},
			body: JSON.stringify(body),
		})
		.then(response => console.log(response))
		.then(responseJSON => {
			console.log(responseJSON)
			return responseJSON;
		})
		.catch(err => {
			console.error(err);
		});
	}

	static delete(endpoint) {
		return fetch(`${config.API_ADDRESS}${endpoint}`, { method: 'DELETE' })
		.catch(err => {
			console.error(err);
		});;
	}
}