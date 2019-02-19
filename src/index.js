(function() {
  const directives = {};
  const watchers = [];
  const rootScope = window;

  rootScope.$watch = (name, watcher) => {
    watchers.push({ name, watcher });
  };
  rootScope.$apply = () => {
    watchers.forEach(({ watcher }) => watcher());
  };

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
    el.value = eval(data);
    el.addEventListener('input', e => {
      scope[data] = el.value;
      scope.$apply();
    });
    scope.$watch(data, () => {
      el.value = eval(data);
    });
  });

  smallAngular.directive('ng-bind', function(scope, el) {
    const data = el.getAttribute('ng-bind');
    el.innerText = scope[data];

    scope.$watch(data, () => {
      el.innerText = scope[data];
    });
  });

  smallAngular.directive('ng-init', function(scope, el) {
    const data = el.getAttribute('ng-init');
    scope.name = eval(data);
  });

  smallAngular.directive('ng-repeat', function(scope, el) {
    const data = el.getAttribute('ng-repeat');
    const dirName = data.split(' ')[2];
    const parentElem = el.parentNode;
    const appendElement = () => {
      const scopeName = scope[dirName];
      const letters = document.querySelectorAll(`[ng-repeat="${data}"]`);

      for (const elem of scopeName) {
        const li = el.cloneNode(false);

        li.innerText = elem;
        parentElem.appendChild(li);
      }

      letters.forEach(letter => letter.remove());
    };

    appendElement();

    scope.$watch(dirName, () => appendElement());
  });

  smallAngular.directive('ng-click', function(scope, el) {
    const data = el.getAttribute('ng-click');
    el.addEventListener('click', e => {
      eval(data);
      scope.$apply();
    });
  });

  smallAngular.directive('ng-show', function(scope, el) {
    const data = el.getAttribute('ng-show');
    el.style.display = eval(data) ? 'block' : 'none';
    scope.$watch(() => eval(data), () => {
      el.style.display = eval(data) ? 'block' : 'none';
    });
  });

  smallAngular.directive('ng-hide', function(scope, el) {
    const data = el.getAttribute('ng-hide');
    el.style.display = eval(data) ? 'none' : 'block';
    scope.$watch(() => eval(data), () => {
      el.style.display = eval(data) ? 'none' : 'block';
    });
  });

  smallAngular.directive('to-uppercase', function(scope, el) {
    el.innerText = el.innerText.toUpperCase();
  });

  smallAngular.directive('make-short', function(scope, el) {
    const length = el.getAttribute('length');
    el.innerText = el.innerText.slice(0, eval(length));
    scope.$watch(() => el.getAttribute('length'), () => {
      el.innerText = el.innerText.slice(0, eval(length));
    });
  });

  smallAngular.directive('random-color', function(scope, el) {
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