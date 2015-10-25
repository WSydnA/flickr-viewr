(function(){

  angular
       .module('flickrItems')
       .controller('FlickrItemController', [
          'flickrItemService', '$mdBottomSheet', '$mdToast', '$log', '$http', '$q',
          FlickrItemController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function FlickrItemController(itemService, $mdBottomSheet, $mdToast, $log, $http, $q) {
    var self = this;
    self.selected         = null;
    self.tags             = 'potato'; // Default tag(s) to search for
    self.items            = [ ];
    self.showItemDetails  = showItemDetails;
    self.showTagSearch    = showTagSearch;
    self.searchTags       = searchTags;

    // Fire initial search
    self.searchTags();

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Search for tags (using self.tags)
     */
    function searchTags() {
      itemService
        .loadAllItems(self.tags)
        .then( function( items ) {
          self.items    = [].concat(items);
        });
    }

    /**
     * Show the details sheet
     * @param item id
     * @param event
     */
    function showItemDetails(item, $event) {
        self.selected = item;

        return $mdBottomSheet.show({
          parent: angular.element(document.body),
          templateUrl: './src/flickrItems/view/detailsSheet.html',
          controller: [ '$mdBottomSheet', DetailsPanelController],
          controllerAs: "detailsCtrl",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedOption) {
          if (clickedOption) {
            $log.debug( clickedOption.name + ' clicked!');
          }
        });

        /**
         * Bottom Sheet controller for the detail actions
         * @param $mdBottomSheet
         */
        function DetailsPanelController($mdBottomSheet) {
          this.item = item;
          this.actions = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.submitContact = function(action) {
            $mdBottomSheet.hide(action);
          };
        }
    }

    /**
     * Show the tags search area
     */
    function showTagSearch() {

      $mdToast.show({
        parent : angular.element(document.querySelector('#toolbar')),
        templateUrl: './src/flickrItems/view/tagsSearch.html',
        controller: [ '$mdToast', TagsSearchController],
        controllerAs: "tagSearchCtrl",
        position: 'top right',
        hideDelay: 0,
      });

      setTimeout(function(){
        document.querySelector('#tags-search-input').focus();
      }, 0);

      /**
       * Controller for tags search area
       * @param $mdToast
       */
      function TagsSearchController($mdToast) {

        this.tags = self.tags;

        this.search = function() {
          self.tags = this.tags
          self.searchTags();
        };

        this.close = function() {
          $mdToast.hide();
        };
      }

    }
  }

})();
