/**
 * This is where the app interacts with the server to provide and store data.
 * These methods should only be called from views, and the data passed down into core components.
 */
var config = require('../config');
var _ = require('lodash');

/**
 * @param {string} resource
 * ie posts/123/comments
 */
export const getResource = async (resource) => {
  return new Promise((resolve, reject) => {
    fetch(`${config.API_ADDRESS}/${resource}`)
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * @param {string} resource
 * @param {object} data
 *
 */
export const createResource = (resource, data) => {
  return new Promise((resolve, reject) => {
    fetch(`${config.API_ADDRESS}/${resource}`, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      //mode: 'cors' -> might need this for accessing resources at server domain
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const updateResource = (resource, data) => {
  return new Promise((resolve, reject) => {
    fetch(`${config.API_ADDRESS}/${resource}`, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      //mode: 'cors'
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const deleteResource = (resource) => {
  return new Promise((resolve, reject) => {
    fetch(`${config.API_ADDRESS}/${resource}`, { method: 'DELETE' })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}