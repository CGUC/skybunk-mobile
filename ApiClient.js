var config = require('./config');

export default class ApiClient {

	static get(endpoint) {
		return fetch(`${config.API_ADDRESS}${endpoint}`)
			.then(response => response.json())
			.then(responseJSON => {
				return responseJSON;
			})
			.catch(err => {
				err = err.replace('<', '').replace('>', '');
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
		});
	}

	static delete(endpoint) {
		return fetch(`${config.API_ADDRESS}${endpoint}`, { method: 'DELETE' });
	}
}