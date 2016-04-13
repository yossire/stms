(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice($http, $location, $q, exception, logger, $rootScope, $timeout, userservice) 
    {
        var isPrimed = false;
        var primePromise;
        var service = {
            login: login,
            silentLogin: silentLogin,
            setCredentials: setCredentials,
            setPositions: setPositions,
            clearCredentials: clearCredentials,
            ready: ready
        };

        return service;

        function silentLogin() {
            var credentials = localStorage.getItem("yossiapp");
            var data = credentials ? JSON.parse(credentials) : {};
            if (data.currentUser) 
            {
                var authdata = Base64.decode(data.currentUser.authdata);
                if((authdata != null) && (authdata.charAt(':' != -1)))
                {
                    var data = authdata.split(":");
                    if(data.length == 2)
                    {
                        var username = data[0];
                        var password = data[1];
                        return { username: username, password: password };
                    }
                }
            }
            
            return null;
        }


        function login(username, password, callback) {
                var response;
                userservice.validateUser(username, password)
                    .then(function (user) {
                        if (user != null) {
                            response = user;
                        } else {
                            response = { success: false, message: 'Username or password is incorrect' };
                        }
                        callback(response);
                    });
        }
        
        function setPositions(type, left, top) {
            
            switch(type)
            {
                case "name":
                    $rootScope.globals.currentUser.namePos = {'left': left, 'top': top};
                    break;
                case "pic":
                    $rootScope.globals.currentUser.picPos = {'left': left, 'top': top};
                    break;
                default:
                    break;
            }
             
            localStorage.setItem('yossiapp',JSON.stringify($rootScope.globals));
        }
 
        function setCredentials(username, password, fullname, picurl) {
            var authdata = Base64.encode(username + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
                    fullname: fullname,
                    picurl: picurl
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            localStorage.setItem('yossiapp',JSON.stringify($rootScope.globals));
            //localStorage.setItem('yossiapp',authdata);
        }
 
        function clearCredentials() {
            $rootScope.globals = {};
            localStorage.removeItem('yossiapp');
            $http.defaults.headers.common.Authorization = 'Basic';
        }

        function prime() {
            // This function can only be called once.
            if (primePromise) {
                return primePromise;
            }

            primePromise = $q.when(true).then(success);
            return primePromise;

            function success() {
                isPrimed = true;
            }
        }

        function ready(nextPromises) {
            var readyPromise = primePromise || prime();

            return readyPromise
                .then(function() { return $q.all(nextPromises); })
                .catch(exception.catcher('"ready" function failed'));
        }

    }
    // Base64 encoding service used by AuthenticationService
    var Base64 = {
 
        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
 
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
})();
