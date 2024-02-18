// =======================
// Sticky navigation
// =======================

window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});


// =======================
// Experience section Modal
// =======================

// Selecting modal elements
const experienceModals = document.querySelectorAll(".experience-modal");
const experienceLearnMoreBtns = document.querySelectorAll(".experience-learn-more-btn");
const experienceModalCloseBtns = document.querySelectorAll(".experience-modal-close-btn");

// Function to open modal
const openModal = (modal) => {
    modal.classList.add("active");
};

// Function to close modal
const closeModal = () => {
    experienceModals.forEach((modalView) => {
        modalView.classList.remove("active");
    });
};

// Function to close modal when Escape key is pressed
const closeOnEscape = (event) => {
    if (event.key === "Escape") {
        closeModal();
        updateUrlParam(null);
    }
};

// Function to update URL with modal ID
const updateUrlParam = (modalId) => {
    const url = new URL(window.location.href);
    if (modalId) {
        url.searchParams.set("modal", modalId);
    } else {
        url.searchParams.delete("modal");
    }
    history.pushState(null, null, url);
};

// Function to open modal based on URL parameter
const openModalFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modalId = urlParams.get('modal');
    if (modalId) {
        const modal = document.querySelector(`[data-modal-id="${modalId}"]`);
        if (modal) {
            openModal(modal);
        }
    } else {
        closeModal();
    }
};

// Event listeners for clicking "Learn More" buttons
experienceLearnMoreBtns.forEach((learnmoreBtn) => {
    learnmoreBtn.addEventListener("click", () => {
        const modalTarget = learnmoreBtn.getAttribute("data-modal-target");
        const modal = document.querySelector(`[data-modal-id="${modalTarget}"]`);
        if (modal) {
            openModal(modal);
            updateUrlParam(modal.getAttribute("data-modal-id"));
        } else {
            console.error(`Modal with ID "${modalTarget}" not found.`);
        }
    });
});

// Event listeners for clicking modal close buttons
experienceModalCloseBtns.forEach((modalCloseBtn) => {
    modalCloseBtn.addEventListener("click", () => {
        closeModal();
        updateUrlParam(null);
    });
});

// Event listener for popstate event (e.g., back button press)
window.addEventListener("popstate", () => {
    openModalFromUrl();
});

// Event listener for DOMContentLoaded event (page load)
window.addEventListener("DOMContentLoaded", () => {
    openModalFromUrl();
});

// Event listener for keydown event (e.g., Escape key press)
window.addEventListener("keydown", closeOnEscape);


// =======================
// Calculate age
// =======================

const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);

document.getElementById("age").innerText = getAge('1999-08-03');


// =======================
// Website dark/Light theme
// =======================

const themeBtn = document.querySelector(".theme-btn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    themeBtn.classList.toggle("sun");

    localStorage.setItem("saved-theme", getCurrentTheme());
    localStorage.setItem("saved-icon", getCurrentIcon());
});

const getCurrentTheme = () => document.body.classList.contains("dark-theme") ? "dark" : "light";
const getCurrentIcon = () => themeBtn.classList.contains("sun") ? "sun" : "moon";

const savedTheme = localStorage.getItem("saved-theme");
const savedIcon = localStorage.getItem("saved-icon");

if (savedTheme) {
    document.body.classList[savedTheme === "dark" ? "add" : "remove"]("dark-theme");
    themeBtn.classList[savedIcon === "sun" ? "add" : "remove"]("sun");
} else {
    // Browser Dark-Mode detection
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark-theme");
        themeBtn.classList.add("sun");
    }
}


// =======================
// Scroll to top button
// =======================

const scrollTopBtn = document.querySelector(".scrollToTop-btn");

window.addEventListener("scroll", function () {
    scrollTopBtn.classList.toggle("active", window.scrollY > 500);
});

scrollTopBtn.addEventListener("click", () => {
    document.body.scrol1Top = 0;
    document.documentElement.scrollTop = 0;
});


// =======================
// Navigation menu items active on page scroll
// =======================

window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const scrollY = window.pageYOffset;


    sections.forEach(current => {
        let sectionHeight = current.offsetHeight;
        let sectionTop = current.offsetTop - 50;
        let id = current.getAttribute("id");
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(".nav-items a[href*=" + id + "]").classList.add("active");
        } else {
            document.querySelector(".nav-items a[href*=" + id + "]").classList.remove("active");
        }
    });
});


// =======================
// Responsive navigation menu toggle
// =======================

const menuBtn = document.querySelector(".nav-menu-btn");
const closeBtn = document.querySelector(".nav-close-btn");
const navigation = document.querySelector(".navigation");
const navItems = document.querySelectorAll(".nav-items a");


menuBtn.addEventListener("click", () => {
    navigation.classList.add("active");
});

closeBtn.addEventListener("click", () => {
    navigation.classList.remove("active");
});

navItems.forEach((navItem) => {
    navItem.addEventListener("click", () => {
        navigation.classList.remove("active");
    });
});

// Close navigation menu with "Escape" key
window.addEventListener("keydown", (event) => {
    if (event.key === 'Escape' && navigation.classList.contains("active")) {
        navigation.classList.remove("active");
    }
});