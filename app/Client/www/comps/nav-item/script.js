app.directive('navItem', function() {
    return {
        restrict: 'E',
        scope: {
            hotkey: '@',
			label: '@',
			back:'@'
        },
        templateUrl: 'comps/nav-item/markup.html',
    };
});

