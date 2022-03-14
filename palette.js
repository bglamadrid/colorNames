const { concat, from } = rxjs;
const { ajax } = rxjs.ajax;
const { finalize, switchMap, tap } = rxjs.operators;

document.addEventListener('DOMContentLoaded', () => {
  const colorContainers = document.querySelectorAll('main .colors > div');

  ajax.getJSON(`color-rainbow.json`).pipe(
    switchMap(rootNode => from(rootNode.colors)), // iterate through colors
    tap(colorMetadata => {
      colorContainers.forEach(c => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('individual', 'color');
        colorDiv.dataset.rgb = colorMetadata['rgb'];
        colorDiv.dataset.hex = colorMetadata['hex'];
        colorDiv.style.backgroundColor = colorMetadata['html-name'];
        tippy(
          colorDiv,
          {
            content: `${colorMetadata.name} (${colorMetadata['html-name']})</br>${colorMetadata.hex}</br>${colorMetadata.rgb}</br><b>Click to copy HEX color</b>`,
            allowHTML: true,
            placement: 'bottom'
          }
        );
        c.appendChild(colorDiv)
      });
    }),
    finalize(() => {
      colorContainers.forEach(c => {
        c.addEventListener('click', (event) => {
          if (event.target.classList.contains('individual', 'color')) {
            navigator.clipboard.writeText(event.target.dataset.hex);
          }
        });
      })
    })
  ).subscribe();
});
