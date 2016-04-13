(function () {
    'use strict';
 
    angular
        .module('app.dashboard')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$location', 'dataservice', 'logger'];
    
    function LoginController($location, dataservice, logger) {
        var vm = this;
        vm.login = login;
        vm.isShowForm = true;
        /*(function initController() {
            var silent = dataservice.silentLogin();
            if(silent != null)
            {
                dataservice.login(silent.username, silent.password, function (response) {
                    if (response.success) {
                        $location.path('/myAccount');
                    }
                    else
                    {
                        vm.isShowForm = true;
                    }
                });
            }
            else
                vm.isShowForm = true;
        })();*/
        function login() {
            vm.dataLoading = true;
            dataservice.clearCredentials();
            performLogin(vm.username, vm.password);
        };
        
        function performLogin(username, password)
        {
            dataservice.login(username, password, function (response) {
                if (response.success) {
                    //logger.info(response.message);
                    dataservice.setCredentials(username, password, response.name, response.pic);
                    $location.path('/myAccount');
                } else {
                    logger.error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }
 
})();




