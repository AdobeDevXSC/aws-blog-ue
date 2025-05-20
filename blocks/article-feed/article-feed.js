export default async function decorate(block) {
  const queryIndex = block.querySelector('a').href;

  const resp = await fetch(queryIndex);
  if (!resp.ok) throw new Error('Could not fetch query index');

  const { data } = await resp.json();

  // Convert and store a formatted date, and sort descending by lastModified
  const formattedData = data
    .map(article => ({
      ...article,
      lastModifiedDate: new Date(Number(article.lastModified) * 1000), // convert to ms
    }))
    .sort((a, b) => b.lastModifiedDate - a.lastModifiedDate); // newest first

  block.innerHTML = '';

  // Extract unique categories
  const categories = [...new Set(formattedData.map(article => article.category))];

  // Create main container
  const container = document.createElement('div');
  container.className = 'article-feed';

  // Sidebar for filters
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear All';
  clearBtn.className = 'clear-btn';

  const sidebarTitle = document.createElement('h5');
  sidebarTitle.textContent = 'Category';

  const form = document.createElement('form');
  form.className = 'category-form';

  categories.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'category-option';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = cat;
    checkbox.name = 'category';

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(cat));
    form.appendChild(label);
  });

  sidebar.appendChild(clearBtn);
  sidebar.appendChild(sidebarTitle);
  sidebar.appendChild(form);

  // Article display area
  const content = document.createElement('div');
  content.className = 'content';

  const formatDate = (date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const renderArticles = (selectedCategories = []) => {
    content.innerHTML = '';
    const filtered = selectedCategories.length === 0
      ? formattedData
      : formattedData.filter(article => selectedCategories.includes(article.category));

    const contentTitle = document.createElement('h5');
    contentTitle.textContent = 'Newest posts';
    content.prepend(contentTitle);

    filtered.forEach(article => {
      const articleEl = document.createElement('div');
      articleEl.className = 'article';

      articleEl.innerHTML = `
        <h4><a href="${article.path}">${article.title}</a></h4>
        <p class="author-publish-date">${article.author}, ${formatDate(article.lastModifiedDate)}</p>
        <p class="description">${article.description}</p>
      `;
      content.appendChild(articleEl);
    });
  };

  renderArticles();

  // Checkbox filtering
  form.addEventListener('change', () => {
    const selected = [...form.querySelectorAll('input[type="checkbox"]:checked')]
      .map(cb => cb.value);
    renderArticles(selected);
  });

  // Clear filters
  clearBtn.addEventListener('click', (e) => {
    e.preventDefault();
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    renderArticles([]);
  });

  container.appendChild(sidebar);
  container.appendChild(content);
  block.appendChild(container);
}