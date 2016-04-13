(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('userservice', userservice);

    userservice.$inject = ['$http', '$q', '$timeout'];
    function userservice($http, $q,$timeout) 
    {
        var service = {};

        service.validateUser = validateUser;
        service.getUser = getUser;

        return service;

        function validateUser(username, password) {
            var deferred = $q.defer();
            $timeout(function() {
                var user = getUser(username, password);
                deferred.resolve(user.success ? user : null);
            }, 100);
            return deferred.promise;
        }


        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function() {
                return { success: false, message: error };
            };
        }
    }

    function getUser(username, password) {
        //return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        var isValidUser = (username === 'yossi') && (password === '1234');
        var user = isValidUser ? { success: true, name: 'Yossi Regev', pic: 'content/images/user.jpg', message: 'Login Success' } :
            { success: false, message: 'Username or password is incorrect' };
        return user;
    }
})();