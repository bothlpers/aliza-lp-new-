const config = {
    videosCount: 7,         // Aliza Lifestyle Videos
    aiBotCount: 6,          // AI Bot
    vipCount: 5,            // VIP Results
    lossRecoveryCount: 16   // Loss Recovery
};

const imgExts = ['.jpg', '.jpeg', '.jpg.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
const vidExts = ['.mp4', '.MP4', '.mov', '.MOV'];

document.addEventListener('DOMContentLoaded', () => {

    // Helper: Smart Image Fallback Loader
    function loadMediaWithFallback(imgElement, basePath) {
        let currentTry = 0;
        function tryNext() {
            if (currentTry >= imgExts.length) return;
            imgElement.src = `${basePath}${imgExts[currentTry]}`;
            currentTry++;
        }
        imgElement.onerror = tryNext;
        tryNext();
    }

    // Helper: Smart Video Fallback Loader
    function loadVideoWithFallback(wrapperId, basePath) {
        const wrapper = document.getElementById(wrapperId);
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        
        const videoElement = document.createElement('video');
        videoElement.autoplay = true; 
        videoElement.loop = true; 
        videoElement.muted = true; 
        videoElement.playsInline = true;

        let currentTry = 0;
        function tryNextVideo() {
            if (currentTry >= vidExts.length) return;
            videoElement.src = `${basePath}${vidExts[currentTry]}`;
            currentTry++;
        }
        
        videoElement.onerror = tryNextVideo;
        tryNextVideo();
        
        slide.appendChild(videoElement);
        wrapper.appendChild(slide);
    }

    // 1. Load Lifestyle Videos
    for(let i = 1; i <= config.videosCount; i++) {
        loadVideoWithFallback('video-wrapper', `./assets/success-videos/${i}`);
    }

    // 2. Load Sliders with JS Injection
    function populateSlider(wrapperId, folderName, count) {
        const wrapper = document.getElementById(wrapperId);
        for(let i = 1; i <= count; i++) {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            const img = document.createElement('img');
            img.alt = `Feedback ${i}`;
            loadMediaWithFallback(img, `./assets/feedbacks/${folderName}/${i}`);
            slide.appendChild(img);
            wrapper.appendChild(slide);
        }
    }

    populateSlider('ai-wrapper', 'ai-bot', config.aiBotCount);
    populateSlider('vip-wrapper', 'vip', config.vipCount);
    populateSlider('loss-wrapper', 'loss-recovery', config.lossRecoveryCount);

    // 3. Initialize Swiper.js
    const swiperOptions = {
        effect: "coverflow", grabCursor: true, centeredSlides: true,
        slidesPerView: "auto", spaceBetween: 25, loop: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
        coverflowEffect: { rotate: 0, stretch: 0, depth: 100, modifier: 2, slideShadows: true },
        pagination: { el: ".swiper-pagination", clickable: true },
        observer: true, observeParents: true 
    };

    new Swiper("#video-swiper", swiperOptions);
    new Swiper("#ai-swiper", swiperOptions);
    new Swiper("#vip-swiper", swiperOptions);
    
    const lossSwiperOptions = {...swiperOptions};
    lossSwiperOptions.autoplay = { delay: 1500, disableOnInteraction: false };
    new Swiper("#loss-swiper", lossSwiperOptions);

    // 4. Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    // 5. META PIXEL TRACKING LOGIC FOR LEAD EVENTS
    const trackingButtons = document.querySelectorAll('.track-telegram, .track-session');
    trackingButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if Pixel is loaded before firing to prevent JS errors
            if (typeof fbq === 'function') {
                fbq('track', 'Lead');
            }
        });
    });
});
