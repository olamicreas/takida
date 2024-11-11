// Toggle Navbar Function
function toggleNavbar(event) {
    if (event) {
        event.stopPropagation(); // Prevent the click from bubbling up
    }

    const navLinks = document.querySelector('.nav-links');
    const burger = document.getElementById('burger');

    if (navLinks && burger) {
        navLinks.classList.toggle('active'); // Toggle visibility of nav links
        burger.classList.toggle('active'); // Toggle burger icon to X and vice versa

        // Toggle body scroll when the menu is active
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    } else {
        console.error("Navigation links or burger menu not found.");
    }
}

// Close navbar if clicked outside
function closeNavbarOnOutsideClick(event) {
    const navLinks = document.querySelector('.nav-links');
    const burger = document.getElementById('burger');

    // Check if navLinks is active and the click occurred outside of navLinks and burger
    if (navLinks.classList.contains('active') && !navLinks.contains(event.target) && event.target !== burger) {
        toggleNavbar(); // Close navbar if clicked outside
    }
}



// Add event listeners for burger click and outside click
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    if (burger) {
        burger.addEventListener('click', toggleNavbar);
    }
    document.addEventListener('click', closeNavbarOnOutsideClick);
    initializeSwiper();
    initializeModal();
    initializeImages(); // Initialize images for tooltips and click functionality
    
    console.log("Script loaded successfully");
});

// Swiper Slider Initialization
function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
        new Swiper(".swiper", {
            effect: "cube",
            grabCursor: true,
            loop: true,
            speed: 1000,
            cubeEffect: {
                shadow: false,
                slideShadows: true,
                shadowOffset: 10,
                shadowScale: 0.94,
            },
            autoplay: {
                delay: 2600,
                pauseOnMouseEnter: true,
            },
        });
    } else {
        console.error("Swiper library not found.");
    }
}

// Modal Initialization and Functionality
function initializeModal() {
    const modal = document.getElementById("contactModal");
    const closeBtn = document.querySelector(".mclose");
    const bookUsButton = document.getElementById("booksUsButton");
    const bookAppointmentButton = document.getElementById("bookAppointmentButton");
    const writeReviewButton = document.getElementById("writeReviewButton");
    const bookbook = document.getElementById('bookbook')
    const booksUsButton1 = document.getElementById('booksUsButton1')
    const booksUsButton2 = document.getElementById('booksUsButton2')
    const subjectDropdown = document.getElementById("subject");

    function toggleFields() {
        if (subjectDropdown.value === "appointment") {
            bookingDetails.style.display = "none";
            messageBox.style.display = "block";
        } else {
            bookingDetails.style.display = "block";
            messageBox.style.display = "none";
        }
    }
    function openModal(defaultToReview = false) {
        if (defaultToReview) {
            subjectDropdown.value = "booking";
            toggleFields();
        } else {
            subjectDropdown.value = "appointment";
            toggleFields();
        }
        modal.style.display = "flex";
        setTimeout(() => {
            modal.querySelector(".modal_content").style.transform = "translateY(0)";
        }, 50);
    }

    function closeModal() {
        modal.querySelector(".modal_content").style.transform = "translateY(-50px)";
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }

    // Event Listeners for opening modal
    bookUsButton.addEventListener("click", openModal);
    bookAppointmentButton.addEventListener("click", () => openModal(false));
    writeReviewButton.addEventListener("click", openModal);
    bookbook.addEventListener('click', openModal)
    booksUsButton1.addEventListener('click', openModal)
    booksUsButton2.addEventListener('click', openModal)

    // Close modal when clicking close button
    closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside the content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}
let bridalIndex = 0;
let clientIndex = 0;

// Function to determine the appropriate slide width percentage based on screen size
function getSlideWidth() {
    return window.innerWidth <= 768 ? 100 : 100 / 3; // 100% for small screens, 33.33% for large screens
}

