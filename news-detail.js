document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  const article = typeof newsData !== 'undefined' 
    ? newsData.find(item => item.id === articleId) 
    : null;

  if (article) {
    // 1. Page Title & Header info
    document.title = `${article.title} | TZCO News`;
    document.getElementById('articleTitle').textContent = article.title;
    document.getElementById('articleDate').textContent = article.date;
    document.getElementById('articleTag').textContent = article.category || article.tag.toUpperCase();
    document.getElementById('articleAbstract').textContent = article.abstract;

    // // 2. Image Gallery (Multiple images after abstract)
    // const galleryContainer = document.getElementById('articleGallery');
    // if (galleryContainer && article.gallery && article.gallery.length > 0) {
    //   galleryContainer.innerHTML = '';
    //   article.gallery.forEach((imgUrl, index) => {
    //     const imgWrap = document.createElement('div');
    //     imgWrap.className = 'article-gallery-item';
    //     imgWrap.innerHTML = `<img src="${imgUrl}" alt="${article.title} image ${index + 1}" loading="lazy">`;
    //     galleryContainer.appendChild(imgWrap);
    //   });
    // } else if (galleryContainer && article.image) {
    //   // Fallback if gallery is not defined but single image is
    //   galleryContainer.innerHTML = `
    //     <div class="article-gallery-item">
    //       <img src="${article.image}" alt="${article.title}">
    //     </div>
    //   `;
    // }

    // 2. Image Gallery (Manual Slider with Side Buttons)
    const galleryContainer = document.getElementById('articleGallery');

    // Get gallery images or fallback to single image
    const images = Array.isArray(article.gallery) && article.gallery.length > 0 
      ? article.gallery 
      : (article.image ? [article.image] : []);

    if (galleryContainer && images.length > 0) {
      galleryContainer.innerHTML = '';

      // Container wrapper for slides
      const slidesWrapper = document.createElement('div');
      slidesWrapper.className = 'slides-wrapper';

      // Dynamically build slide elements
      images.forEach((imgUrl, index) => {
      const slide = document.createElement('div');
      // ONLY index 0 gets 'active'
      slide.className = index === 0 ? 'hero-slide active' : 'hero-slide'; 
      slide.innerHTML = `<img src="${imgUrl}" alt="${article.title} image ${index + 1}">`;
      slidesWrapper.appendChild(slide);
      });

      galleryContainer.appendChild(slidesWrapper);

      // Add manual controls if there are 2 or more slides
      if (images.length > 1) {
        let currentSlide = 0;
        const slides = slidesWrapper.querySelectorAll('.hero-slide');

        // Helper to transition between slides
        const updateSlide = (newIndex) => {
          slides[currentSlide].classList.remove('active');
          // Wrap around using modulo logic
          currentSlide = (newIndex + slides.length) % slides.length;
          slides[currentSlide].classList.add('active');
        };

        // Create Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slider-btn prev-btn';
        prevBtn.setAttribute('aria-label', 'Previous Slide');
        prevBtn.innerHTML = '&#10094;'; // Left angle quote symbol ‹
        prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1));

        // Create Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slider-btn next-btn';
        nextBtn.setAttribute('aria-label', 'Next Slide');
        nextBtn.innerHTML = '&#10095;'; // Right angle quote symbol ›
        nextBtn.addEventListener('click', () => updateSlide(currentSlide + 1));

        // Append controls to gallery container
        galleryContainer.appendChild(prevBtn);
        galleryContainer.appendChild(nextBtn);
      }
    }

    // 3. Article Body Paragraphs (more than 1 paragraph)
    const bodyContainer = document.getElementById('articleBody');
    if (bodyContainer && article.paragraphs && article.paragraphs.length > 0) {
      bodyContainer.innerHTML = '';
      article.paragraphs.forEach(pText => {
        const pEl = document.createElement('p');
        pEl.textContent = pText;
        bodyContainer.appendChild(pEl);
      });
    }

  } else {
    // Not found state
    document.querySelector('main').innerHTML = `
      <div class="container" style="text-align:center; padding: 100px 0;">
        <h2>Article Not Found</h2>
        <p><a href="news.html" class="btn btn-primary" style="margin-top:20px;">Return to News & Insights</a></p>
      </div>
    `;
  }
});

// back to top button
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('show', window.scrollY > 500);
  });
  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}