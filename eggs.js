(function () {
  var container = document.getElementById('hero-eggs');
  if (!container) return;

  var W = container.clientWidth || 420;
  var H = container.clientHeight || 460;

  var eggSVG =
    '<svg viewBox="0 0 40 50" width="40" height="50">' +
    '<ellipse cx="20" cy="27" rx="17" ry="22" fill="#F4EBDD" stroke="#D8C9A8" stroke-width="1"/>' +
    '<ellipse cx="14" cy="18" rx="4" ry="6" fill="#ffffff" opacity="0.35"/>' +
    '</svg>';

  var featherFills = ['#F7F1E6', '#EDE0C4', '#FFFFFF', '#E4D2A6', '#D6BD8C'];

  function featherSVG(fill) {
    return (
      '<svg viewBox="0 0 24 60" width="100%" height="100%">' +
      '<path d="M12 2 C5 10 3 22 4 34 C5 44 8 53 12 58 C16 53 19 44 20 34 C21 22 19 10 12 2 Z" fill="' +
      fill +
      '" stroke="#C9B68D" stroke-width="0.6"/>' +
      '<line x1="12" y1="4" x2="12" y2="56" stroke="#C9B68D" stroke-width="0.8" opacity="0.7"/>' +
      '<path d="M12 8 L5 16 M12 14 L4.5 22 M12 20 L4.5 28 M12 26 L5 34 M12 32 L6 39 M12 38 L7 44 M12 44 L8 49" stroke="#C9B68D" stroke-width="0.5" opacity="0.55" fill="none"/>' +
      '<path d="M12 8 L19 16 M12 14 L19.5 22 M12 20 L19.5 28 M12 26 L19 34 M12 32 L18 39 M12 38 L17 44 M12 44 L16 49" stroke="#C9B68D" stroke-width="0.5" opacity="0.55" fill="none"/>' +
      '</svg>'
    );
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  var eggs = [];
  var N = 6;

  function spawnEgg() {
    var el = document.createElement('div');
    el.className = 'egg';
    el.innerHTML = eggSVG;
    var margin = 30;
    var x = rand(margin, Math.max(margin + 1, W - margin - 40));
    var y = rand(margin, Math.max(margin + 1, H - margin - 70));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.dataset.baseX = x;
    el.dataset.baseY = y;
    el.dataset.phase = rand(0, Math.PI * 2);
    el.dataset.speed = rand(0.4, 0.9);
    el.dataset.amp = rand(6, 14);
    el.addEventListener('click', function () {
      crack(el);
    });
    container.appendChild(el);
    eggs.push(el);
  }

  for (var i = 0; i < N; i++) spawnEgg();

  var t = 0;
  function animate() {
    t += 0.02;
    for (var i = 0; i < eggs.length; i++) {
      var e = eggs[i];
      if (e.dataset.gone === '1') continue;
      var phase = parseFloat(e.dataset.phase);
      var speed = parseFloat(e.dataset.speed);
      var amp = parseFloat(e.dataset.amp);
      var baseX = parseFloat(e.dataset.baseX);
      var baseY = parseFloat(e.dataset.baseY);
      var dy = Math.sin(t * speed + phase) * amp;
      var dx = Math.cos(t * speed * 0.7 + phase) * (amp * 0.4);
      e.style.left = baseX + dx + 'px';
      e.style.top = baseY + dy + 'px';
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  function crack(el) {
    if (el.dataset.gone === '1') return;
    el.dataset.gone = '1';
    var x = parseFloat(el.style.left) + 20;
    var y = parseFloat(el.style.top) + 25;
    el.style.transition = 'transform 0.15s, opacity 0.15s';
    el.style.transform = 'scale(0.2)';
    el.style.opacity = '0';

    var burst = document.createElement('div');
    burst.className = 'burst';
    burst.style.left = x - 2 + 'px';
    burst.style.top = y - 2 + 'px';
    container.appendChild(burst);

    var FN = 12;
    for (var i = 0; i < FN; i++) {
      (function (idx) {
        var w = rand(10, 16),
          h = rand(26, 40);
        var f = document.createElement('div');
        f.className = 'feather';
        f.style.left = -w / 2 + 'px';
        f.style.top = -h / 2 + 'px';
        f.style.width = w + 'px';
        f.style.height = h + 'px';
        f.innerHTML = featherSVG(featherFills[idx % featherFills.length]);

        var ang = rand(0, Math.PI * 2);
        var dist = rand(60, 150);
        var spinStart = rand(-30, 30);
        var spinEnd = rand(180, 420) * (Math.random() < 0.5 ? 1 : -1);

        f.style.transform = 'translate(0px,0px) rotate(' + spinStart + 'deg)';
        burst.appendChild(f);

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            var tx = Math.cos(ang) * dist;
            var ty = Math.sin(ang) * dist - 30;
            f.style.transform =
              'translate(' + tx + 'px,' + ty + 'px) rotate(' + spinEnd + 'deg)';
            f.style.opacity = '0';
          });
        });
      })(i);
    }

    setTimeout(function () {
      burst.remove();
    }, 1700);

    setTimeout(function () {
      el.remove();
      var idx = eggs.indexOf(el);
      if (idx >= 0) eggs.splice(idx, 1);
      if (eggs.length === 0) {
        for (var k = 0; k < N; k++) spawnEgg();
      }
    }, 200);
  }
})();