function bridalNextSlide() {
    const track = document.querySelector('.bridal-carousel-track');
    const slides = document.querySelectorAll('.bridal-carousel .about-carousel-slide');
    bridalIndex = updateCarouselIndex(bridalIndex + 1, slides.length);
    track.style.transform = `translateX(-${bridalIndex * getSlideWidth()}%)`;
}

function bridalPrevSlide() {
    const track = document.querySelector('.bridal-carousel-track');
    const slides = document.querySelectorAll('.bridal-carousel .about-carousel-slide');
    bridalIndex = updateCarouselIndex(bridalIndex - 1, slides.length);
    track.style.transform = `translateX(-${bridalIndex * getSlideWidth()}%)`;
}

function clientNextSlide() {
    const track = document.querySelector('.client-carousel-track');
    const slides = document.querySelectorAll('.client-carousel .about-carousel-slide');
    clientIndex = updateCarouselIndex(clientIndex + 1, slides.length);
    track.style.transform = `translateX(-${clientIndex * getSlideWidth()}%)`;
}

function clientPrevSlide() {
    const track = document.querySelector('.client-carousel-track');
    const slides = document.querySelectorAll('.client-carousel .about-carousel-slide');
    clientIndex = updateCarouselIndex(clientIndex - 1, slides.length);
    track.style.transform = `translateX(-${clientIndex * getSlideWidth()}%)`;
}

// Helper function to handle the boundary checks for each carousel
function updateCarouselIndex(index, totalSlides) {
    const maxIndex = window.innerWidth <= 768 ? totalSlides - 1 : totalSlides - 3;
    if (index < 0) {
        return 0; // Stay at the first slide
    } else if (index > maxIndex) {
        return maxIndex; // Stay at the last set of slides
    } else {
        return index; // Set to the provided index
    }
}

// Event listener to re-adjust the slide width on screen resize
window.addEventListener('resize', () => {
    const trackBridal = document.querySelector('.bridal-carousel-track');
    const trackClient = document.querySelector('.client-carousel-track');
    trackBridal.style.transform = `translateX(-${bridalIndex * getSlideWidth()}%)`;
    trackClient.style.transform = `translateX(-${clientIndex * getSlideWidth()}%)`;
});



// Function to open the fullscreen modal with the clicked image
function openFullscreen(imageSrc) {
    const fullscreenModal = document.getElementById('fullscreenModal');
    const fullscreenImage = document.getElementById('fullscreenImage');

    fullscreenImage.src = imageSrc; // Set the image source
    fullscreenModal.style.display = "flex"; // Show the modal
}

// Function to close the fullscreen modal
function closeFullscreen() {
    const fullscreenModal = document.getElementById('fullscreenModal');
    fullscreenModal.style.display = "none"; // Hide the modal
}

// Initialize images and add click event listeners
// Tooltip initialization
function initializeImages() {
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const swiperImages = document.querySelectorAll('.swiper-slide img');
    const aboutCarouselImages = document.querySelectorAll('.about-carousel-slide img');

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Function to show tooltip
    function showTooltip(event) {
        const message = event.target.getAttribute('data-tooltip');
        if (message) {
            tooltip.innerText = message;
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.pageX + 10}px`; // Offset the tooltip position
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.classList.add('show'); // Add class to make tooltip visible
        }
    }

    // Function to hide tooltip
    function hideTooltip() {
        tooltip.style.display = 'none';
        tooltip.classList.remove('show'); // Remove visibility class
    }

    // Function to handle image click
    function handleImageClick(image) {
        image.addEventListener('click', () => {
            console.log('Image clicked:', image.src); // Log the clicked image
            openFullscreen(image.src);
        });
    }

    // Add hover and click events for all images
    [...carouselImages, ...swiperImages, ...aboutCarouselImages].forEach(image => {
        handleImageClick(image);
        image.addEventListener('mouseover', showTooltip);
        image.addEventListener('mousemove', showTooltip);
        image.addEventListener('mouseout', hideTooltip);
    });
}

// Ensure the script initializes on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeImages();
});


