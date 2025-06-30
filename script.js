// Initialisation AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Navigation Mobile
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fermer le menu mobile au clic sur un lien
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navigation sticky
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Scroll fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Carrousel de témoignages
class TestimonialSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-card');
        this.buttons = document.querySelectorAll('.testimonial-btn');
        this.currentSlide = 0;
        this.init();
    }

    init() {
        this.showSlide(0);
        
        this.buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.showSlide(index);
            });
        });

        this.startAutoPlay();
    }

    showSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.buttons.forEach(button => button.classList.remove('active'));

        this.slides[index].classList.add('active');
        this.buttons[index].classList.add('active');
        
        this.currentSlide = index;
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    startAutoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Initialiser le carrousel
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
});

// Galerie interactive
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${img.alt}">
                <div class="lightbox-caption">
                    <h3>${overlay.querySelector('h3').textContent}</h3>
                    <p>${overlay.querySelector('p').textContent}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                document.body.removeChild(lightbox);
            }
        });
    });
});

// Formulaire d'inscription
const registrationForm = document.getElementById('registration-form');

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = registrationForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    const formData = new FormData(registrationForm);
    const data = Object.fromEntries(formData);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('Votre demande a été envoyée avec succès ! Nous vous contacterons dans les 24h.', 'success');
        registrationForm.reset();
        
        setTimeout(() => {
            const whatsappMessage = `Bonjour ! Je viens de remplir le formulaire d'inscription pour le programme ${data.programme}. Voici mes informations : Nom: ${data.nom}, Téléphone: ${data.telephone}`;
            const whatsappUrl = `https://wa.me/237697475573?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }, 3000);
        
    } catch (error) {
        showNotification('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Compteurs animés
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    element.textContent = '0'; // Start animation from 0

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observer pour les animations au scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (el.classList.contains('stat-number')) {
                const fullText = el.textContent;
                const target = parseInt(fullText, 10);

                if (!isNaN(target)) {
                    const suffix = fullText.substring(String(target).length);
                    animateCounter(el, target, 2000, suffix);
                    observer.unobserve(el);
                }
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
});

// Effet parallax pour le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg img');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Validation en temps réel des formulaires
document.querySelectorAll('input[required], select[required]').forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field);
    });
    
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            validateField(field);
        }
    });
});

function validateField(field) {
    const isValid = field.checkValidity();
    
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }
}

// Bouton de retour en haut
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.setAttribute('aria-label', 'Retour en haut');
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

console.log('🇷🇺 Centre Linguistique Russe du Cameroun - Site Web Chargé!'); 