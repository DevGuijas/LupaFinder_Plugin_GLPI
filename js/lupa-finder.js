/* Lupa_Finder — @DevGuijas - GitHub */
(() => {
  'use strict';

  const findPluginRoot = () => {
    const nativeForm = document.getElementById('global-search')?.closest('form');
    if (nativeForm?.action) {
      return new URL(nativeForm.action, window.location.origin).pathname.replace(/\/front\/search\.php$/, '');
    }
    const source = [...document.scripts].map((script) => script.src).find((src) => src.includes('/plugins/lupafinder/'));
    return source ? new URL(source).pathname.replace(/\/plugins\/lupafinder\/.*$/, '') : '';
  };
  const root = findPluginRoot();
  const nativeForm = document.getElementById('global-search')?.closest('form');

  const dialog = document.createElement('section');
  dialog.className = 'lupafinder-dialog';
  dialog.hidden = true;
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'lupafinder-title');
  dialog.innerHTML = `
    <div class="lupafinder-panel">
      <div class="lupafinder-head">
        <div><p class="lupafinder-eyebrow">Lupa_Finder</p><h2 id="lupafinder-title">Encontre o que precisa</h2></div>
        <button class="lupafinder-close" type="button" aria-label="Fechar busca"><i class="ti ti-x"></i></button>
      </div>
      <form class="lupafinder-body" novalidate>
        <div class="lupafinder-input-wrap"><i class="ti ti-search" aria-hidden="true"></i><input class="lupafinder-input" type="search" autocomplete="off" placeholder="Número do chamado, assunto ou nome da pessoa" aria-label="Termo para busca"></div>
        <div class="lupafinder-tabs" role="group" aria-label="Onde procurar">
          <button class="lupafinder-tab" type="button" data-mode="tickets" aria-pressed="true"><i class="ti ti-ticket me-1"></i>Chamados</button>
          <button class="lupafinder-tab" type="button" data-mode="people" aria-pressed="false"><i class="ti ti-users me-1"></i>Pessoas</button>
          <button class="lupafinder-tab" type="button" data-mode="all" aria-pressed="false"><i class="ti ti-world-search me-1"></i>Busca geral</button>
        </div>
        <div class="lupafinder-meta"><span data-lupafinder-hint>Busca no título e na descrição dos chamados.</span><span>Enter para buscar · Esc para fechar</span></div>
        <p class="lupafinder-message" role="alert">Digite algo para iniciar a busca.</p>
        <div class="lupafinder-actions"><button class="btn btn-link" type="button" data-lupafinder-close>Cancelar</button><button class="btn btn-primary px-4" type="submit"><i class="ti ti-search me-1"></i>Buscar</button></div>
      </form>
    </div>`;
  document.body.append(dialog);

  const launcher = document.createElement('button');
  launcher.className = 'lupafinder-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-label', 'Abrir Lupa Finder');
  launcher.innerHTML = '<i class="ti ti-search" aria-hidden="true"></i><span class="lupafinder-launcher-label">Buscar</span><small>Ctrl K</small>';
  document.body.append(launcher);

  nativeForm?.classList.add('lupafinder-native-hidden');

  const form = dialog.querySelector('form');
  const input = dialog.querySelector('.lupafinder-input');
  const message = dialog.querySelector('.lupafinder-message');
  const hint = dialog.querySelector('[data-lupafinder-hint]');
  let mode = 'tickets';
  const hints = { tickets: 'Busca no título e na descrição dos chamados.', people: 'Busca pelo login ou nome da pessoa.', all: 'Usa a busca geral configurada no GLPI.' };

  const open = () => { dialog.hidden = false; document.body.classList.add('lupafinder-open'); window.setTimeout(() => input.focus(), 20); };
  const close = () => { dialog.hidden = true; document.body.classList.remove('lupafinder-open'); message.classList.remove('is-visible'); launcher.focus(); };
  launcher.addEventListener('click', open);
  dialog.querySelector('.lupafinder-close').addEventListener('click', close);
  dialog.querySelector('[data-lupafinder-close]').addEventListener('click', close);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });

  dialog.querySelectorAll('.lupafinder-tab').forEach((button) => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    dialog.querySelectorAll('.lupafinder-tab').forEach((tab) => tab.setAttribute('aria-pressed', String(tab === button)));
    hint.textContent = hints[mode];
    input.placeholder = mode === 'people' ? 'Nome ou login da pessoa' : mode === 'all' ? 'Digite o que deseja encontrar' : 'Número do chamado ou assunto';
    input.focus();
  }));

  const appendCriteria = (params, index, field, searchtype, value, link = 'AND') => {
    params.set(`criteria[${index}][link]`, link);
    params.set(`criteria[${index}][field]`, field);
    params.set(`criteria[${index}][searchtype]`, searchtype);
    params.set(`criteria[${index}][value]`, value);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) { message.classList.add('is-visible'); input.focus(); return; }

    let url;
    if (mode === 'all') {
      url = `${root}/front/search.php?globalsearch=${encodeURIComponent(value)}`;
    } else if (mode === 'people') {
      const params = new URLSearchParams({ sort: '1', order: 'ASC' });
      appendCriteria(params, 0, '1', 'contains', value);
      url = `${root}/front/user.php?${params.toString()}`;
    } else {
      const params = new URLSearchParams({ sort: '19', order: 'DESC' });
      if (/^\d+$/.test(value)) {
        appendCriteria(params, 0, '2', 'equals', value);
      } else {
        appendCriteria(params, 0, '1', 'contains', value);
        appendCriteria(params, 1, '21', 'contains', value, 'OR');
      }
      url = `${root}/front/ticket.php?${params.toString()}`;
    }
    window.location.assign(url);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) { event.preventDefault(); close(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.hidden ? open() : close(); }
  });
})();
