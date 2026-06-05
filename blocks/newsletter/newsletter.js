export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4');
  const rows = [...block.children];

  block.textContent = '';

  if (heading) {
    const headingWrapper = document.createElement('div');
    headingWrapper.className = 'newsletter-heading';
    headingWrapper.append(heading);
    block.append(headingWrapper);
  }

  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.addEventListener('submit', (e) => e.preventDefault());

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'newsletter-input-wrapper';

  const input = document.createElement('input');
  input.type = 'email';
  input.placeholder = 'E-mail';
  input.required = true;
  input.setAttribute('aria-label', 'E-mail');

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Suscribirme';

  inputWrapper.append(input);
  form.append(inputWrapper, button);
  block.append(form);

  const legal = document.createElement('p');
  legal.className = 'newsletter-legal';
  legal.textContent = 'Al suscribirte, confirmas que has leído la Política de privacidad.';
  block.append(legal);

  // Use content from authored rows if available
  if (rows.length > 1) {
    const legalRow = rows[rows.length - 1];
    const legalText = legalRow.textContent.trim();
    if (legalText) legal.textContent = legalText;
  }
}
