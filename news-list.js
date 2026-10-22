document.addEventListener('DOMContentLoaded', () => {
  const newsListContainer = document.getElementById('newsList');
  const newsCardTemplate = document.getElementById('newsCardTemplate');
  const filterButtons = document.querySelectorAll('#newsFilters .filter');
  const paginationContainer = document.getElementById('pagination');

  const rawNews = typeof newsData !== 'undefined' ? newsData : [];

  if (newsListContainer && newsCardTemplate && rawNews.length > 0) {
    let activeFilter = 'all';
    const itemsPerPage = 5;
    let currentPage = 1;

    // Read URL query params if any (e.g. news.html?tag=technology)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tag')) {
      activeFilter = urlParams.get('tag');
    }

    function updateNewsDisplay() {
      // 1. Filter articles by tag
      const filteredNews = rawNews.filter(article => {
        if (activeFilter === 'all') return true;
        return article.tag === activeFilter;
      });

      // 2. Pagination calculation
      const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedArticles = filteredNews.slice(start, end);

      // 3. Render list
      renderNewsList(paginatedArticles);

      // 4. Update filter button active states
      filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === activeFilter);
      });

      // 5. Render pagination
      renderNewsPagination(totalPages);
    }

    function renderNewsList(articles) {
      newsListContainer.innerHTML = '';

      if (articles.length === 0) {
        newsListContainer.innerHTML = `<p style="text-align: center; padding: 40px; color: #666;">No news articles found for this category.</p>`;
        return;
      }

      const fragment = document.createDocumentFragment();

      articles.forEach(article => {
        const clone = newsCardTemplate.content.cloneNode(true);

        const imgEl = clone.querySelector('.news-row-img');
        const dateEl = clone.querySelector('.news-row-date');
        const tagEl = clone.querySelector('.news-row-tag');
        const titleEl = clone.querySelector('.news-row-title');
        const abstractEl = clone.querySelector('.news-row-abstract');
        const linkEl = clone.querySelector('.news-read-more');

        if (imgEl) {
          imgEl.src = article.image || 'logotzco.svg';
          imgEl.alt = article.title;
        }
        if (dateEl) dateEl.textContent = article.date;
        if (tagEl) tagEl.textContent = article.category || article.tag.toUpperCase();
        if (titleEl) titleEl.textContent = article.title;
        if (abstractEl) abstractEl.textContent = article.abstract;
        if (linkEl) linkEl.href = `news-detail.html?id=${article.id}`;

        // Also make title and image clickable to detail page
        if (titleEl) {
          titleEl.style.cursor = 'pointer';
          titleEl.addEventListener('click', () => {
            window.location.href = `news-detail.html?id=${article.id}`;
          });
        }
        const visualDiv = clone.querySelector('.news-row-visual');
        if (visualDiv) {
          visualDiv.style.cursor = 'pointer';
          visualDiv.addEventListener('click', () => {
            window.location.href = `news-detail.html?id=${article.id}`;
          });
        }

        fragment.appendChild(clone);
      });

      newsListContainer.appendChild(fragment);
    }

    function renderNewsPagination(totalPages) {
      if (!paginationContainer) return;
      paginationContainer.innerHTML = '';

      if (totalPages <= 1) return;

      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.textContent = '« Prev';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          updateNewsDisplay();
          scrollToTop();
        }
      });
      paginationContainer.appendChild(prevBtn);

      // Page Numbers
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
          currentPage = i;
          updateNewsDisplay();
          scrollToTop();
        });
        paginationContainer.appendChild(btn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.textContent = 'Next »';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          updateNewsDisplay();
          scrollToTop();
        }
      });
      paginationContainer.appendChild(nextBtn);
    }

    function scrollToTop() {
      const section = document.querySelector('.news-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Filter Button Click Listeners
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        currentPage = 1;
        updateNewsDisplay();
      });
    });

    // Initial render
    updateNewsDisplay();
  }
});