app.directive('stackItem', function() {
    return {
        restrict: 'E',
        scope: {
            page:'@'
        },
        templateUrl: 'comps/stack-item/markup.html',
    };
});