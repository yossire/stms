(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('myDrag', myDrag);

    function myDrag(dataservice) {
        return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    //debugger;
                    element.draggable({
                        cursor: "move",
                        stop: function(event, ui) {
                            scope[attrs.xpos] = ui.position.left;
                            scope[attrs.ypos] = ui.position.top;
                            scope.$apply();
                            
                            switch(element[0].id)
                            {
                                case "fullname":
                                    dataservice.setPositions('name', ui.position.left, ui.position.top);
                                    break;
                                case "userimage":
                                    dataservice.setPositions('pic', ui.position.left, ui.position.top);
                                    break;
                                default:
                                    break;
                            }
                        }
                        
                    });
                }
            };
    }

})();

