app.directive('navItem', function() {
    return {
        restrict: 'E',
        scope: {
            hotkey: '@',
			label: '@'
        },
        templateUrl: 'comps/nav-item/markup.html',
    };
});

