/* eslint-disable no-console*/
(function() {
  const directives = {};
  const smallAngular = {

    directive(name, cb) {
      if (directives[name]) {
        directives[name].push(cb);
        return;
      }
      directives[name] = [cb];
    },

    compile(node) {
      const atributeNames = node.getAttributeNames();

      if (atributeNames) {
        atributeNames.forEach(item => {
          if (item.startsWith('ng-')) {
            if (directives[item]) {
              directives[item].forEach(cb => cb(node));
            }
          }
        });
      }
    },

    bootstrap(node) {
      let nodElem = node;

      if (!node) {
        nodElem = document.querySelector('*[ng-app]');
      }

      if (!node) {
        throw new TypeError('Cannot initialize app');
      }
      nodElem.querySelectorAll('*').forEach(el => {
        this.compile(el);
      });
    }
  };

  smallAngular.directive('ng-model', function(el) {
    console.log('model', el);
  });

  smallAngular.directive('ng-click', function(el) {
    console.log('click1', el);
  });

  smallAngular.directive('ng-click', function(el) {
    console.log('click2', el);
  });

  smallAngular.directive('ng-show', function(el) {
    console.log('show', el);
  });

  smallAngular.directive('ng-hide', function(el) {
    console.log('hide', el);
  });

  smallAngular.directive('make_short', function(el) {
    console.log('make it short');
  });

  window.smallAngular = smallAngular;
  smallAngular.bootstrap(document.querySelector('body'));
}());