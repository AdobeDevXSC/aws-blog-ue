async function copyCode(block, button) {
  const code = block.querySelector('code');
  const text = code.innerText;

  await navigator.clipboard.writeText(text);

  // visual feedback that task is completed
  button.innerText = 'Copy';

  setTimeout(() => {
    button.innerText = 'Code Copied';
  }, 700);
}

const decorate = async (block) => {
  const first = ([...block.children].shift());
  let lang = first.querySelector('p');
  if (lang) {
    lang = lang.innerText;
    block.classList.add(lang);
  }
  first.remove();

  const button = document.createElement('button');
  button.innerText = 'Copy';
  block.appendChild(button);

  button.addEventListener('click', async () => {
    await copyCode(block, button);
  });

  block.append(button);
};

export default decorate;