var config = require('./config');
import {AsyncStorage} from 'react-native';

var token;
export default class ApiClient {
	static async formatHeaders(options){
		const contentType = options.contentType ? options.contentType : 'application/json'
		if(options.authorized){
			return  {
				'Accept': 'application/json',
				'Content-Type': contentType,
				'Authorization': 'Bearer ' + await this.getAuthToken(),
				...options.headers
			}
		}
		else {
			return  {
				'Accept': 'application/json',
				'Content-Type': contentType,
				...options.headers
			}
		}
	}
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

	static async get(endpoint, options={}) {

		return fetch(`${config.API_ADDRESS}${endpoint}`, {
				method: 'GET',
				headers: await this.formatHeaders(options),
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

	static async post(endpoint, body, options={}) {

		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: 'POST',
			headers: await this.formatHeaders(options),
			body: JSON.stringify(body),
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	};

	static async put(endpoint, body, options={}) {
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
			headers: await this.formatHeaders(options),
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

	static async uploadPhoto(endpoint, uri, name, options={}) {
		const method = options.method ? options.method : 'PUT'

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
			headers: await this.formatHeaders({...options, contentType: 'multipart/form-data'}),
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

	static async delete(endpoint, options={}) {

		return fetch(`${config.API_ADDRESS}${endpoint}`, {
			method: 'DELETE',
			headers: await this.formatHeaders(options)
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
