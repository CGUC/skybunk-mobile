export default class ApiClient {
	static post(endpoint, headers, body) {
		return fetch('http://api.grebelife.com' + endpoint, {
			method: 'POST',
			headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...headers,
			},
			body: JSON.stringify(body),
		});
	};

	// .... Add other stuff as needed because I am lazy
}