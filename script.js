// Navigation Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle?.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav-menu a').forEach(a => {
  a.addEventListener('click', () => navMenu.classList.remove('open'));
});

// Product Filtering & Dynamic Template System
const mainFilters = document.querySelectorAll('.filter-main');
const subFiltersContainer = document.getElementById('subFilters');
const subFilters = document.querySelectorAll('.filter-sub');
const paginationContainer = document.getElementById('pagination');
const productGrid = document.getElementById('productGrid');
const cardTemplate = document.getElementById('productCardTemplate');

// Check for data source
const rawData = typeof productsData !== 'undefined' 
  ? productsData 
  : (typeof detailData !== 'undefined' ? detailData : []);

if (productGrid && cardTemplate && rawData.length > 0) {
  let activeMain = 'all';
  let activeSub = 'all';
  const itemsPerPage = 9;
  let currentPage = 1;

  // Read URL query params (e.g. products.html?filter=excavator)
  const urlParams = new URLSearchParams(window.location.search);
  activeMain = urlParams.get('filter') || 'all';

  function updateDisplay() {
    // 1. Toggle subcategory buttons matching the selected main category
    let hasSubcategories = false;
    subFilters.forEach(subBtn => {
      if (subBtn.dataset.parent === activeMain) {
        subBtn.style.display = 'inline-block';
        hasSubcategories = true;
      } else {
        subBtn.style.display = 'none';
      }
    });

    if (hasSubcategories) {
      subFiltersContainer?.classList.add('show');
    } else {
      subFiltersContainer?.classList.remove('show');
    }

    // 2. Filter matching products from JS data array
    const matchingProducts = rawData.filter(product => {
      const matchMain = activeMain === 'all' || product.datacategory === activeMain;
      const matchSub = activeSub === 'all' || product.datasubcategory === activeSub;
      return matchMain && matchSub;
    });

    // 3. Calculate 9-item pagination slice
    const totalPages = Math.ceil(matchingProducts.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = matchingProducts.slice(start, end);

    // 4. Render product cards into the HTML grid using <template>
    renderCardsFromTemplate(paginatedProducts);

    // 5. Update filter button active states
    mainFilters.forEach(b => b.classList.toggle('active', b.dataset.filter === activeMain));
    subFilters.forEach(b => {
      const isParentMatch = b.dataset.parent === activeMain;
      const isSubMatch = b.dataset.sub === activeSub;
      b.classList.toggle('active', isParentMatch && isSubMatch);
    });

    // 6. Render pagination controls
    renderPagination(totalPages);
  }

  // Populate HTML template nodes with JS data
  function renderCardsFromTemplate(products) {
    productGrid.innerHTML = ''; // Clear existing items

    if (products.length === 0) {
      productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No products found.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    products.forEach(item => {
      const cardClone = cardTemplate.content.cloneNode(true);

      const cardArticle = cardClone.querySelector('.product-card');
      const visualDiv = cardClone.querySelector('.product-visual');
      const badgeSpan = cardClone.querySelector('.card-badge');
      const categoryLabel = cardClone.querySelector('.card-category-label');
      const titleEl = cardClone.querySelector('.card-title');
      const specsContainer = cardClone.querySelector('.card-specs');
      const linkEl = cardClone.querySelector('.card-link');
      const badgeLabel = cardClone.querySelector('.badge-label');

      cardArticle.dataset.category = item.datacategory;
      if (item.datasubcategory) cardArticle.dataset.datasubcategory = item.datasubcategory;

      if (visualDiv) {
        const imgSrc = item.image || 'logotzco.svg';
        const imgAlt = item.name || 'Product Image';

        visualDiv.innerHTML = `<img src="${imgSrc}" alt="${imgAlt}" class="product-img" loading="lazy">`;
      }

      const badgeText = item.badge || item.datacategory.toUpperCase();
      if (badgeSpan) badgeSpan.textContent = badgeText;
      if (categoryLabel) categoryLabel.textContent = badgeText;
      if (titleEl) titleEl.textContent = item.name;
      if (linkEl) linkEl.href = `product-detail.html?id=${item.id}`;
      if (badgeLabel) badgeLabel.textContent = item.category;

      if (specsContainer) {
        specsContainer.innerHTML = '';
        if (item.specsSummary && Array.isArray(item.specsSummary)) {
          item.specsSummary.forEach(specText => {
            const tag = document.createElement('span');
            tag.textContent = specText;
            specsContainer.appendChild(tag);
          });
        } else if (item.specs && typeof item.specs === 'object') {
          Object.values(item.specs).slice(0, 2).forEach(val => {
            const tag = document.createElement('span');
            tag.textContent = val;
            specsContainer.appendChild(tag);
          });
        }
      }

      fragment.appendChild(cardClone);
    });

    productGrid.appendChild(fragment);
  }

  // Render Pagination Controls
  function renderPagination(totalPages) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // "Prev" Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.textContent = '« Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateDisplay();
        scrollToTop();
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Numbered Buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        updateDisplay();
        scrollToTop();
      });
      paginationContainer.appendChild(pageBtn);
    }

    // "Next" Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.textContent = 'Next »';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        updateDisplay();
        scrollToTop();
      }
    });
    paginationContainer.appendChild(nextBtn);
  }

  function scrollToTop() {
    const productSection = document.querySelector('.products');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Main Filter Clicks
  mainFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      activeMain = btn.dataset.filter;
      activeSub = 'all';
      currentPage = 1;
      updateDisplay();
    });
  });

  // Subcategory Filter Clicks
  subFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      activeSub = btn.dataset.sub;
      currentPage = 1;
      updateDisplay();
    });
  });

  // Initial Run
  updateDisplay();
}

