(function () {
    'use strict';
 
    angular
        .module('app.account')
        .controller('AccountController', AccountController);
    AccountController.$inject = ['$location', 'dataservice', 'logger', '$rootScope', '$scope'];
    function AccountController($location, dataservice, logger, $rootScope, $scope) {
        var vm = this;
 
        $scope.show = true;
        $scope.nametop = 80;
        $scope.nameleft = '44%';
        $scope.pictop = 180;
        $scope.picleft = '42%';
        
        vm.fullname = $rootScope.globals.currentUser.fullname;
        vm.picurl = $rootScope.globals.currentUser.picurl;
        vm.logout = logout;
 
        (function initController() {
            var credentials = localStorage.getItem("yossiapp");
            $rootScope.globals = credentials ? JSON.parse(credentials) : {};
            if ($rootScope.globals.currentUser) 
            {
                if($rootScope.globals.currentUser.namePos)
                {
                    var x = $rootScope.globals.currentUser.namePos.left || $scope.nameleft;
                    var y = $rootScope.globals.currentUser.namePos.top || $scope.nametop;
                    $scope.nameleft = x;
                    $scope.nametop = y;
                }
                if($rootScope.globals.currentUser.picPos)
                {
                    var x = $rootScope.globals.currentUser.picPos.left || $scope.picleft;
                    var y = $rootScope.globals.currentUser.picPos.top || $scope.pictop;
                    $scope.picleft = x;
                    $scope.pictop = y;
                }
            }
        })();
 
        function logout() {
            dataservice.clearCredentials();
            $location.path('/');
        };
        
        
    }
 
})();




