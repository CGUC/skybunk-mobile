import ApiClient from '../ApiClient';

module.exports = {
	getPoll: function(postID) {
		return new Promise(function(resolve, reject) {
      ApiClient.get(`/posts/${postID}/poll`, {authorized: true}).then(poll => {
        resolve(poll);
      }).catch(error => {
        reject(error);
      });
		});
	},
	createPoll: function(postID, data) {
		return new Promise(function(resolve, reject) {
			ApiClient.post(`/posts/${postID}/poll`, data, {authorized: true})
      .then(response => response.json())
      .then(poll => {
        resolve(poll);
			}).catch(error => {
				reject(error);
			});
		});
	},
	pollOption: function(postID, option) {
		return new Promise(function(resolve, reject) {
      ApiClient.post(`/posts/${postID}/poll/option`, option, {authorized: true})
      .then(response => response.json())
      .then(poll => {
        resolve(poll);
      }).catch(error => {
        reject(error);
      });
		});
	},
	pollVote: function(postID, data) {
		return new Promise(function(resolve, reject) {
      ApiClient.post(`/posts/${postID}/poll/vote`, data, {authorized: true})
      .then(response => response.json())
      .then(poll => {
        resolve(poll);
      }).catch(error => {
        reject(error);
      });
		});
	},
}
