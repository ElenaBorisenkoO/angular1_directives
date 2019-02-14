/* eslint-disable no-console*/
/* eslint-disable no-eval */
(function() {
  const directives = {};
  const watchers = [];
  const rootScope = window;
  rootScope.onClick = () => {
    rootScope.name = 'vasya';
  };
  rootScope.$watch = (name, watcher) => {
    watchers.push({ name, watcher });
  };
  rootScope.$apply = () => {
    watchers.forEach(({ watcher }) => watcher());
  };
  rootScope.surname = 'borisenko';

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
          if (directives[item] && item.startsWith('ng-')) {
            directives[item].forEach(cb => cb(rootScope, node, node.getAttribute(item)));
          } else if (directives[item] && !item.startsWith('ng-')) {
            directives[item].forEach(cb => cb(rootScope, node, node.attributes));
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
  smallAngular.directive('ng-model', function(scope, el) {
    const data = el.getAttribute('ng-model');
    el.addEventListener('input', e => {
      scope[data] = el.value;
      scope.$apply();
    });
  });
  smallAngular.directive('ng-bind', function(scope, el) {
    const data = el.getAttribute('ng-bind');

    if (data in scope) {
      el.innerHTML = scope[data];
    }
    rootScope.$watch(data, () => {
      el.innerHTML = scope[data];
    });
  });
  smallAngular.directive('ng-init', function(scope, el) {
    const data = el.getAttribute('ng-init');
    rootScope.name = eval(data);
  });

  smallAngular.directive('ng-repeat', function(scope, el, attrs) {
    const data = el.getAttribute('ng-repeat');
    const letters = eval(data.split('in')[1]).split('');
    console.log(letters);

    letters.forEach(letter => {
      const li = el.cloneNode();
      li.innerText = letter;
      const parent = el.parentNode;
      parent.insertBefore(li, el);
    });
  });

  smallAngular.directive('ng-click', function(scope, el) {
    const data = el.getAttribute('ng-click');
    el.addEventListener('click', e => {
      eval(data);
      scope.$apply();
    });
  });
  smallAngular.directive('ng-show', function(scope, el, attrs) {
    const data = el.getAttribute('ng-show');
    el.style.display = eval(data) ? 'block' : 'none';
    rootScope.$watch(data, () => {
      el.style.display = eval(data) ? 'block' : 'none';
    });
  });
  smallAngular.directive('ng-hide', function(scope, el, attrs) {
    const data = el.getAttribute('ng-hide');
    el.style.display = eval(data) ? 'none' : 'block';
    rootScope.$watch(data, () => {
      el.style.display = eval(data) ? 'none' : 'block';
    });
  });
  smallAngular.directive('to-uppercase', function(scope, el, attrs) {
    el.innerHTML = el.innerHTML.toUpperCase();
    rootScope.$watch(el, () => {
      el.innerHTML = el.innerHTML.toUpperCase();
    });
  });
  smallAngular.directive('make-short', function(scope, el, attrs) {
    const length = el.getAttribute('length');
    el.innerText = el.innerText.slice(0, eval(length));
    rootScope.$watch(length, () => {
      el.innerText = el.innerText.slice(0, eval(length));
    });
  });
  smallAngular.directive('random-color', function(scope, el, attrs) {
    el.addEventListener('click', function() {
      const letters = '0123456789ABCDEF'.split('');
      let color = '#';

      for (let i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      el.style.backgroundColor = color;
    });
  });

  window.smallAngular = smallAngular;
  smallAngular.bootstrap(document.querySelector('body'));
}());