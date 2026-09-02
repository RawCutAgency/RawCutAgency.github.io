/* =============================================================
   RAWCUT. — script.js
   Handles: mobile nav toggle, portfolio filtering, footer year,
   and a demo (non-networked) contact form confirmation.
============================================================= */

document.addEventListener('DOMContentLoaded', () => {


  /* -----------------------------------------------------------
       0. Random Hero Quotes
    ----------------------------------------------------------- */
    const heroHeadlines = [
        `We crash Premiere Pro<br> <span class="accent-text">so you don't have to.</span>`,
        `Our cuts are cleaner<br> <span class="accent-text">than your ex's excuses.</span>`,
        `We cut the crap.<br> <span class="accent-text">Literally.</span>`,
        `Making bad lighting<br> <span class="accent-text">look intentional.</span>`,
        `We don’t use Star Wipes.<br> <span class="accent-text">Unless you pay us ironically.</span>`

      ];

    const heroSubheads = [
        `If your favorite transition is the cross-dissolve, we are legally required to stay 500 feet away from you.`,
        `Warning: Our editing may cause sudden viral fame, skyrocketing retention, and an inflated ego.`,
        `We stare at timelines in dark rooms so you can go touch grass.`,
        `We render faster than you can come up with a decent video idea.`,
        `We make cuts so aggressive your audience won't realize they haven't blinked in 14 minutes.`
    ];

      const headlineEl = document.getElementById('random-headline');
      const subheadEl = document.getElementById('random-subhead');

      if (headlineEl && subheadEl) {
        // Roll the dice separately for the headline and the subhead
        const randomHeadlineIndex = Math.floor(Math.random() * heroHeadlines.length);
        const randomSubheadIndex = Math.floor(Math.random() * heroSubheads.length);

        // Inject the independent random texts into the DOM
        headlineEl.innerHTML = heroHeadlines[randomHeadlineIndex];
        subheadEl.innerHTML = heroSubheads[randomSubheadIndex];
      }

  /* -----------------------------------------------------------
     1. Mobile nav toggle
  ----------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu after a link is tapped
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -----------------------------------------------------------
       2. Portfolio filtering & URL Routing
    ----------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const noResultsMsg = document.getElementById('noResults');

    function applyFilter(filterValue) {
      let visibleCount = 0;

      portfolioCards.forEach((card) => {
        const matches = card.dataset.category === filterValue;
        card.hidden = !matches;

        const video = card.querySelector('video');
        const source = video ? video.querySelector('source') : null;

        if (matches) {
          visibleCount += 1;
        } else {
          if (source && source.hasAttribute('src') && !source.hasAttribute('data-src')) {
            source.setAttribute('data-src', source.getAttribute('src'));
            source.removeAttribute('src');
            video.load();
          }
        }
      });

      if (noResultsMsg) {
        noResultsMsg.hidden = visibleCount === 0;
      }
    }

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        applyFilter(button.dataset.filter);

        // Update URL without reloading the page so it's linkable
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('filter', button.dataset.filter);
        window.history.pushState({}, '', newUrl);
      });
    });

    // INITIALIZE: Read URL param first, fallback to default active
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    const defaultActiveBtn = document.querySelector('.filter-btn.is-active');

    if (filterParam) {
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
      if (targetBtn) {
        targetBtn.click(); // Triggers the visual active state and applies filter
      } else if (defaultActiveBtn) {
        applyFilter(defaultActiveBtn.dataset.filter);
      }
    } else if (defaultActiveBtn) {
      applyFilter(defaultActiveBtn.dataset.filter);
    }

  /* -----------------------------------------------------------
     3. Footer year
  ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------
     5. Custom YouTube Facade (Click to Play)
  ----------------------------------------------------------- */
  const facades = document.querySelectorAll('.yt-facade');

  facades.forEach(facade => {
    const videoId = facade.getAttribute('data-video-id');

    // Skip building if no ID is provided (e.g. YOUR_ID_HERE placeholders)
    if (videoId && videoId !== "YOUR_ID_HERE") {
      // 1. AUTO-BUILD THE THUMBNAIL & PLAY BUTTON
      facade.innerHTML = `
        <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="Video Thumbnail">
        <button class="facade-play">▶</button>
      `;

      // 2. HANDLE THE CLICK TO SWAP TO IFRAME
      facade.addEventListener('click', function() {
        const iframe = document.createElement('iframe');

        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', 'true');

        // Add the 'is-playing' class to hide the V1/V2 tag
        this.parentNode.classList.add('is-playing');

        this.parentNode.replaceChild(iframe, this);
      });
    } else {
      // Fallback styling for empty placeholders so they aren't just black voids
      facade.innerHTML = `
        <div class="video-placeholder">
          <span class="placeholder-icon">▶</span>
          <span class="placeholder-label">Paste Embed ID Here</span>
        </div>
      `;
    }
  });

  /* -----------------------------------------------------------
       6. Drag-to-Scroll for Filter Bar
    ----------------------------------------------------------- */
    const filterBar = document.getElementById('filterBar');

    if (filterBar) {
      let isDown = false;
      let startX;
      let scrollLeft;
      let isDragging = false; // Add a flag to track if we are actually dragging

      // When the user clicks down
      filterBar.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false; // Reset drag status on every new click
        startX = e.pageX - filterBar.offsetLeft;
        scrollLeft = filterBar.scrollLeft;
      });

      // When the mouse leaves the area
      filterBar.addEventListener('mouseleave', () => {
        isDown = false;
        filterBar.classList.remove('is-dragging');
      });

      // When the user releases the click
      filterBar.addEventListener('mouseup', () => {
        isDown = false;
        // Delay removing the dragging class by a tiny fraction of a second
        // so the browser doesn't accidentally trigger a click right as you let go
        setTimeout(() => filterBar.classList.remove('is-dragging'), 10);
      });

      // When the user moves the mouse while clicking
      filterBar.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        const x = e.pageX - filterBar.offsetLeft;
        const walk = (x - startX) * 1.5;

        // Only count it as a "drag" if the mouse has moved more than 4 pixels
        if (Math.abs(x - startX) > 4) {
          isDragging = true;
          filterBar.classList.add('is-dragging');
          e.preventDefault();
          filterBar.scrollLeft = scrollLeft - walk;
        }
      });

      // Double-check: Stop the click event on the buttons if we were dragging
      const filterBtns = filterBar.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        });
      });
    }

  /* -----------------------------------------------------------
     7. Dynamic Masonry Grid Layout
  ----------------------------------------------------------- */
  function resizeMasonryItem(item) {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    // Get the computed style of the grid to find the gap and auto-rows
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')) || parseInt(window.getComputedStyle(grid).getPropertyValue('gap')) || 2;
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')) || 1;

    // Calculate the natural height of the content
    // The content is the video wrapper + the card meta
    const wrapper = item.querySelector('.gif-wrapper');
    const meta = item.querySelector('.card-meta');

    if (wrapper && meta) {
      // It's important to temporarily reset gridRowEnd to auto to measure natural height
      item.style.gridRowEnd = 'auto';
      const wrapperHeight = wrapper.getBoundingClientRect().height;
      const metaHeight = meta.getBoundingClientRect().height;
      const totalHeight = wrapperHeight + metaHeight;

      const rowSpan = Math.ceil((totalHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = 'span ' + rowSpan;
    }
  }

  function resizeAllMasonryItems() {
    const allItems = document.querySelectorAll('.portfolio-card');
    allItems.forEach(resizeMasonryItem);
  }

  // Initial layout
  resizeAllMasonryItems();

  // Watch for resizes
  window.addEventListener('resize', resizeAllMasonryItems);

  // Also need to run this when videos load their metadata so they have a height
  const allVideos = document.querySelectorAll('.portfolio-card video');
  allVideos.forEach(video => {
    video.addEventListener('loadedmetadata', () => {
      const card = video.closest('.portfolio-card');
      if (card) {
        resizeMasonryItem(card);
      }
    });
  });

  // Watch for image loads if any
  const allImages = document.querySelectorAll('.portfolio-card img');
  allImages.forEach(img => {
    img.addEventListener('load', () => {
      const card = img.closest('.portfolio-card');
      if (card) {
        resizeMasonryItem(card);
      }
    });
  });

  // Use a ResizeObserver as a catch-all to keep things tight if heights shift
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      // Just re-run on everything to be safe when the grid or cards change size
      resizeAllMasonryItems();
    });
    const gridEl = document.querySelector('.portfolio-grid');
    if (gridEl) {
      ro.observe(gridEl);
    }
  }

  /* -----------------------------------------------------------
     8. Video Lazy Loading & Scroll Optimization
  ----------------------------------------------------------- */
  const videoCards = document.querySelectorAll('.portfolio-card video, .bento-item video');

  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const video = entry.target;

        // If the video scrolls into view
        if (entry.isIntersecting) {
          const source = video.querySelector('source');

          // Check if it has a data-src (meaning it hasn't been loaded yet)
          if (source && source.hasAttribute('data-src')) {
            source.src = source.getAttribute('data-src'); // Inject the real URL
            source.removeAttribute('data-src'); // Clean up
            video.load(); // Force the browser to grab the file
          }

          video.play().catch(e => {
            // Catch autoplay restrictions if any
            console.log("Autoplay prevented by browser.");
          });
        }
        // If the video scrolls OUT of view
        else {
          if (!video.paused) {
            video.pause(); // Pause to save RAM/CPU
          }
        }
      });
    }, {
      rootMargin: "200px 0px" // Start loading 200px before it actually hits the screen
    });

    videoCards.forEach(video => {
      videoObserver.observe(video);
    });
  }



});
