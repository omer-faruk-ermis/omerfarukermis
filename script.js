document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SPLASH SCREEN & MUSIC CONTROLLER
       ========================================================================== */
    const splashScreen = document.getElementById('splash-screen');
    const openInvitationBtn = document.getElementById('open-invitation');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const playIcon = musicToggleBtn.querySelector('.play-icon');
    const pauseIcon = musicToggleBtn.querySelector('.pause-icon');

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

        // Müziği oynatmayı dene (kullanıcı etkileşimi olduğu için tarayıcı izin verir)
        playMusic();
    });

    // Müzik çalma fonksiyonu
    function playMusic() {
        bgMusic.play()
            .then(() => {
                musicToggleBtn.classList.add('playing');
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            })
            .catch(error => {
                console.log('Müzik çalınamadı (tarayıcı kısıtlaması):', error);
            });
    }

    // Müzik durdurma fonksiyonu
    function pauseMusic() {
        bgMusic.pause();
        musicToggleBtn.classList.remove('playing');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }

    // Müzik butonuna tıklama olayı
    musicToggleBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
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



    /* ==========================================================================
       5. MULTI-LANGUAGE SUPPORT
       ========================================================================== */
    const translations = {
        tr: {
            envelopeSub: "Birlikteliğe ilk adımımızı atarken sizleri de aramızda görmekten mutluluk\n                    duyarız.",
            openBtn: "AÇ",
            clickInstruction: "Lütfen davetiyeyi açmak için mühüre tıklayın",
            heroQuote: '"Bir ömrü birlikte geçirmeye, sevgiyle ve umutla yürümeye karar verdik. Bu en\n                        özel\n                        günümüzde sizleri yanımızda görmek bizlere mutluluk verecektir."',
            tuesday: "Salı",
            july21: "21 TEMMUZ 2026",
            weddingCeremony: "Düğün Töreni",
            time17: "Saat: 17:00",
            hennaNight: "Kına Gecesi",
            time21: "Saat: 21:00",
            photoGallery: "Fotoğraf Galerisi",
            countdown: "Geri Sayım",
            countdownSub: "Bu mutlu güne kavuşmamıza kalan süre",
            days: "Gün",
            hours: "Saat",
            minutes: "Dakika",
            seconds: "Saniye",
            location: "Ulaşım ve Konum",
            locationSub: "Düğün ve kına alanına kolayca ulaşmanız için yol tarifi edinin",
            addressInfo: "Adres Bilgisi",
            importantNote: "Önemli Not",
            parkingNote: "Salonumuzda geniş otopark alanı mevcuttur. Düğün ve kına organizasyonları aynı\n                                    salonda gerçekleştirilecektir.",
            googleMaps: "Google Haritalar",
            appleMaps: "Apple Haritalar",
            footerThankYou: "Mutluluğumuzu paylaşan herkese teşekkür ederiz.",
            july21TitleCase: "21 Temmuz 2026"
        },
        sv: {
            envelopeSub: "Vi är glada att ha er med oss när vi tar vårt första steg tillsammans.",
            openBtn: "ÖPPNA",
            clickInstruction: "Vänligen klicka på sigillet för att öppna inbjudan",
            heroQuote: '"Vi har beslutat att tillbringa en livstid tillsammans, vandra med kärlek och hopp. Det skulle göra oss glada att se er vid vår sida på vår mest speciella dag."',
            tuesday: "Tisdag",
            july21: "21 JULI 2026",
            weddingCeremony: "Bröllopsceremoni",
            time17: "Tid: 17:00",
            hennaNight: "Hennakväll",
            time21: "Tid: 21:00",
            photoGallery: "Fotogalleri",
            countdown: "Nedräkning",
            countdownSub: "Tid kvar till vår lyckliga dag",
            days: "Dagar",
            hours: "Timmar",
            minutes: "Minuter",
            seconds: "Sekunder",
            location: "Plats & Vägbeskrivning",
            locationSub: "Få vägbeskrivningar för att enkelt nå bröllops- och henna-lokalen",
            addressInfo: "Adressinformation",
            importantNote: "Viktigt Meddelande",
            parkingNote: "Vår lokal har en stor parkeringsplats. Bröllopet och henna-evenemangen kommer att hållas i samma sal.",
            googleMaps: "Google Maps",
            appleMaps: "Apple Maps",
            footerThankYou: "Tack till alla som delar vår lycka.",
            july21TitleCase: "21 Juli 2026"
        },
        da: {
            envelopeSub: "Vi er glade for at have jer med os, når vi tager vores første skridt sammen.",
            openBtn: "ÅBN",
            clickInstruction: "Klik venligst på seglet for at åbne invitationen",
            heroQuote: '"Vi har besluttet at tilbringe et helt liv sammen, gå med kærlighed og håb. Det vil gøre os glade at se jer ved vores side på vores mest specielle dag."',
            tuesday: "Tirsdag",
            july21: "21. JULI 2026",
            weddingCeremony: "Bryllupsceremoni",
            time17: "Tid: 17:00",
            hennaNight: "Henna Aften",
            time21: "Tid: 21:00",
            photoGallery: "Fotogalleri",
            countdown: "Nedtælling",
            countdownSub: "Tid tilbage til vores lykkelige dag",
            days: "Dage",
            hours: "Timer",
            minutes: "Minutter",
            seconds: "Sekunder",
            location: "Transport & Beliggenhed",
            locationSub: "Få rutevejledning for nemt at nå bryllups- og henna-området",
            addressInfo: "Adresseinformation",
            importantNote: "Vigtig Bemærkning",
            parkingNote: "Vores hal har et stort parkeringsområde. Bryllup og henna-arrangementer vil blive afholdt i den samme hal.",
            googleMaps: "Google Maps",
            appleMaps: "Apple Maps",
            footerThankYou: "Tak til alle, der deler vores lykke.",
            july21TitleCase: "21. Juli 2026"
        },
        de: {
            envelopeSub: "Wir freuen uns, Sie bei unserem ersten gemeinsamen Schritt dabei zu haben.",
            openBtn: "ÖFFNEN",
            clickInstruction: "Bitte klicken Sie auf das Siegel, um die Einladung zu öffnen",
            heroQuote: '"Wir haben beschlossen, ein Leben lang zusammen zu verbringen und mit Liebe und Hoffnung zu gehen. Es würde uns freuen, Sie an unserem ganz besonderen Tag an unserer Seite zu haben."',
            tuesday: "Dienstag",
            july21: "21. JULI 2026",
            weddingCeremony: "Hochzeitszeremonie",
            time17: "Uhrzeit: 17:00",
            hennaNight: "Henna-Nacht",
            time21: "Uhrzeit: 21:00",
            photoGallery: "Fotogalerie",
            countdown: "Countdown",
            countdownSub: "Verbleibende Zeit bis zu unserem glücklichen Tag",
            days: "Tage",
            hours: "Stunden",
            minutes: "Minuten",
            seconds: "Sekunden",
            location: "Standort & Anfahrt",
            locationSub: "Holen Sie sich eine Wegbeschreibung, um den Hochzeits- und Henna-Ort leicht zu erreichen",
            addressInfo: "Adressinformationen",
            importantNote: "Wichtiger Hinweis",
            parkingNote: "Unser Saal verfügt über einen großen Parkplatz. Hochzeits- und Henna-Veranstaltungen finden im selben Saal statt.",
            googleMaps: "Google Maps",
            appleMaps: "Apple Maps",
            footerThankYou: "Danke an alle, die unser Glück teilen.",
            july21TitleCase: "21. Juli 2026"
        },
        ku: {
            envelopeSub: "Em kêfxweş in ku hûn di gava me ya yekem a bi hev re de bi me re ne.",
            openBtn: "VEKE",
            clickInstruction: "Ji kerema xwe li ser mohrê bikirtînin da ku vexwendinê vekin",
            heroQuote: '"Me biryar da ku em jiyanek bi hev re derbas bikin, bi evîn û hêviyê bimeşin. Dîtina we li cem me di vê roja me ya herî taybet de dê me kêfxweş bike."',
            tuesday: "Sêşem",
            july21: "21 TÎRMEH 2026",
            weddingCeremony: "Merasîma Dawetê",
            time17: "Saet: 17:00",
            hennaNight: "Şeva Heneyê",
            time21: "Saet: 21:00",
            photoGallery: "Galeriya Wêneyan",
            countdown: "Jimartina Paş",
            countdownSub: "Dem maye ji bo roja me ya dilxweş",
            days: "Roj",
            hours: "Saet",
            minutes: "Deqîqe",
            seconds: "Saniye",
            location: "Cih û Veguhastin",
            locationSub: "Ji bo gihîştina cihê dawet û heneyê bi hêsanî rêwerzan bistînin",
            addressInfo: "Agahdariya Navnîşanê",
            importantNote: "Têbînîya Girîng",
            parkingNote: "Li salona me qadek parkkirinê ya mezin heye. Bûyerên dawet û heneyê dê di heman salonê de werin lidarxistin.",
            googleMaps: "Nexşeyên Google",
            appleMaps: "Nexşeyên Apple",
            footerThankYou: "Spas ji bo her kesê ku kêfxweşiya me parve dike.",
            july21TitleCase: "21 Tîrmeh 2026"
        }
    };

    const langBtns = document.querySelectorAll('.lang-btn');
    
    function setLanguage(lang) {
        // Change text for elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key]; // innerHTML is used to preserve line breaks
            }
        });
        
        // Update active class on buttons
        langBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Save preference
        localStorage.setItem('preferredLang', lang);
        
        // Change document language
        document.documentElement.lang = lang;
    }

    // Event listeners
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Initialize with saved language or default to tr
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
    }

});
