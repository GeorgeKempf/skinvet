let slideIndex = 1;
let slideTimer = null;

// Auto-play do carrossel (muda a cada 5 segundos)
function autoSlide() {
    showSlides(slideIndex += 1);
    slideTimer = setTimeout(autoSlide, 5000); // 5 segundos
}

// Muda para o slide específico (ao clicar no ponto)
function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
    slideTimer = setTimeout(autoSlide, 5000); // Reinicia auto-play
}

// Avança ou volta slides (setas)
function changeSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
    slideTimer = setTimeout(autoSlide, 5000); // Reinicia auto-play
}

// Mostra o slide ativo
function showSlides(n) {
    const slides = document.getElementsByClassName("carousel-item");
    const dots = document.getElementsByClassName("dot");

    // Volta ao primeiro slide se passar do último
    if (n > slides.length) {
        slideIndex = 1;
    }

    // Volta ao último slide se for antes do primeiro
    if (n < 1) {
        slideIndex = slides.length;
    }

    // Remove classe active de todos os slides e dots
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    // Adiciona classe active ao slide e dot atual
    if (slides.length > 0) {
        slides[slideIndex - 1].classList.add("active");
    }
    
    if (dots.length > 0) {
        dots[slideIndex - 1].classList.add("active");
    }
}

// Inicia o carrossel quando a página carrega
document.addEventListener("DOMContentLoaded", function() {
    showSlides(slideIndex);
    slideTimer = setTimeout(autoSlide, 5000); // Primeira mudança após 5 segundos
});