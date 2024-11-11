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
 
    initializeModal();
    console.log("Script loaded successfully");
});


// Modal Initialization and Functionality
function initializeModal() {
    const modal = document.getElementById("contactModal");
    const closeBtn = document.querySelector(".mclose");
    const bookUsButton = document.getElementById("bookbook");
    const bookAppointmentButton = document.getElementById("bookAppointmentButton");
    const writeReviewButton = document.getElementById("writeReviewButton");
    const subjectDropdown = document.getElementById("subject");

    function toggleFields() {
        if (subjectDropdown.value === "review") {
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
            subjectDropdown.value = "review";
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
    bookAppointmentButton.addEventListener("click", openModal);
    writeReviewButton.addEventListener("click", () => openModal(false));
    

    // Close modal when clicking close button
    closeBtn.addEventListener("click", closeModal);

    // Close modal when clicking outside the content
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}

// About Me Carousel Functionality
let aboutCurrentIndex = 0; // Start with the first image

function aboutShowSlide(index) {
    const slides = document.querySelectorAll('.about-carousel-slide');
    const track = document.querySelector('.about-carousel-track');
    const slideWidth = slides[0].clientWidth;

    // Calculate the number of slides visible based on screen width
    const visibleSlides = window.innerWidth < 768 ? 1 : 3;

    // Ensure index is within bounds
    if (index < 0) {
        aboutCurrentIndex = 0; // Stay at the first slide
    } else if (index >= slides.length - visibleSlides) { // Account for visible slides
        aboutCurrentIndex = slides.length - visibleSlides; // Stay at the last set of slides
    } else {
        aboutCurrentIndex = index; // Set to the provided index
    }

    // Move the track to show the current slide
    track.style.transform = `translateX(-${slideWidth * aboutCurrentIndex}px)`;
}

function aboutPrevSlide() {
    if (aboutCurrentIndex > 0) { // Only move left if not at the start
        aboutShowSlide(aboutCurrentIndex - 1);
    }
}

function aboutNextSlide() {
    const slides = document.querySelectorAll('.about-carousel-slide');
    const visibleSlides = window.innerWidth < 768 ? 1 : 3;
    if (aboutCurrentIndex < slides.length - visibleSlides) { // Only move right if not at the end
        aboutShowSlide(aboutCurrentIndex + 1);
    }
}

// Event listeners for navigation buttons
document.querySelector('.about-carousel-prev').addEventListener('click', aboutPrevSlide);
document.querySelector('.about-carousel-next').addEventListener('click', aboutNextSlide);

// Optional: Automatically cycle through slides every 5 seconds
setInterval(() => {
    const slides = document.querySelectorAll('.about-carousel-slide');
    const visibleSlides = window.innerWidth < 768 ? 1 : 3;
    if (aboutCurrentIndex < slides.length - visibleSlides) { // Only advance if not on the last set of slides
        aboutNextSlide();
    } else {
        aboutShowSlide(0); // Reset to the first slide when reaching the end
    }
}, 5000); // Change slide every 5 seconds

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
    // Reinitialize slide width and visibility on window resize
    window.addEventListener('resize', () => aboutShowSlide(aboutCurrentIndex));
});
