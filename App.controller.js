App.controller("AppController", function ($scope, IndexedDb) {
  $scope.pippo = IndexedDb;
  $scope.ListOfElement = [];

  $scope.checkedValigia = false;

  $scope.ruleset = function (e) {
    var ruleset = {
      "bg-success": e.valigia,
      "bg-primary": e.zaino,
      "bg-danger": e.preparazione,
      "bg-warning": e.pronto,
      "text-dark": e.pronto,
      "bg-info": e.check
    };
    return ruleset;
  };

  $scope.pappo = () => {
    $scope.checkedValigia = !$scope.checkedValigia;
  };

  $scope.ClickedZaino = false;

  $scope.ClickZaino = function () {
    $scope.ClickedZaino = !$scope.ClickedZaino;
  };

  $scope.ClickedSistemare = false;

  $scope.ClickSistemare = function () {
    $scope.ClickedSistemare = !$scope.ClickedSistemare;
  };

  $scope.$watch(
    "ListOfElement",
    function (
      newValue = $scope.ListOfElement,
      oldValue = $scope.ListOfElement
    ) {
      if (oldValue != newValue && oldValue.length !== 0) {
        $scope.pippo.InsertData(newValue, "insert");
      }
    },
    true
  );

  this.$doCheck = async () => {
    $scope.inValigia =
      $scope.ListOfElement !== undefined
        ? $scope.ListOfElement.filter(e => e.valigia)
        : [];
    $scope.inZaino =
      $scope.ListOfElement !== undefined
        ? $scope.ListOfElement.filter(e => e.zaino)
        : [];
    $scope.controllare =
      $scope.ListOfElement !== undefined
        ? $scope.ListOfElement.filter(e => e.preparazione || e.check)
        : [];
    $scope.clickedValigia = false;
  };

  var element = function (name = "", value = 0) {
    this.key;
    this.name = name;
    this.value = value;
    this.preparazione = true;
    this.valigia = false;
    this.zaino = false;
    this.pronto = false;
    this.commenti = "";
    this.check = false;
  };

  $scope.ToggleValigia = element => {
    element.preparazione = false;
    element.valigia = true;
    element.zaino = false;
    element.pronto = false;
    element.check = false;
  };

  $scope.ToggleZaino = element => {
    element.preparazione = false;
    element.valigia = false;
    element.zaino = true;
    element.pronto = false;
    element.check = false;
  };

  $scope.TogglePronto = element => {
    element.preparazione = false;
    element.valigia = false;
    element.zaino = false;
    element.pronto = true;
    element.check = false;
  };

  $scope.ToggleCheck = element => {
    element.preparazione = false;
    element.valigia = false;
    element.zaino = false;
    element.pronto = false;
    element.check = true;
  };

  $scope.delete = element => {
    $scope.ListOfElement = $scope.ListOfElement.filter(e => e !== element);
    $scope.pippo.InsertData([], "delete", element.key);
  };

  $scope.element = new element();

  $scope.AddElement = function () {
    $scope.element.key = $scope.ListOfElement.length;
    $scope.ListOfElement.push(angular.copy($scope.element));
    console.log($scope.ListOfElement);
    $scope.element = new element();
  };

  this.$onInit = async () => {
    let pippo = await $scope.pippo.InsertData();
    $scope.$apply(() => {
      $scope.ListOfElement = pippo;
    });

    console.log($scope.ListOfElement);
    this.oldValue = $scope.ListOfElement;
  };
});

function IndexedDb() {
  this.InsertData = async function (ListOfElement, mode, key) {
    return new Promise(function (resolve, reject) {
      this.request = window.indexedDB.open("Vacanze2020", 10);
      this.db;
      this.tx;
      this.index;
      this.store;
      this.result;

      this.request.onupgradeneeded = function (e) {
        let db = this.request.result;

        this.store = db.createObjectStore("ElementObjectStore", {
          keyPath: "key"
        });
        this.index = this.store.createIndex("key", "key", { unique: false });
        console.log("onupgradeneeded fired");
      }.bind(this);
      var result;

      this.request.onerror = function (e) {
        console.log(e);
      };
      this.request.onsuccess = function () {
        this.db = this.request.result;
        this.tx = this.db.transaction("ElementObjectStore", "readwrite");
        this.store = this.tx.objectStore("ElementObjectStore");
        //index = store.index("");
        this.db.onerror = function (e) {
          console.log(e);
        };
        if (mode == "insert") {
          for (let elem of ListOfElement) {
            this.store.put(elem);
          }
        }

        if (mode == "delete") {
          this.store.delete(key);
        }

        var objectStoreRequest = this.store.getAll();

        objectStoreRequest.onsuccess = function () {
          this.result = objectStoreRequest.result;
          resolve(this.result);
        };

        this.db.close;
      }.bind(this);
    });
  };
}

App.service("IndexedDb", IndexedDb);

App.directive("ngButton", function () {
  return {
    link: function (scope, element = $(""), attribute, controller) {
      const classes = `btn btn-sm btn-success 
                             border border-dark 
                             d-none d-sm-block`;

      element.addClass(classes);

      if (scope.e.valigia) {
        element.addClass("d-none");
      }

      scope.title = "Valigia";
    },

    controller: function ($scope, $element) {
      $scope.$watch("e.valigia", function (newValue, oldValue) {
        if (oldValue != newValue) {
          if (!newValue) {
            $element.show();
          } else {
            $element.hide();
          }
        }
      });
    }
  };
});
