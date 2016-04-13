(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.widgets',
        'app.account',
        'app.dashboard',
        'app.layout'
    ]).run(run);
    run.$inject = ['$rootScope', '$location', '$http', 'dataservice', 'userservice'];
        function run($rootScope, $location, $http, dataservice, userservice) {
            debugger;
            // keep user logged in after page refresh
            var credentials = localStorage.getItem("yossiapp");
            $rootScope.globals = credentials ? JSON.parse(credentials) : {};
            var isValidUser = true;
            if ($rootScope.globals.currentUser) 
            {
                var decodedAuth = dataservice.silentLogin();
                if(decodedAuth != null)
                {
                    userservice.validateUser(decodedAuth.username, decodedAuth.password)
                        .then(function (user) {
                            if (user == null) {
                                dataservice.clearCredentials();
                                $location.path('/');
                            }
                            else
                            {
                                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
                            }
                        });
                }
                else
                {
                    isValidUser = false;
                }
            }
            else
            {
                isValidUser = false;
            }
            
            if(!isValidUser)
            {
                dataservice.clearCredentials();
                $location.path('/');
            }
    
            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in and trying to access a restricted page
                
                var restrictedPage = $.inArray($location.path(), ['/']) === -1;
                var loggedIn = $rootScope.globals.currentUser;
                if (restrictedPage && !loggedIn) {
                    $location.path('/');
                }
                if(!restrictedPage && loggedIn)
                {
                    $location.path('/myAccount');
                }
            });
        }
})();
