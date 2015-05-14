alt.directive 'listInspirations', ->
  return {
    restrict: 'AE',
    templateUrl: '/views/directives/list-inspirations.html'
  }

alt.directive 'fancybox', ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      $(element).fancybox()
      if scope.$last
        $('.fancybox').fancybox
      return

  }