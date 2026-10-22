document.addEventListener('DOMContentLoaded', () => {
  // Get product ID from URL query string (e.g. product-detail.html?id=tz08e)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Find product in productsData array
  const product = productsData.find(item => item.id === productId);

  if (product) {
    // 1. Update Title and Headers
    document.title = `${product.name} | TZCO Heavy Machinery`;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCategory').textContent = product.badge;
    document.getElementById('productOverview').textContent = product.overview;

    // 2. Set Up Main Image
    const mainImg = document.getElementById('productImage');
    const defaultImage = (product.gallery && product.gallery[0]) || product.image;
    mainImg.src = defaultImage;
    mainImg.alt = product.name;

    // 3. Render Thumbnail Gallery
    const galleryContainer = document.getElementById('thumbnailGallery');
    if (galleryContainer && product.gallery && product.gallery.length > 0) {
      galleryContainer.innerHTML = ''; // Clear existing content

      product.gallery.forEach((imgUrl, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imgUrl}" alt="${product.name} view ${index + 1}">`;

        // Click event to swap main image
        thumb.addEventListener('click', () => {
          // Subtle fade transition during image swap
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = imgUrl;
            mainImg.style.opacity = '1';
          }, 150);

          // Update active state styling across thumbnails
          document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });

        galleryContainer.appendChild(thumb);
      });
    }

    // 4. Render Technical Specification Table
    // const tableEl = document.getElementById('specTable');
    // tableEl.innerHTML = ''; // Clear table

    // for (const [key, value] of Object.entries(product.specs)) {
    //   const row = document.createElement('tr');
    //   row.innerHTML = `<th>${key}</th><td>${value}</td>`;
    //   tableEl.appendChild(row);
    // }

    // 5. RENDER SPECIFICATION TABLE
    const tableBody = document.getElementById('specTableBody');
    if (tableBody && product.specs) {
      tableBody.innerHTML = ''; // Clear previous rows

      for (const [parameter, value] of Object.entries(product.specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th>${parameter}</th>
          <td>${value}</td>
        `;
        tableBody.appendChild(row);
      }
    }

    // --- HANDLE PDF DOWNLOAD BUTTON ---
    const pdfBtn = document.getElementById('downloadPdfBtn');
    if (pdfBtn) {
      if (product.pdf) {
        pdfBtn.href = product.pdf;
        // Optionally assign a custom filename when downloaded
        pdfBtn.setAttribute('download', `${product.id}-spc.pdf`);
        pdfBtn.style.display = 'inline-flex'; 
      } else {
        // Hide button automatically if no PDF file is assigned
        pdfBtn.style.display = 'none'; 
      }
    }

  } else {
    // Handle invalid product ID
    document.querySelector('main').innerHTML = `
      <div class="container" style="text-align:center; padding: 100px 0;">
        <h2>Product Not Found</h2>
        <p><a href="products.html" class="btn btn-primary">Return to Catalog</a></p>
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