
self.addEventListener('activate', function (event) {

});

self.addEventListener('fetch', function (event) {

});

self.addEventListener('push', function (event) {
console.log('this is service worker -push: ', event);
});