/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i/$items.length) * 100 + 10
    animate()
  })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
  const wheelProgress = e.deltaY * speedWheel
  progress = progress + wheelProgress
  animate()
}

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

const handleMouseDown = e => {
  isDown = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
  isDown = false
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)


//addEventListener로 한번 코딩을 하면 onClick과는 충돌 가능성이 있어 최적화된 방법은 아님.
// 즉, onClick으로 이벤트를 처리하려면 모든 이벤트는 onClick으로 처리
// 하지만 onClick은 이벤트가 많아지면 모든 코드를 관리하기 어렵기때문에 보통 addEventListener로 관리한다고 함


// 벚꽃날리기
(function ($) {
  // requestAnimationFrame Polyfill
  (function () {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];

      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function (callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window.setTimeout(function () {
                      callback(currTime + timeToCall);
                  },
                  timeToCall);
              lastTime = currTime + timeToCall;

              return id;
          };

      if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function (id) {
              clearTimeout(id);
          };
  }());

  // Sakura function.
  $.fn.sakura = function (options) {
      // We rely on these random values a lot, so define a helper function for it.
      function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      // Helper function to attach cross-browser events to an element.
      var prefixes = ['moz', 'ms', 'o', 'webkit', ''];
      var prefCount = prefixes.length;

      function prefixedEvent(element, type, callback) {
          for (var i = 0; i < prefCount; i++) {
              if (!prefixes[i]) {
                  type = type.toLowerCase();
              }

              element.get(0).addEventListener(prefixes[i] + type, callback, false);
          }
      }

      // Defaults for the option object, which gets extended below.
      var defaults = {
          blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-hard-left', 'blow-soft-right', 'blow-medium-right', 'blow-hard-right'],
          className: 'sakura',
          fallSpeed: 3,
          maxSize: 14,
          minSize: 9,
          newOn: 300,
          swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6', 'sway-7', 'sway-8']
      };

      var options = $.extend({}, defaults, options);

      // Declarations.
      var documentHeight = $(document).height();
      var documentWidth = $(document).width();
      var sakura = $('<div class="' + options.className + '" />');

      // Set the overflow-x CSS property on the body to prevent horizontal scrollbars.
      $('body').css({ 'overflow-x': 'hidden' });

      // Function that inserts new petals into the document.
      var petalCreator = function () {
          setTimeout(function () {
              requestAnimationFrame(petalCreator);
          }, options.newOn);

          // Get one random animation of each type and randomize fall time of the petals.
          var blowAnimation = options.blowAnimations[Math.floor(Math.random() * options.blowAnimations.length)];
          var swayAnimation = options.swayAnimations[Math.floor(Math.random() * options.swayAnimations.length)];
          var fallTime = (Math.round(documentHeight * 0.007) + Math.random() * 5) * options.fallSpeed;

          var animations = 'fall ' + fallTime + 's linear 0s 1' + ', ' +
              blowAnimation + ' ' + (((fallTime > 30 ? fallTime : 30) - 20) + getRandomInt(0, 20)) + 's linear 0s infinite' + ', ' +
              swayAnimation + ' ' + getRandomInt(2, 4) + 's linear 0s infinite';
          var petal = sakura.clone();
          var size = getRandomInt(options.minSize, options.maxSize);
          var startPosLeft = Math.random() * documentWidth - 100;
          var startPosTop = -((Math.random() * 20) + 15);

          // Apply Event Listener to remove petals that reach the bottom of the page.
          prefixedEvent(petal, 'AnimationEnd', function () {
              $(this).remove();
          });

          // Apply Event Listener to remove petals that finish their horizontal float animation.
          prefixedEvent(petal, 'AnimationIteration', function (ev) {
              if ($.inArray(ev.animationName, options.blowAnimations) != -1) {
                  $(this).remove();
              }
          });

          petal
              .css({
                  '-webkit-animation': animations,
                  '-o-animation': animations,
                  '-ms-animation': animations,
                  '-moz-animation': animations,
                  animation: animations,
                  height: size,
                  left: startPosLeft,
                  'margin-top': startPosTop,
                  width: size
              })
              .appendTo('body');
      };


      // Recalculate documentHeight and documentWidth on browser resize.
      $(window).resize(function () {
          documentHeight = $(document).height();
          documentWidth = $(document).width();
      });

      // Finally: Start adding petals.
      requestAnimationFrame(petalCreator);
  };
}(jQuery));
