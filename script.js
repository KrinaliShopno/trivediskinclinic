/**
 * Trivedi Skin Clinic - Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Effect
  const navbar = document.querySelector('.main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('sticky-top', 'shadow-sm');
    } else {
      navbar.classList.remove('sticky-top', 'shadow-sm');
    }
  });

  // 2. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Visual Stories Auto-Play Carousel & Horizontal Scroll
  const storiesReel = document.getElementById('storiesReel');
  const storyNextBtn = document.getElementById('storyNextBtn');
  const storyPrevBtn = document.getElementById('storyPrevBtn');
  const storiesWrapper = document.querySelector('.stories-carousel-wrapper');

  let isStoriesAutoPlayPaused = false;
  let storiesAutoPlayTimer = null;

  if (storiesReel) {
    const scrollStep = 240;

    const scrollReelNext = () => {
      if (storiesReel.scrollLeft + storiesReel.clientWidth >= storiesReel.scrollWidth - 20) {
        storiesReel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        storiesReel.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    };

    const scrollReelPrev = () => {
      if (storiesReel.scrollLeft <= 15) {
        storiesReel.scrollTo({ left: storiesReel.scrollWidth, behavior: 'smooth' });
      } else {
        storiesReel.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      }
    };

    // Auto-scroll loop every 3 seconds
    const startStoriesAutoPlay = () => {
      stopStoriesAutoPlay();
      storiesAutoPlayTimer = setInterval(() => {
        if (!isStoriesAutoPlayPaused) {
          scrollReelNext();
        }
      }, 3000);
    };

    const stopStoriesAutoPlay = () => {
      if (storiesAutoPlayTimer) {
        clearInterval(storiesAutoPlayTimer);
        storiesAutoPlayTimer = null;
      }
    };

    if (storyNextBtn) {
      storyNextBtn.addEventListener('click', () => {
        scrollReelNext();
        startStoriesAutoPlay();
      });
    }

    if (storyPrevBtn) {
      storyPrevBtn.addEventListener('click', () => {
        scrollReelPrev();
        startStoriesAutoPlay();
      });
    }

    // Pause on mouse hover & resume on mouse leave
    if (storiesWrapper) {
      storiesWrapper.addEventListener('mouseenter', () => {
        isStoriesAutoPlayPaused = true;
      });
      storiesWrapper.addEventListener('mouseleave', () => {
        isStoriesAutoPlayPaused = false;
      });
      storiesWrapper.addEventListener('touchstart', () => {
        isStoriesAutoPlayPaused = true;
      }, { passive: true });
      storiesWrapper.addEventListener('touchend', () => {
        setTimeout(() => {
          isStoriesAutoPlayPaused = false;
        }, 2500);
      });
    }

    // Start auto-play initially
    startStoriesAutoPlay();
  }

  // 4. YouTube Shorts Video Modal Player with Instant Autoplay
  const ytShortsModalEl = document.getElementById('ytShortsModal');
  const ytShortsIframe = document.getElementById('ytShortsIframe');
  const ytShortsModalTitle = document.getElementById('ytShortsModalTitle');
  const ytShortsExternalLink = document.getElementById('ytShortsExternalLink');
  const ytShortCards = document.querySelectorAll('.yt-short-card');

  let ytModalInstance = null;
  let currentActiveVideoId = null;

  if (ytShortsModalEl && typeof bootstrap !== 'undefined') {
    ytModalInstance = new bootstrap.Modal(ytShortsModalEl);

    ytShortCards.forEach(card => {
      card.addEventListener('click', () => {
        const videoId = card.getAttribute('data-video-id');
        const videoTitle = card.getAttribute('data-title') || 'Dr. Sunil Trivedi Shorts';

        if (videoId && ytShortsIframe) {
          currentActiveVideoId = videoId;
          isStoriesAutoPlayPaused = true; // Pause carousel while watching video

          if (ytShortsModalTitle) {
            ytShortsModalTitle.textContent = videoTitle;
          }
          if (ytShortsExternalLink) {
            ytShortsExternalLink.href = `https://www.youtube.com/shorts/${videoId}`;
          }

          // Autoplay=1, playsinline=1, enablejsapi=1 for instant playback
          ytShortsIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`;
          ytModalInstance.show();
        }
      });
    });

    // Guarantee autoplay when modal is fully displayed
    ytShortsModalEl.addEventListener('shown.bs.modal', () => {
      try {
        if (ytShortsIframe && ytShortsIframe.contentWindow) {
          ytShortsIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
      } catch (err) {}
    });

    // Stop video playback and resume carousel when modal is closed
    ytShortsModalEl.addEventListener('hidden.bs.modal', () => {
      if (ytShortsIframe) {
        ytShortsIframe.src = '';
      }
      currentActiveVideoId = null;
      isStoriesAutoPlayPaused = false; // Resume carousel
    });
  }

  // Fallback Lightbox for static story cards
  const lightbox = document.getElementById('customLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const staticStoryCards = document.querySelectorAll('.story-thumb-card:not(.yt-short-card)');

  staticStoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Visual Story';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 5. Patient Testimonials (Floating Initials Cloud & Centerpiece)
  const testimonials = [
    {
      initial: 'M',
      name: 'Manish Jorja',
      treatment: 'Laser Skin Care Patient',
      rating: 5,
      text: '"Dr. Sunil Trivedi and their team are incredibly professional and caring. My skin has never looked better. Highly recommend!"'
    },
    {
      initial: 'D',
      name: 'Darshan Patel',
      treatment: 'Dermatology & Skin Specialist',
      rating: 5,
      text: '"The clinical treatments here are top notch. Dr. Sunil Trivedi diagnosed my skin issue accurately and the results were visible within a couple of weeks."'
    },
    {
      initial: 'P',
      name: 'Pooja Patel',
      treatment: 'Anti-Ageing & Glow Therapy',
      rating: 5,
      text: '"The laser skin treatment has completely transformed my complexion. Dr. Trivedi takes time to understand your concerns and provides genuine advice."'
    },
    {
      initial: 'R',
      name: 'Rahul Sharma',
      treatment: 'Trichology & Hair Regrowth',
      rating: 5,
      text: '"Excellent experience for hair loss treatment. The clinic is spotless, modern, and the results speak for themselves. Truly a five-star clinic in Surat!"'
    },
    {
      initial: 'S',
      name: 'Sneha Desai',
      treatment: 'Acne & Clear Skin Therapy',
      rating: 5,
      text: '"After struggling with acne breakouts for years, Dr. Trivedi\'s personalized protocol gave me smooth, radiant, and blemish-free skin in weeks!"'
    }
  ];

  const testiFeaturedInitial = document.getElementById('testiFeaturedInitial');
  const testiName = document.getElementById('testiName');
  const testiTreatment = document.getElementById('testiTreatment');
  const testiText = document.getElementById('testiText');
  const testimonialDotsContainer = document.getElementById('testimonialDots');
  const floatingAvatars = document.querySelectorAll('.testi-floating-avatar');
  let currentTesti = 0;

  // Dynamically generate dots
  if (testimonialDotsContainer) {
    testimonialDotsContainer.innerHTML = '';
    testimonials.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = 'testi-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('data-index', idx);
      dot.addEventListener('click', () => {
        currentTesti = idx;
        showTestimonial(currentTesti);
      });
      testimonialDotsContainer.appendChild(dot);
    });
  }

  function showTestimonial(index) {
    if (!testiName || !testiText) return;
    const item = testimonials[index];

    // Smooth fade effect
    testiText.style.opacity = '0';
    if (testiFeaturedInitial) testiFeaturedInitial.style.transform = 'scale(0.85)';

    setTimeout(() => {
      if (testiFeaturedInitial) {
        testiFeaturedInitial.textContent = item.initial;
        testiFeaturedInitial.style.transform = 'scale(1)';
      }
      testiName.textContent = item.name;
      if (testiTreatment) testiTreatment.textContent = item.treatment;
      testiText.textContent = item.text;
      testiText.style.opacity = '1';
    }, 180);

    // Update dots
    if (testimonialDotsContainer) {
      const dots = testimonialDotsContainer.querySelectorAll('.testi-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }
  }

  // Clicking on any ambient floating avatar switches to that testimonial
  floatingAvatars.forEach((av) => {
    av.addEventListener('click', () => {
      const idx = parseInt(av.getAttribute('data-index') || '0', 10);
      currentTesti = idx % testimonials.length;
      showTestimonial(currentTesti);
    });
  });

  // Auto-advance testimonial every 5.5 seconds
  setInterval(() => {
    currentTesti = (currentTesti + 1) % testimonials.length;
    showTestimonial(currentTesti);
  }, 5500);

  // 6. Hero Carousel Bootstrap Controller & Dynamic Indicators
  const heroCarouselEl = document.getElementById('heroCarousel');
  const heroIndicatorsEl = document.getElementById('heroIndicators');
  const heroInlinePrev = document.getElementById('heroInlinePrev');
  const heroInlineNext = document.getElementById('heroInlineNext');
  const heroOuterPrev = document.getElementById('heroOuterPrev');
  const heroOuterNext = document.getElementById('heroOuterNext');

  if (heroCarouselEl && typeof bootstrap !== 'undefined') {
    // 1. Initialize Bootstrap Carousel
    const heroCarousel = new bootstrap.Carousel(heroCarouselEl, {
      interval: 4500,
      ride: 'carousel',
      pause: 'hover',
      wrap: true
    });

    const slides = heroCarouselEl.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // 2. Generate Indicator Dots Dynamically using Script (No hardcoding in HTML)
    if (heroIndicatorsEl && totalSlides > 0) {
      heroIndicatorsEl.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'hero-dot-indicator' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${idx + 1}`);
        // Navigate via Bootstrap API
        dot.addEventListener('click', () => {
          heroCarousel.to(idx);
        });
        heroIndicatorsEl.appendChild(dot);
      });
    }

    // 3. Sync Active Indicator on Bootstrap Carousel Event
    heroCarouselEl.addEventListener('slide.bs.carousel', (e) => {
      if (!heroIndicatorsEl) return;
      const dots = heroIndicatorsEl.querySelectorAll('.hero-dot-indicator');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === e.to);
      });
    });

    // 4. Connect Navigation Buttons via Bootstrap API
    const handlePrev = () => heroCarousel.prev();
    const handleNext = () => heroCarousel.next();

    if (heroInlinePrev) heroInlinePrev.addEventListener('click', handlePrev);
    if (heroInlineNext) heroInlineNext.addEventListener('click', handleNext);
    if (heroOuterPrev) heroOuterPrev.addEventListener('click', handlePrev);
    if (heroOuterNext) heroOuterNext.addEventListener('click', handleNext);

    // 5. Touch Swipe for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;

    heroCarouselEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroCarouselEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        heroCarousel.next(); // swipe left via Bootstrap API
      } else if (touchEndX - touchStartX > 50) {
        heroCarousel.prev(); // swipe right via Bootstrap API
      }
    }, { passive: true });
  }

  // 7. Newsletter Form Submission Handling
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      if (input && input.value.trim()) {
        alert('Thank you for subscribing to Trivedi Skin Clinic updates!');
        input.value = '';
      }
    });
  }

  // 8. Appointment Booking Form Handling
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modalEl = document.getElementById('appointmentModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
      alert('Thank you! Your appointment request has been submitted. Our team will contact you shortly to confirm your booking.');
      appointmentForm.reset();
    });
  }

  // 9. Interactive Treatments Carousel
  const treatmentsTrack = document.getElementById('treatmentsTrack');
  const treatmentsPrev = document.getElementById('treatmentsPrev');
  const treatmentsNext = document.getElementById('treatmentsNext');
  const treatmentsDotsContainer = document.getElementById('treatmentsDots');

  if (treatmentsTrack) {
    const slides = treatmentsTrack.querySelectorAll('.treatment-card-slide');
    const totalSlides = slides.length;

    // Generate pagination dots dynamically
    if (treatmentsDotsContainer && totalSlides > 0) {
      treatmentsDotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('treatment-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          scrollToSlide(idx);
        });
        treatmentsDotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!treatmentsDotsContainer || slides.length === 0) return;
      const dots = treatmentsDotsContainer.querySelectorAll('.treatment-dot');
      const cardWidth = slides[0].offsetWidth + 24;
      const activeIdx = Math.round(treatmentsTrack.scrollLeft / cardWidth);
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === Math.min(activeIdx, dots.length - 1));
      });
    }

    function scrollToSlide(idx) {
      if (slides.length === 0) return;
      const cardWidth = slides[0].offsetWidth + 24;
      treatmentsTrack.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
    }

    treatmentsTrack.addEventListener('scroll', updateDots, { passive: true });

    if (treatmentsPrev) {
      treatmentsPrev.addEventListener('click', () => {
        const cardWidth = slides[0].offsetWidth + 24;
        if (treatmentsTrack.scrollLeft <= 10) {
          treatmentsTrack.scrollTo({
            left: treatmentsTrack.scrollWidth,
            behavior: 'smooth'
          });
        } else {
          treatmentsTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        }
      });
    }

    if (treatmentsNext) {
      treatmentsNext.addEventListener('click', () => {
        const cardWidth = slides[0].offsetWidth + 24;
        if (treatmentsTrack.scrollLeft + treatmentsTrack.clientWidth >= treatmentsTrack.scrollWidth - 15) {
          treatmentsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          treatmentsTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      });
    }

    // Auto-advance treatments carousel when not hovered
    let autoTreatmentTimer;
    function startAutoTreatments() {
      autoTreatmentTimer = setInterval(() => {
        if (!treatmentsTrack || slides.length === 0) return;
        const cardWidth = slides[0].offsetWidth + 24;
        if (treatmentsTrack.scrollLeft + treatmentsTrack.clientWidth >= treatmentsTrack.scrollWidth - 15) {
          treatmentsTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          treatmentsTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }, 4500);
    }

    function stopAutoTreatments() {
      clearInterval(autoTreatmentTimer);
    }

    treatmentsTrack.addEventListener('mouseenter', stopAutoTreatments);
    treatmentsTrack.addEventListener('mouseleave', startAutoTreatments);
    startAutoTreatments();
  }

  // 8. Gallery Filter & Next/Prev Lightbox Viewer
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-item-wrap');
  const lightboxModal = document.getElementById('customLightbox');
  const lightboxImgEl = document.getElementById('lightboxImg');
  const lightboxPrevBtn = document.getElementById('lightboxPrev');
  const lightboxNextBtn = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentGalleryList = [];
  let currentGalleryIndex = 0;

  function getVisibleGalleryImages() {
    const visibleCards = Array.from(document.querySelectorAll('.gallery-item-wrap')).filter(
      (card) => card.style.display !== 'none'
    );
    return visibleCards.map((card) => card.querySelector('.gallery-photo-card img')).filter(Boolean);
  }

  function updateLightboxImage(index) {
    if (!currentGalleryList.length) return;
    currentGalleryIndex = (index + currentGalleryList.length) % currentGalleryList.length;
    const targetImg = currentGalleryList[currentGalleryIndex];

    lightboxImgEl.style.opacity = '0';
    lightboxImgEl.style.transform = 'scale(0.95)';

    setTimeout(() => {
      lightboxImgEl.src = targetImg.src;
      lightboxImgEl.alt = targetImg.alt || 'Clinic Gallery';
      lightboxImgEl.style.opacity = '1';
      lightboxImgEl.style.transform = 'scale(1)';

      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryList.length}`;
      }
    }, 120);
  }

  if (galleryFilterBtns.length > 0 && galleryCards.length > 0) {
    galleryFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        galleryFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryCards.forEach((card) => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Gallery Card Image Click -> Open Lightbox with Navigation
  const galleryImgTriggers = document.querySelectorAll('.gallery-lightbox-trigger');

  if (galleryImgTriggers.length > 0 && lightboxModal && lightboxImgEl) {
    galleryImgTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const clickedImg = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
        if (!clickedImg) return;

        currentGalleryList = getVisibleGalleryImages();
        const foundIndex = currentGalleryList.findIndex((img) => img.src === clickedImg.src);
        currentGalleryIndex = foundIndex !== -1 ? foundIndex : 0;

        lightboxImgEl.src = clickedImg.src;
        lightboxImgEl.alt = clickedImg.alt || 'Clinic Gallery';
        if (lightboxCounter) {
          lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryList.length}`;
        }

        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImage(currentGalleryIndex + 1);
      });
    }

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightboxImage(currentGalleryIndex - 1);
      });
    }

    // Keyboard Arrow Keys Navigation
    window.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;

      if (e.key === 'ArrowRight') {
        updateLightboxImage(currentGalleryIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        updateLightboxImage(currentGalleryIndex - 1);
      } else if (e.key === 'Escape') {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});

