function E7Root(el) {
  el.querySelectorAll('.e7-form').forEach(E7Form);
  el.querySelectorAll('.e7-editable').forEach(E7Editable);
}

function E7Form(el) {
  window.addEventListener('hashchange', readLink);
  el.addEventListener('input', handleChange);
  el.addEventListener('change', handleChange);
  el.addEventListener('reset', () => setTimeout(handleChange, 1));
  el.querySelector('.copylink').addEventListener('click', copyLink);

  function handleChange() {
    const [basePath] = window.location.pathname.toString().split(/#/);
    const formData = new FormData(el);
    const params = new URLSearchParams(formData);

    history.replaceState(null, '', `${basePath}#?${params.toString()}`);

    update();
  }

  function copyLink() {
    navigator.clipboard.writeText(buildLink());
  }

  function buildLink() {
    const [baseUrl] = window.location.toString().split(/#/);
    const formData = new FormData(el);
    const params = new URLSearchParams(formData);

    return `${baseUrl}#?${params.toString()}`;
  }

  function readLink() {
    const query = window.location.hash.match(/\?.*$/);
    const params = new URLSearchParams(query ? query[0] : '');

    for (const [name, value] of params.entries()) {
      const input = el.elements[name];

      if (input) {
        input.value = value;
      }
    }

    update();
  }

  function update() {
    const points = calculatePoints();

    el.querySelectorAll('.points').forEach((el) => {
      el.innerText = points;
    });
  }

  function calculatePoints() {
    const formData = new FormData(el);

    let points = 0;

    for (const [, value] of formData) {
      if (value === 'y' || value === 'x') {
        ++points;
      }
    }

    return points;
  }

  readLink();
}

function E7Editable(el) {
  const input = el.querySelector('input');
  const mirror = el.querySelector('.mirror');

  input.addEventListener('change', update);
  input.addEventListener('input', update);

  function update() {
    mirror.innerText = input.value || input.placeholder;
    input.style.width = `${mirror.offsetWidth}px`;
  }

  update();
}

document.querySelectorAll('.e7-root').forEach(E7Root);
