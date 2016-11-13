app.directive('navItem', function() {
    return {
        restrict: 'E',
        scope: {
            hotkey: '@',
			label: '@',
            page:'@'
        },
        templateUrl: 'comps/nav-item/markup.html',
    };
});

