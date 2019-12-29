var config = require('./config');
import {AsyncStorage} from 'react-native';

var servers;
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

	static async getAuthToken() {
		if(servers != undefined) return servers[0].token;
		servers = JSON.parse(await AsyncStorage.getItem('@Skybunk:servers'));
		return servers[0].token;
	}

	static async getServerUrl() {
		if(servers != undefined) return servers[0].url;
		servers = JSON.parse(await AsyncStorage.getItem('@Skybunk:servers'));
		return servers[0].url;
	}

	static async getServers() {
		if(servers != undefined) return servers;
		servers = JSON.parse(await AsyncStorage.getItem('@Skybunk:servers'));
		return servers;
	}

	static async setServers(_servers) {
		servers = _servers;

		if(servers.token != undefined){ //reverse compatibility
			servers = [{
                name: "legacy",
                url: config.AUTH_ADDRESS,
                token: servers.token,
              }];
		}
		await AsyncStorage.setItem('@Skybunk:servers', JSON.stringify(servers));
	}

	static async clearServers() {
		await AsyncStorage.removeItem('@Skybunk:servers');
		servers = undefined;
	}

	static async get(endpoint, options={}) {
		const serverUrl = await this.getServerUrl();
		return fetch(`${serverUrl}${endpoint}`, {
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
		const serverUrl = await this.getServerUrl();
		return fetch(`${serverUrl}${endpoint}`, {
			method: 'POST',
			headers: await this.formatHeaders(options),
			body: JSON.stringify(body),
		})
		.catch(err => {
			err = err.replace(/</g, '').replace(/>/g, '');
			console.error(err);
		});
	};

	static async register(newUser, options={}) {
		if (!newUser.username) return {message: 'Username is required'};
		if (!newUser.password) return {message: 'Password is required'};
		if (!newUser.firstName) return {message: 'First name is required'};
		if (!newUser.lastName) return {message: 'Last name is required'};
		if (!newUser.goldenTicket) return {message: 'golden ticket is required'};
		
		const authResponse = await fetch(`${config.AUTH_ADDRESS}/users`, {
			method: 'POST',
			headers: await this.formatHeaders(options),
			body: JSON.stringify(newUser),
		});
		const authResponseJson = await authResponse.json();

		if (authResponseJson.servers) {
			this.setServers(authResponseJson.servers);
			return await this.post('/users', newUser);
		}
		return {message: authResponseJson};
	};

	static async login(username, password, options={},) {
		return fetch(`${config.AUTH_ADDRESS}/users/login`, {
			method: 'POST',
			headers: await this.formatHeaders(options),
			body: JSON.stringify({username, password}),
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

		const serverUrl = await this.getServerUrl();
		return fetch(`${serverUrl}${endpoint}`, {
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

		const serverUrl = await this.getServerUrl();
		return fetch(`${serverUrl}${endpoint}`, {
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
		const serverUrl = await this.getServerUrl();
		return fetch(`${serverUrl}${endpoint}`, {
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