// Inquiry Form (Live Email Submission)
document.getElementById('inquiryForm')?.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent standard page redirect
  
  const form = e.target;
  const message = document.getElementById('formMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  message.textContent = '';

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      // Success
      message.textContent = 'Thank you! Your inquiry has been sent successfully.';
      message.style.color = '#0b5095'; // TZCO Accent Color
      form.reset();
    } else {
      // Formspree returned an error
      const data = await response.json();
      if (Object.hasOwn(data, 'errors')) {
        message.textContent = data.errors.map(err => err.message).join(', ');
      } else {
        message.textContent = 'Oops! There was a problem submitting your form.';
      }
      message.style.color = 'red';
    }
  } catch (error) {
    // Network error
    message.textContent = 'Network error. Please check your connection and try again.';
    message.style.color = 'red';
  }

  // Reset button state
  submitBtn.textContent = 'Send Inquiry';
  submitBtn.disabled = false;
});

// Back to Top Button
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 500);
  });
  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Language Button Demo
document.getElementById('langBtn')?.addEventListener('click', () => {
  alert('Language selector ready. Add Indonesian / Chinese / other translations here.');
});



//News article at index.html
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('newsTrack');
  const template = document.getElementById('newsCardTemplate');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !template) return;

  // 1. Populate all articles into the track
  newsData.forEach(item => {
    const clone = template.content.cloneNode(true);
    clone.querySelector('.news-title').textContent = item.title;
    clone.querySelector('.press-date').textContent = item.date;
    clone.querySelector('.news-link').href = `news-detail.html?id=${item.id}`;
    track.appendChild(clone);
  });

  // 2. Slider Navigation Logic
  const VISIBLE_CARDS = 3;
  const totalCards = newsData.length;
  let currentIndex = 0; // Index of the leftmost visible card

  const updateSlider = () => {
    const card = track.querySelector('.press-card');
    if (!card) return;

    // Measure exact card width + CSS gap (20px)
    const cardWidth = card.getBoundingClientRect().width;
    const gap = 20;
    const moveDistance = (cardWidth + gap) * currentIndex;

    // Slide track to the left
    track.style.transform = `translateX(-${moveDistance}px)`;

    // Enable/disable buttons at boundaries
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalCards - VISIBLE_CARDS;
  };

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - VISIBLE_CARDS) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  // Recalculate movement distance if browser window resizes
  window.addEventListener('resize', updateSlider);

  // Initialize button states
  updateSlider();

  // Hero Background Image Slider
  const slides = document.querySelectorAll('.hero-slide-index');
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, 4000); // Transitions every 4 seconds
  }
});