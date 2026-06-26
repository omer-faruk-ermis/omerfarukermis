document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SPLASH SCREEN & MUSIC CONTROLLER
       ========================================================================== */
    const splashScreen = document.getElementById('splash-screen');
    const openInvitationBtn = document.getElementById('open-invitation');
    const mainContent = document.getElementById('main-content');
    const musicToggleBtn = document.getElementById('music-toggle');
    const playIcon = musicToggleBtn.querySelector('.play-icon');
    const pauseIcon = musicToggleBtn.querySelector('.pause-icon');

    let ytPlayer;
    let isPlaying = false;
    let isPlayerReady = false;
    let shouldPlayOnReady = false;

    // YouTube IFrame API Ready Callback
    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtube-audio', {
            height: '1',
            width: '1',
            videoId: 'qAKu7v3RReQ',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'loop': 1,
                'playlist': 'qAKu7v3RReQ',
                'playsinline': 1
            },
            events: {
                'onReady': () => { 
                    isPlayerReady = true;
                    ytPlayer.unMute();
                    ytPlayer.setVolume(100);
                    if (shouldPlayOnReady) {
                        playMusic();
                    }
                }
            }
        });
    };

    // Davetiyeyi Aç butonu tıklama olayı
    openInvitationBtn.addEventListener('click', () => {
        // Zarfı açma animasyonu sınıfını ekle
        splashScreen.classList.add('opened');
        
        // Ana içeriği görünür yap
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            mainContent.classList.add('visible');
            // Intersection observer'ı tetiklemek için scroll eventini simüle et
            window.dispatchEvent(new Event('scroll'));
        }, 50);

        // Müzik kontrol butonunu göster
        musicToggleBtn.classList.remove('hidden');

        // Müziği oynatmayı dene
        playMusic();
    });

    // Müzik çalma fonksiyonu
    function playMusic() {
        if (!isPlayerReady) {
            shouldPlayOnReady = true;
            return;
        }
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.unMute();
            ytPlayer.setVolume(100);
            ytPlayer.playVideo();
            isPlaying = true;
            musicToggleBtn.classList.add('playing');
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }
    }

    // Müzik durdurma fonksiyonu
    function pauseMusic() {
        if (isPlayerReady && ytPlayer) {
            ytPlayer.pauseVideo();
            isPlaying = false;
            musicToggleBtn.classList.remove('playing');
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    // Müzik butonuna tıklama olayı
    musicToggleBtn.addEventListener('click', () => {
        if (!isPlaying) {
            playMusic();
        } else {
            pauseMusic();
        }
    });


    /* ==========================================================================
       2. GERİ SAYIM SAYACI (COUNTDOWN TIMER)
       ========================================================================== */
    // Hedef Tarih (Düğün): 21 Temmuz 2026, 17:00
    const weddingDate = new Date('July 21, 2026 17:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        if (difference <= 0) {
            // Düğün günü geldi veya geçti
            document.querySelector('.timer-container').innerHTML = `<h4 style="font-family: var(--font-heading); color: var(--accent-gold-dark); font-size: 1.8rem; width: 100%;">BÜYÜK GÜN GELDİ!</h4>`;
            return;
        }

        // Zaman hesaplamaları
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // UI Güncelleme (Başına sıfır ekleyerek formatla)
        daysEl.textContent = days < 10 ? '0' + days : days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    // İlk güncellemeyi yap ve her saniye tekrarla
    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ==========================================================================
       3. FOTOĞRAF GALERİSİ & LIGHTBOX MODAL
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    // Galerideki tüm görsellerin URL'lerini topla
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);
    let activeImageIndex = 0;

    // Görsele tıklanınca Lightbox'ı aç
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            activeImageIndex = parseInt(item.getAttribute('data-index'), 10);
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImg.src = images[activeImageIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Scroll'u engelle
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Scroll'u geri getir
    }

    function showNextImage() {
        activeImageIndex = (activeImageIndex + 1) % images.length;
        lightboxImg.src = images[activeImageIndex];
    }

    function showPrevImage() {
        activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[activeImageIndex];
    }

    // Lightbox Buton Olayları
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Dışarı tıklanınca kapat
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Klavye yön tuşları desteği
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });


    /* ==========================================================================
       4. KAYDIRMA ANİMASYONLARI (INTERSECTION OBSERVER)
       ========================================================================== */
    const fadeElements = document.querySelectorAll('.fade-in-element');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // elementin %15'i görününce çalıştır
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Eleman bir kez görünür olduktan sonra gözlemlemeyi bırakabiliriz
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        scrollObserver.observe(element);
    });


});
