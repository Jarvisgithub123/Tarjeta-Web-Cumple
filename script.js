// Animaciones adicionales y efectos interactivos
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar posiciones del carrusel
  window.carouselPositions = {
    camila: 0,
    lautaro: 0,
    shared: 0
  };

  // Verificar que las imágenes existan antes de inicializar carruseles
  function initializeCarousel(carouselType) {
    const track = document.getElementById(`carousel-${carouselType}`);
    if (!track) return false;
    
    const slides = track.children;
    if (slides.length === 0) return false;
    
    // Verificar que al menos una imagen se haya cargado
    const images = track.querySelectorAll('img');
    let imagesLoaded = 0;
    
    return new Promise((resolve) => {
      if (images.length === 0) {
        resolve(false);
        return;
      }
      
      images.forEach(img => {
        if (img.complete) {
          imagesLoaded++;
        } else {
          img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
              resolve(true);
            }
          };
          img.onerror = () => {
            imagesLoaded++;
            if (imagesLoaded === images.length) {
              resolve(imagesLoaded > 0); // Al menos una imagen cargó
            }
          };
        }
      });
      
      // Si todas las imágenes ya están cargadas
      if (imagesLoaded === images.length) {
        resolve(true);
      }
    });
  }

  // Función mejorada para mover carrusel con validaciones
  function moveCarouselSafe(carouselType, direction) {
    const track = document.getElementById(`carousel-${carouselType}`);
    if (!track) {
      console.warn(`Carrusel ${carouselType} no encontrado`);
      return;
    }

    const slides = track.children;
    const totalSlides = slides.length;

    if (totalSlides === 0) {
      console.warn(`No hay slides en el carrusel ${carouselType}`);
      return;
    }

    // Verificar que las imágenes estén cargadas
    const images = track.querySelectorAll('img');
    const loadedImages = Array.from(images).filter(img => img.complete && img.naturalWidth > 0);
    
    if (loadedImages.length === 0) {
      console.warn(`No hay imágenes cargadas en el carrusel ${carouselType}`);
      return;
    }

    // Actualizar posición
    window.carouselPositions[carouselType] += direction;

    // Manejar el bucle
    if (window.carouselPositions[carouselType] >= totalSlides) {
      window.carouselPositions[carouselType] = 0;
    } else if (window.carouselPositions[carouselType] < 0) {
      window.carouselPositions[carouselType] = totalSlides - 1;
    }

    // Aplicar transformación basada en el tipo de carrusel
    try {
      if (carouselType === "shared") {
        const slideWidth = 250; // Ancho ajustado
        const translateX = -window.carouselPositions[carouselType] * slideWidth ;
        track.style.transform = `translateX(${translateX}px)`;
      } else {
        const slideHeight = 235;
        const translateY = -window.carouselPositions[carouselType] * slideHeight;
        track.style.transform = `translateY(${translateY}px)`;
      }

      // Efecto de transición suave
      track.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      
      // Resetear transición después de la animación
      setTimeout(() => {
        track.style.transition = "transform 0.5s ease-in-out";
      }, 500);
      
    } catch (error) {
      console.error(`Error al mover carrusel ${carouselType}:`, error);
    }
  }

  // Auto-rotación mejorada con manejo de errores
  async function autoRotateCarousels() {
    // Verificar qué carruseles están disponibles
    const availableCarousels = [];
    
    for (const type of ['camila', 'lautaro', 'shared']) {
      const isReady = await initializeCarousel(type);
      if (isReady) {
        availableCarousels.push(type);
      }
    }

    if (availableCarousels.length === 0) {
      console.warn('No hay carruseles disponibles para auto-rotación');
      return;
    }

    // Auto-rotar solo carruseles disponibles
    if (availableCarousels.includes('camila')) {
      setInterval(() => {
        moveCarouselSafe("camila", 1);
      }, 3000);
    }

    if (availableCarousels.includes('lautaro')) {
      setInterval(() => {
        moveCarouselSafe("lautaro", 1);
      }, 3500);
    }

    if (availableCarousels.includes('shared')) {
      setInterval(() => {
        moveCarouselSafe("shared", 1);
      }, 4000);
    }
  }

  // Efecto de parallax suave para las formas flotantes
  const shapes = document.querySelectorAll(".shape");

  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.5;
      const x = (mouseX - 0.5) * speed * 20;
      const y = (mouseY - 0.5) * speed * 20;

      shape.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // Efecto de hover mejorado para los botones del menú
  const menuItems = document.querySelectorAll(".menu ul li a");

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.05)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.menu ul li a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Animación de entrada para la tarjeta principal
  const celebrationCard = document.querySelector(".celebration-card");
  if (celebrationCard) {
    celebrationCard.style.opacity = "0";
    celebrationCard.style.transform = "translateY(50px)";

    setTimeout(() => {
      celebrationCard.style.transition = "all 1s ease-out";
      celebrationCard.style.opacity = "1";
      celebrationCard.style.transform = "translateY(0)";
    }, 300);
  }

  // Add scroll animations for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all info sections
  const infoSections = document.querySelectorAll(".info-section");
  infoSections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "all 0.8s ease-out";
    observer.observe(section);
  });

  // Add floating animation to dress cards
  const dressCards = document.querySelectorAll(".dress-card");
  dressCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.style.animation = "fadeInUp 0.8s ease-out forwards";
  });

  // Add stagger animation to detail cards
  const detailCards = document.querySelectorAll(".detail-card");
  detailCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.3}s`;
    card.style.animation = "fadeInUp 0.8s ease-out forwards";
  });

  // Enhanced hover effects for cards
  const cards = document.querySelectorAll(".dress-card, .detail-card, .venue-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

  // Add click effect to contact buttons
  const contactBtns = document.querySelectorAll(".contact-btn");

  contactBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  function createFloatingParticle() {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = Math.random() * 6 + 2 + "px";
    particle.style.height = particle.style.width;

    // Alternating between River red and gold colors
    const colors = ["rgba(227, 6, 19, 0.6)", "rgba(255, 215, 0, 0.6)", "rgba(255, 255, 255, 0.6)"];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    particle.style.borderRadius = "50%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = "100%";
    particle.style.pointerEvents = "none";
    particle.style.zIndex = "2";

    const banner = document.querySelector(".banner");
    if (banner) {
      banner.appendChild(particle);

      const duration = Math.random() * 3000 + 2000;
      const drift = (Math.random() - 0.5) * 100;

      particle.animate(
        [
          { transform: `translateY(0) translateX(0)`, opacity: 0 },
          { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 1 },
        ],
        {
          duration: duration,
          easing: "linear",
        },
      ).onfinish = () => particle.remove();
    }
  }

  // Crear partículas cada cierto tiempo
  setInterval(createFloatingParticle, 800);

  // Iniciar auto-rotación después de un delay para asegurar que las imágenes se carguen
  setTimeout(() => {
    autoRotateCarousels();
  }, 2000);

  // Animar entrada del carrusel
  const carousels = document.querySelectorAll(".carousel-container");
  carousels.forEach((carousel, index) => {
    carousel.style.opacity = "0";
    carousel.style.transform += " scale(0.8)";

    setTimeout(
      () => {
        carousel.style.transition = "all 0.8s ease-out";
        carousel.style.opacity = "1";
        carousel.style.transform = carousel.style.transform.replace("scale(0.8)", "scale(1)");
      },
      800 + index * 200,
    );
  });

  // Manejo de formularios
  const forms = document.querySelectorAll(".modal-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const modalType = this.closest(".modal").id.replace("Modal", "");

      // Show loading state
      const submitBtn = this.querySelector(".submit-btn");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      // Submit to Formspree
      fetch(this.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            showSuccessMessage(modalType);
            this.reset();
            setTimeout(() => {
              closeModal(modalType);
            }, 2000);
          } else {
            throw new Error("Error en el envío");
          }
        })
        .catch((error) => {
          showErrorMessage();
        })
        .finally(() => {
          // Restore button
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    });
  });

  // Exponer la función moveCarouselSafe globalmente
  window.moveCarousel = moveCarouselSafe;
});

// Touch support for mobile carousels
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  if (!touchStartX || !touchStartY) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  const minSwipeDistance = 50;

  // Determine which carousel was swiped
  const target = e.target.closest(".carousel-container");
  if (!target) return;

  let carouselType = "";
  if (target.classList.contains("carousel-shared")) {
    carouselType = "shared";
    // Horizontal swipe for shared carousel
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      window.moveCarousel(carouselType, diffX > 0 ? 1 : -1);
    }
  } else if (target.classList.contains("carousel-camila")) {
    carouselType = "camila";
    // Vertical swipe for side carousels
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
      window.moveCarousel(carouselType, diffY > 0 ? 1 : -1);
    }
  } else if (target.classList.contains("carousel-lautaro")) {
    carouselType = "lautaro";
    // Vertical swipe for side carousels
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
      window.moveCarousel(carouselType, diffY > 0 ? 1 : -1);
    }
  }

  touchStartX = 0;
  touchStartY = 0;
});

// Map functionality
function openMap() {
  // Replace with actual coordinates
  const address = "M5570FVI, Cjón. Fernandez 602-772, M5570FVI San Martín, Mendoza";
  const encodedAddress = encodeURIComponent(address);

  // Try to open in Google Maps app first, fallback to web
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  window.open(googleMapsUrl, "_blank");
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;
document.head.appendChild(style);

// Add parallax effect to section backgrounds
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const sections = document.querySelectorAll(".info-section");

  sections.forEach((section, index) => {
    const rate = scrolled * -0.5;
    section.style.backgroundPosition = `center ${rate}px`;
  });
});

// Add ripple effect CSS
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
  .contact-btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);

// Función para mostrar mensaje de éxito
function showSuccessMessage(type) {
  const messages = {
    music: "¡Tu pedido musical fue enviado! 🎵",
    message: "¡Tu mensaje fue enviado con amor! 💖",
    tips: "¡Gracias por compartir tu sabiduría! 💡",
  };

  // Crear mensaje de éxito
  const successDiv = document.createElement("div");
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
    z-index: 1002;
    font-weight: 600;
    animation: slideInRight 0.3s ease-out;
  `;
  successDiv.textContent = messages[type];

  document.body.appendChild(successDiv);

  // Remover después de 3 segundos
  setTimeout(() => {
    successDiv.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 300);
  }, 3000);
}

