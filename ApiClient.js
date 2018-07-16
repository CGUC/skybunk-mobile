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
			.then(response => response.json())
			.then(responseJSON => {
				return responseJSON;
			})
			.catch(err => {
				err = err.replace(/</g, '').replace(/>/g, '');
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
			err = err.replace(/</g, '').replace(/>/g, '');
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
		.then(response => {
			return response.json()
		})
		.then(responseJSON => {
			return responseJSON
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	}

	static uploadPhoto(endpoint, headers, uri, name) {
		let uriParts = uri.split('.');
		let fileType = uriParts[uriParts.length - 1];

		let formData = new FormData();
		formData.append(name, {
			uri,
			name: `${name}.${fileType}`,
			type: `image/${fileType}`,
		});

		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				...headers,
			},
			body: formData,
		})
		.then(response => response.json())
		.then(responseJSON => responseJSON)
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	}

	static delete(endpoint, headers) {
		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				...headers,
			}
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});;
	}
}