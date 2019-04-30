import { Cache } from "react-native-cache";
import ApiClient from '../ApiClient';
import {AsyncStorage, MemoryStore, Platform} from 'react-native';
import date from 'date-fns';

var backend
if(Platform.OS == 'android') backend = MemoryStore
else backend = AsyncStorage

const profilePicCache = new Cache({
	namespace: "skybunk-profile-pictures",
	policy: {
		maxEntries: 30
	},
	backend: backend
});

const postPicCache = new Cache({
	namespace: "skybunk-post-pictures",
	policy: {
		maxEntries: 15
	},
	backend: backend
});

module.exports = {
	getProfilePicture: function(userID){
		return new Promise(function(resolve, reject) {
			//Try to get the item from the cache
			profilePicCache.getItem(userID, function(err, cachedPic) {
				if(err){
					reject(err);
				}else if(!cachedPic || !cachedPic.image || date.differenceInHours(new Date(),cachedPic.timeFetched)>24){
					//cache miss, or over 24 hours old, so go fetch a new copy
					ApiClient.get(`/users/${userID}/profilePicture`, {authorized: true}).then(pic => {

						//save fetched item to cache
						profilePicCache.setItem(userID, {timeFetched: new Date(), image: pic}, function(err) {
							if(err){
								reject(err);
							}else{
								resolve(pic);
							}
						});
					  }).catch(error => {
						reject(error);
					  });
				}else{
					//cache hit, so just return the picture
					resolve(cachedPic.image);
				}
			});
		});
	},
	setProfilePicture: function(userID, pictureURI){
		return new Promise(function(resolve, reject) {
			ApiClient.uploadPhoto(
				`/users/${userID}/profilePicture`,
				pictureURI,
				'profilePicture',
				{authorized: true}
			  )
				.then(pic => {
					profilePicCache.setItem(userID, {timeFetched: new Date(), image: pic}, err => {
						if(err){
							reject(err)
						}else{
							resolve(pic);
						}
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	getPostPicture: function(postID){
		return new Promise(function(resolve, reject) {
			//Try to get the item from the cache
			postPicCache.getItem(postID, function(err, cachedPic) {
				if(err){
					reject(err);
				}else if(!cachedPic || !cachedPic.image || date.differenceInHours(new Date(),cachedPic.timeFetched)>24){
					//cache miss, or over 24 hours old, so go fetch a new copy
					ApiClient.get(`/posts/${postID}/image`, {authorized: true}).then(pic => {

						//save fetched item to cache
						postPicCache.setItem(postID, {timeFetched: new Date(), image: pic}, function(err) {
							if(err){
								reject(err);
							}else{
								resolve(pic);
							}
						});
					  }).catch(error => {
						reject(error);
					  });
				}else{
					//cache hit, so just return the picture
					resolve(cachedPic.image);
				}
			});
		});
	},
	setPostPicture: function(postID, pictureURI){
		return new Promise(function(resolve, reject) {
			ApiClient.uploadPhoto(
				`/posts/${postID}/image`,
				pictureURI,
				'image',
				{authorized: true, method: 'POST'}
			  ).then(pic => {
					postPicCache.setItem(postID, {timeFetched: new Date(), image: pic}, err => {
						if(err){
							reject(err)
						}else{
							resolve(pic);
						}
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	clearCache: function(){
		return new Promise(function(resolve, reject) {
			profilePicCache.clearAll(err => {
				if(err){
					reject(err);
				}else{
					postPicCache.clearAll(err => {
						if(err) reject(err);
						resolve();
					})
				}
			});
		});
	}
}