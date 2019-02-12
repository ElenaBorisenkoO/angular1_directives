(function() {
  const directives = {};
  const smallAngular = {

    directive(name, cb) {
      directives[name] = [cb];
    },

    compile(node) {
      const atributeNames = node.getAttributeNames();

      if (atributeNames)
      { atributeNames.forEach(item => {
        if (item.startsWith('ng-')) {
          if (directives[item])
          { directives[item].forEach(cb => cb(node)); }
        }
      }); }
    },

    bootstrap(node) {
      if (!node) {
        // eslint-disable-next-line no-param-reassign
        node = document.querySelector('*[ng-app]');
      }

      if (!node) {
        throw new TypeError('Cannot initialize app');
      }
      node.querySelectorAll('*').forEach(el => {
        this.compile(el);
      });
    }
  };


  smallAngular.directive('ng-model', function(el) {
  });

  smallAngular.directive('ng-click', function(el) {
  });

  smallAngular.directive('ng-show', function(el) {
  });

  smallAngular.directive('ng-hide', function(el) {
  });

  smallAngular.directive('make_short', function(el) {
  });

  window.smallAngular = smallAngular;
}());