// Agregar animaciones CSS adicionales
const additionalStyles = document.createElement("style");
additionalStyles.textContent = `
  @keyframes modalSlideOut {
    from {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(additionalStyles);

// Función para mostrar mensaje de error
function showErrorMessage() {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #f44336, #d32f2f);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(244, 67, 54, 0.3);
    z-index: 1002;
    font-weight: 600;
    animation: slideInRight 0.3s ease-out;
  `;
  errorDiv.textContent = "Hubo un error al enviar. Intentá de nuevo.";

  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 300);
  }, 4000);
}

// Function to open modals
function openModal(modalType) {
  const modal = document.getElementById(`${modalType}Modal`);
  if (modal) {
    modal.style.display = "block";
    modal.style.opacity = "0";
    modal.style.transform = "translateY(-50px) scale(0.9)";

    // Trigger the animation after a small delay
    setTimeout(() => {
      modal.style.transition = "all 0.3s ease-out";
      modal.style.opacity = "1";
      modal.style.transform = "translateY(0) scale(1)";
    }, 10);
  }
}

// Function to close modals
function closeModal(modalType) {
  const modal = document.getElementById(`${modalType}Modal`);
  if (modal) {
    modal.style.transition = "all 0.3s ease-out";
    modal.style.opacity = "0";
    modal.style.transform = "translateY(-50px) scale(0.9)";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  }
}

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    const modalId = event.target.id;
    const modalType = modalId.replace("Modal", "");
    closeModal(modalType);
  }
});