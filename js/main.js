// =======================
// Job Card and Modal Generator
// =======================

// Function to fetch data and render
const fetchDataAndRender = async (filePath, renderFunction, callback) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error while loading the JSON file: ${filePath}`);
        }
        const data = await response.json();
        renderFunction(data);
        if (typeof callback === 'function') {
            callback();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to check if rendering is complete and initialize modals
const checkRenderComplete = () => {
    if (jobsRendered && skillsRendered) {
        initializeModals();
    }
};

// Function to render cards and modals
const renderCardsAndModals = (data, containerId, createCardFunction, createModalFunction) => {
    if (document.getElementById(containerId)) {
        const container = document.getElementById(containerId);

        let html = '';

        data.forEach((item, index) => {
            const card = createCardFunction(item, index);
            const modal = createModalFunction(item, index);
            html += card + modal;
        });
    
        container.innerHTML = html;
    } else {
        return;
    }
};

// Function to create job card
const createJobCard = (job, index) => {
    const { company, title, type, duration, date, description, tasks } = job;
    return `
        <div class="experience-card">
            <div class="upper">
                <h3>${title}</h3>
                <h5>${type} ${duration ? `| ${duration}` : ''}</h5>
                <span><i class="fa-regular fa-calendar"></i> ${date}</span>
            </div>
            <div class="hr"></div>
            ${company ? `<h4><label>${company}</label></h4>` : ''}
            <p>${description}</p>
            ${tasks && tasks.length > 0 ? `<div class="experience-learn-more-btn" data-modal-target="job${index}">Mehr erfahren <i class="fas fa-long-arrow-alt-right"></i></div>` : ''}
        </div>
    `;
};

// Function to create job modal
const createJobModal = (job, index) => {
    const { company, title, type, duration, description, tasks } = job;
    if (!company) return '';

    return `
        <div class="experience-modal flex-center" data-modal-id="job${index}">
            <div class="experience-modal-body">
                <i class="fas fa-rectangle-xmark experience-modal-close-btn"></i>
                <h3>${company}</h3>
                <h4>${title} | ${type} | ${duration}</h4>
                <div class="hr"></div>
                <p><b>Beschreibung:</b> ${description}</p>
                <div class="hr"></div>
                <h4>Aufgaben</h4>
                <ul>
                    ${tasks.map(task => `<li><i class="fas fa-check-circle"></i> ${task}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
};

// Function to create skill card
const createSkillCard = (skill, index) => {
    const { icon, title, description } = skill;
    return `
        <div class="experience-card">
            <div class="upper">
                <h3>${icon} ${title}</h3>
            </div>
            <div class="hr"></div>
            <p>${description}</p>
            <div class="experience-learn-more-btn" data-modal-target="skill${index}">Mehr erfahren <i class="fas fa-long-arrow-alt-right"></i></div>
        </div>
    `;
};

// Function to create skill modal
const createSkillModal = (skill, index) => {
    const { icon, title, details } = skill;
    return `
        <div class="experience-modal flex-center" data-modal-id="skill${index}">
            <div class="experience-modal-body">
                <i class="fas fa-rectangle-xmark experience-modal-close-btn"></i>
                <h3>${icon} ${title}</h3>
                ${Object.entries(details).map(([category, items]) => `
                <h4>${category}</h4>
                <div class="hr"></div>
                <ul>
                    ${items.map(item => `
                        <li><i class="fas fa-check-circle"></i> <b>${item.type}:</b> ${item.description}</li>
                    `).join('')}
                </ul>
            `).join('')}
            </div>
        </div>
    `;
};

// Function to render job cards and modals
const renderJobCardsAndModals = (jobsData) => {
    renderCardsAndModals(jobsData.jobs, 'jobs-container', createJobCard, createJobModal);
};

// Function to render skill cards and modals
const renderSkillCardsAndModals = (skillsData) => {
    renderCardsAndModals(skillsData.skills, 'skills-container', createSkillCard, createSkillModal);
};

// Fetch and render job data
const jobsDataFilePath = '/api/jobsData.json';
let jobsRendered = false;
fetchDataAndRender(jobsDataFilePath, renderJobCardsAndModals, () => {
    jobsRendered = true;
    checkRenderComplete();
});

// Fetch and render skill data
const skillsDataFilePath = '/api/skillsData.json';
let skillsRendered = false;
fetchDataAndRender(skillsDataFilePath, renderSkillCardsAndModals, () => {
    skillsRendered = true;
    checkRenderComplete();
});


// =======================
// Experience section Modal
// =======================

function initializeModals() {
    // Selecting modal elements
    const experienceModals = document.querySelectorAll(".experience-modal");
    const experienceLearnMoreBtns = document.querySelectorAll(".experience-learn-more-btn");
    const experienceModalCloseBtns = document.querySelectorAll(".experience-modal-close-btn");

    // Function to open modal
    const openModal = (modal) => {
        modal.classList.add("active");
        document.body.style.overflow = 'hidden';
    };

    // Function to close modal
    const closeModal = () => {
        experienceModals.forEach((modalView) => {
            modalView.classList.remove("active");
        });
        document.body.style.overflow = '';
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

    openModalFromUrl();

    // Event listener for keydown event (e.g., Escape key press)
    window.addEventListener("keydown", closeOnEscape);
}


// =======================
// Sticky navigation
// =======================

window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});


// =======================
// Calculate age
// =======================

const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);

if (document.getElementById("age")) {
    document.getElementById("age").innerText = getAge('1999-08-03');
}


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