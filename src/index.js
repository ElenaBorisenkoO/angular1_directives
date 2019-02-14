/* eslint-disable no-console*/
/* eslint-disable no-eval */
(function() {
  const directives = {};
  const watchers = []; // массив вотчеров
  const rootScope = window; // виндов для того,чтобы работать с eval
  rootScope.onClick = () => {
    rootScope.name = 'vasya';
  };
  rootScope.$watch = (name, watcher) => { // name - переменная,за которой следим,функция вотчер
    watchers.push({ name, watcher });
  };
  rootScope.$apply = () => {
    watchers.forEach(({ watcher }) => watcher());
  }; // принимает вотчер и запускает его,применяет изменение

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
            // если начинает с ng то запускаем директивы
            if (directives[item]) {
              directives[item].forEach(cb => cb(rootScope, node /* атрибуты без ng*/));
              // скоуп передаем в дир-ву для поиска нем данных
              // скоуп,нода,атрибуты(без ng атрибуты передаем третьим параметром)
              // по итогу 2 массива: c ng выполняем, без ng передаем тратьим параметром
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
  smallAngular.directive('ng-bind', function(el) {
    console.log('model', el);
  });
  smallAngular.directive('ng-repeat', function(el) {
    console.log('model', el);
  });

  smallAngular.directive('ng-click', function(scope, el) {
    el.addEventListener('click', e => {
      const data = el.getAttribute('ng-click');
      eval(data);
      scope.$apply();
    });
  });

  smallAngular.directive('ng-show', function(scope, el, attrs) {
    const data = el.getAttribute('ng-show');
    el.style.display = eval(data) ? 'block' : 'none'; // при первом старте применяем изменения
    rootScope.$watch(data, () => {
      el.style.display = eval(data) ? 'block' : 'none'; // при последующих стартах реагируем на изменения
    });
    console.log('show', scope, el, attrs);
  }); // если где-то изменили переменную, то запускаем все директивы заново(бутстрап)

  smallAngular.directive('ng-hide', function(scope, el, attrs) {
    const data = el.getAttribute('ng-hide');
    el.style.display = eval(data) ? 'none' : 'block'; // при первом старте применяем изменения
    rootScope.$watch(data, () => {
      el.style.display = eval(data) ? 'none' : 'block'; // при последующих стартах реагируем на изменения
    });
    console.log(data);
  });

  smallAngular.directive('ng-make-short', function(scope, el, attrs) {
    const length = el.getAttribute('length');
    el.innerText = el.innerText.slice(0, eval(length));
    rootScope.$watch(length, () => {
      el.innerText = el.innerText.slice(0, eval(length)); // при последующих стартах реагируем на изменения
    });
    console.log(length);
  });
  smallAngular.directive('ng-random-color', function(scope, el, attrs) {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }

    el.style.color = color;
  });


  window.smallAngular = smallAngular;
  smallAngular.bootstrap(document.querySelector('body'));
}());