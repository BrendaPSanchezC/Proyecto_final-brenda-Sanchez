function autoplayCarousel() {
  const carouselEl = document.getElementById("carousel");
  const slideContainerEl = carouselEl?.querySelector("#slide-container");
  const slides = Array.from(slideContainerEl?.querySelectorAll(".slide") || []);
  const slideIndicators = Array.from(carouselEl?.querySelectorAll(".slide-indicator") || []);
  const backButton = document.querySelector("#back-button");
  const forwardButton = document.querySelector("#forward-button");

  if (!carouselEl || !slideContainerEl || slides.length === 0) {
      console.error("Error: Carrusel no está configurado correctamente.");
      return;
  }

  let slideWidth = slides[0].offsetWidth;
  let autoplay;

  const getGap = () => parseFloat(window.getComputedStyle(slideContainerEl).getPropertyValue("gap")) || 0;

  const getNewScrollPosition = (arg) => {
      const gap = getGap();
      const maxScrollLeft = slideContainerEl.scrollWidth - slideContainerEl.clientWidth;
      if (arg === "forward") return slideContainerEl.scrollLeft + slideWidth + gap <= maxScrollLeft ? slideContainerEl.scrollLeft + slideWidth + gap : 0;
      if (arg === "backward") return slideContainerEl.scrollLeft - slideWidth - gap >= 0 ? slideContainerEl.scrollLeft - slideWidth - gap : maxScrollLeft;
      return arg * (slideWidth + gap);
  };

  const navigate = (arg) => {
      slideContainerEl.scrollTo({ left: getNewScrollPosition(arg), behavior: "smooth" });
  };

  const updateIndicators = (index) => {
      carouselEl.querySelector(".slide-indicator.active")?.classList.remove("active");
      slideIndicators[index]?.classList.add("active");
  };

  const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) updateIndicators(Number(entry.target.dataset.slideindex));
      });
  }, { root: slideContainerEl, threshold: 0.5 });

  slides.forEach((slide, index) => {
      slide.dataset.slideindex = index;
      slideObserver.observe(slide);
  });

  backButton?.addEventListener("click", () => {
      clearAutoplay();
      navigate("backward");
  });

  forwardButton?.addEventListener("click", () => {
      clearAutoplay();
      navigate("forward");
  });

  slideIndicators.forEach((dot, index) => {
      dot.addEventListener("click", () => {
          clearAutoplay();
          navigate(index);
      });
  });

  document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft") {
          clearAutoplay();
          navigate("backward");
      } else if (e.code === "ArrowRight") {
          clearAutoplay();
          navigate("forward");
      }
  });

  window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => slideWidth = slides[0].offsetWidth, 200);
  });

  const startAutoplay = () => autoplay = setInterval(() => navigate("forward"), 3000);
  const clearAutoplay = () => clearInterval(autoplay);

  slideContainerEl.addEventListener("mouseenter", clearAutoplay);
  slideContainerEl.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}

autoplayCarousel();

