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
     2. Portfolio filtering
  ----------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const noResultsMsg = document.getElementById('noResults');

  function applyFilter(filterValue) {
    let visibleCount = 0;

    portfolioCards.forEach((card) => {
      const matches = filterValue === 'all' || card.dataset.category === filterValue;
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (noResultsMsg) {
      noResultsMsg.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');

      // Keep the clicked button in view on the scrollable bar
      button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

      applyFilter(button.dataset.filter);
    });
  });

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
});
