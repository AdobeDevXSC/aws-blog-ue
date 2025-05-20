export default async function decorate(block) {
  const links = block.querySelectorAll('a');
  const list = document.createElement('ul');
  list.className = 'featured-article-list';

  for (const link of links) {
    const url = link.href;

    try {
      const metadata = await fetchMetadata(url);
      if (metadata) {
        const card = createCard(metadata, url);
        list.appendChild(card);
      }
    } catch (err) {
      console.error(`Error fetching metadata for ${url}:`, err);
    }
  }

  // Clear the block and append the list
  block.innerHTML = '';
  block.appendChild(list);
}

async function fetchMetadata(url) {
  const response = await fetch(url);

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const title = doc.querySelector('meta[property="og:title"]')?.content || doc.title;
  const description = doc.querySelector('meta[name="description"]')?.content ||
                      doc.querySelector('meta[property="og:description"]')?.content || '';
  const image = doc.querySelector('meta[property="og:image"]')?.content || '';

  return { title, description, image };
}

function createCard({ title, description, image }, url) {
  const card = document.createElement('li');
  card.classList.add('card-item');
  card.innerHTML = `
    <div class="card-image">${image ? `<img src="${image}" alt="${title}"/>` : ''}</div>
    <div class="card-content">
      <a href="${url}" target="_blank" rel="noopener noreferrer"><h5>${title}</h5></a>
      <p>${description}</p>
      <a href="${url}" target="_blank" rel="noopener noreferrer">Read the post >></a>
    </div>
  `;
  return card;
}