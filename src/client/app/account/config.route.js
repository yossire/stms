(function() {
    'use strict';

    angular
        .module('app.account')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/myAccount',
                config: {
                    templateUrl: 'app/account/account.html',
                    controller: 'AccountController',
                    controllerAs: 'vm',
                    title: 'My Account',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Account'
                    }
                }
            }
        ];
    }
})();
