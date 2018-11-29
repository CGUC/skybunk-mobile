import { Cache } from "react-native-cache";
import ApiClient from '../ApiClient';
import {AsyncStorage} from 'react-native';
import date from 'date-fns';

const profilePicCache = new Cache({
	namespace: "skybunk-profile-pictures",
	policy: {
		maxEntries: 30
	},
	backend: AsyncStorage
});

const postPicCache = new Cache({
	namespace: "skybunk-post-pictures",
	policy: {
		maxEntries: 15
	},
	backend: AsyncStorage
});

module.exports = {
	getProfilePicture: function(userID){
		return new Promise(function(resolve, reject) {
			//Try to get the item from the cache
			profilePicCache.getItem(userID, function(err, cachedPic) {
				if(err){
					reject(err);
				}else if(!cachedPic || !cachedPic.image || date.differenceInHours(new Date(),cachedPic.timeFetched)>2){
					console.log("Missed profile!")
					//cache miss, or over 2 hours old, so go fetch a new copy
					ApiClient.get(`/users/${userID}/profilePicture`, {}).then(pic => {

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
					console.log("Hit profile!")
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
				{},
				pictureURI,
				'profilePicture'
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
				}else if(!cachedPic || !cachedPic.image || date.differenceInHours(new Date(),cachedPic.timeFetched)>2){
					console.log("Missed!")
					//cache miss, or over 2 hours old, so go fetch a new copy
					ApiClient.get(`/posts/${postID}/image`, {}).then(pic => {

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
					console.log("Hit!")
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
				{},
				pictureURI,
				'image',
				'POST'
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
			profilePicCache.clearAll(function(err) {
				if(err){
					resolve();
				}else{
					reject(err);
				}
			});
		});
	}
}