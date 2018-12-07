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
				console.log(err);
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
		/**
		 * HACKFIX (Neil): Sending too many notification objects with requests has
		 * returned 413s and crashed the app. Here we're limiting the saved notifications to 30.
		 * This logic doesn't belong client-side, but putting it here should neutralize the bug for now.
		 */
		if (body.notifications) {
			console.log("Trimming notifications...");
			body.notifications = body.notifications.slice(0, 30);
		} else console.log("No notifications being sent");

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
			console.log(err);
		});
	}

	static uploadPhoto(endpoint, headers, uri, name, method = 'PUT') {
		let uriParts = uri.split('.');
		let fileType = uriParts[uriParts.length - 1];

		let formData = new FormData();
		formData.append(name, {
			uri,
			name: `${name}.${fileType}`,
			type: `image/${fileType}`,
		});

		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: method,
			headers: {
				Accept: 'application/json',
				...headers,
			},
			body: formData,
		})
		.then(response => {
			return response.json();
		})
		.then(responseJSON => responseJSON)
		.catch(err => {
			console.log(err);
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
			console.log(err);
		});;
	}

	static makeCancelable(promise) {
	  let hasCanceled_ = false;

	  const wrappedPromise = new Promise((resolve, reject) => {
	    promise.then(
	      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
	      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
	    );
	  });

	  return {
	    promise: wrappedPromise,
	    cancel() {
	      hasCanceled_ = true;
	    },
	  };
	};
}
