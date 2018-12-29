var config = require('./config');
import {AsyncStorage} from 'react-native';

var token;
export default class ApiClient {
	static async getAuthToken(){
		if(token != undefined) return token;
		token = await AsyncStorage.getItem('@Skybunk:token');
		return token;
	}

	static async setAuthToken(_token){
		token = _token;
		await AsyncStorage.setItem('@Skybunk:token', token);
	}

	static async clearAuthToken(){
		await AsyncStorage.removeItem('@Skybunk:token');
		token = undefined;
	}

	static async get(endpoint, headers, authorized) {
		if(authorized) headers = {'Authorization': 'Bearer ' + await this.getAuthToken(), ...headers}

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

	static async post(endpoint, headers, authorized, body) {

		if(authorized) headers = {'Authorization': 'Bearer ' + await this.getAuthToken(), ...headers}

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

	static async put(endpoint, headers, authorized, body) {
		/**
		 * HACKFIX (Neil): Sending too many notification objects with requests has
		 * returned 413s and crashed the app. Here we're limiting the saved notifications to 30.
		 * This logic doesn't belong client-side, but putting it here should neutralize the bug for now.
		 */
		if (body.notifications) {
			console.log("Trimming notifications...");
			body.notifications = body.notifications.slice(0, 30);
		} else console.log("No notifications being sent");

		if(authorized) headers = {'Authorization': 'Bearer ' + await this.getAuthToken(), ...headers}

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

	static async uploadPhoto(endpoint, headers, authorized, uri, name, method = 'PUT') {
		let uriParts = uri.split('.');
		let fileType = uriParts[uriParts.length - 1];

		let formData = new FormData();
		formData.append(name, {
			uri,
			name: `${name}.${fileType}`,
			type: `image/${fileType}`,
		});

		if(authorized) headers = {'Authorization': 'Bearer ' + await this.getAuthToken(), ...headers}

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
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	}

	static async delete(endpoint, headers, authorized) {
		if(authorized) headers = {'Authorization': 'Bearer ' + await this.getAuthToken(), ...headers}

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
