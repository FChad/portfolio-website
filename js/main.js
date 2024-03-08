
// =======================
// Card and Modal Generator
// =======================

const skillsData = 'skills';
const jobsData = 'jobs';
const otherSkillsData = 'otherSkills';

const renderFlags = {
    skills: false,
    jobs: false,
    otherSkills: false
};

// Function to fetch data and render
const fetchDataAndRender = async (name, renderFunction, callback) => {
    try {
        let data;

        const filePath = "/api/" + name + "Data.json"
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error while loading the JSON file: ${filePath}`);
        }
        
        data = await response.json();
        data = data[name];

        renderFunction(data);
        renderFlags[name] = true;

        if (typeof callback === 'function') {
            callback();
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Function to check if rendering is complete and initialize modals
const checkRenderComplete = () => {
    if (Object.values(renderFlags).every(flag => flag)) {
        initializeItemShowMoreBtns();
        initializeModals();
    }
};

// Function to render cards and modals
const renderCardsAndModals = (data, containerId, createCardFunction, createModalFunction) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    data.forEach((item, index) => {
        if (createCardFunction) {
            const card = createCardFunction(item, index);
            html += card;
        }
        if (createModalFunction) {
            const modal = createModalFunction(item, index);
            html += modal;
        }
    });

    container.innerHTML = html;
};



// Function to create SkillCard
const createSkillCard = (skill) => {
    const { title, icon, educations, languages, certifications } = skill;
    const maxToShow = 4;

    if (educations) {
        return `<div class="education">
        <h4><label>${icon} ${title}</label></h4>
        <ul class="edu-list">
            ${educations.map((education, index) => `
            <li class="item ${index >= maxToShow ? 'hide' : ''}">
                <span class="year"><i class="fa-regular fa-calendar"></i> ${education.year}</span>
                ${education.link ? `<a href="${education.link}" target="_blank" rel="noreferrer" title="${education.qualification} im ${education.institution}">
                    <i class="fa-solid fa-up-right-from-square"></i>
                </a>` : ''}
                <p>
                    <span>${education.qualification}</span>
                    ${education.specialization ? `<br>Fachrichtung: ${education.specialization}` : ''}
                    ${education.details ? `<br>${education.details}` : ''}
                    ${education.institution ? `<br>im ${education.institution}` : ''}
                    ${education.location ? `in ${education.location}` : ''}
                </p>
            </li>
            `).join('')}
        </ul>
        ${educations.length > maxToShow ? '<div class="item-show-more-btn">Mehr anzeigen<br><i class="fas fa-long-arrow-alt-down"></i></div> <div class="item-show-less-btn"><i class="fas fa-long-arrow-alt-up"></i><br>Weniger anzeigen</div>' : ''}
        </div>
    `;
    } else if (languages) {
        return `<div class="education">
        <h4><label>${icon} ${title}</label></h4>
        <ul class="edu-list">
            ${languages.map((language, index) => `
            <li class="bar ${index >= maxToShow ? 'hide' : ''}">
                <div class="info">
                    <img src="${language.flag}" alt="${language.description}">
                    <span>${language.name}</span>
                    <span>${language.level}</span>
                </div>
                <div class="line" style="--percentage: ${language.line}%;"></div>
            </li>
            `).join('')}
        </ul>
        ${languages.length > maxToShow ? '<div class="item-show-more-btn">Mehr anzeigen<br><i class="fas fa-long-arrow-alt-down"></i></div> <div class="item-show-less-btn"><i class="fas fa-long-arrow-alt-up"></i><br>Weniger anzeigen</div>' : ''}
        </div>
    `;
    } else if (certifications) {
        return `<div class="education">
        <h4><label>${icon} ${title}</label></h4>
        <ul class="edu-list">
            ${certifications.map((certification, index) => `
            <li class="item ${index >= maxToShow ? 'hide' : ''}">
                <span class="year"><i class="fa-regular fa-calendar"></i> ${certification.year}</span>
                <a href="${certification.link}" target="_blank" rel="noreferrer" title="${certification.name}">
                    <i class="fa-solid fa-up-right-from-square"></i>
                </a>
                <p>
                    <span>
                        <i class="fa-solid fa-file-circle-check"></i> ${certification.name}
                    </span>
                    <br>${certification.description}
                </p>
            </li>
            `).join('')}
        </ul>
        ${certifications.length > maxToShow ? '<div class="item-show-more-btn">Mehr anzeigen<br><i class="fas fa-long-arrow-alt-down"></i></div> <div class="item-show-less-btn"><i class="fas fa-long-arrow-alt-up"></i><br>Weniger anzeigen</div>' : ''}
        </div>
    `;
    }
};

// Function to create job card
const createJobCard = (job, index) => {
    const { company, title, type, duration, date, description, tasks, createModal } = job;
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
            ${createModal ? `<div class="experience-learn-more-btn" data-modal-target="job${index}">Mehr erfahren <i class="fas fa-long-arrow-alt-right"></i></div>` : ''}
        </div>
    `;
};

// Function to create job modal
const createJobModal = (job, index) => {
    const { company, title, type, duration, description, tasks, createModal } = job;
    if (!createModal) return '';

    return `
        <div class="experience-modal flex-center" data-modal-id="job${index}">
            <div class="experience-modal-body">
                <div class="experience-modal-btns">
                    <i class="fa-solid fa-square-share-nodes experience-modal-share-btn" title="Link kopieren"></i>
                    <i class="fa-solid fa-square-xmark experience-modal-close-btn" title="Schließen"></i>
                </div>
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

// Function to create otherSkillCard
const createOtherSkillCard = (otherSkill, index) => {
    const { icon, title, description, createModal } = otherSkill;
    return `
        <div class="experience-card">
            <div class="upper">
                <h3>${icon} ${title}</h3>
            </div>
            <div class="hr"></div>
            <p>${description}</p>
            ${createModal ? `<div class="experience-learn-more-btn" data-modal-target="otherSkill${index}">Mehr erfahren <i class="fas fa-long-arrow-alt-right"></i></div>` : ''}
        </div>
    `;
};

// Function to create skill modal
const createOtherSkillModal = (otherSkill, index) => {
    const { icon, title, details, createModal } = otherSkill;
    if (!createModal) return '';

    return `
        <div class="experience-modal flex-center" data-modal-id="otherSkill${index}">
            <div class="experience-modal-body">
                <div class="experience-modal-btns">
                    <i class="fa-solid fa-square-share-nodes experience-modal-share-btn" title="Link kopieren"></i>
                    <i class="fa-solid fa-square-xmark experience-modal-close-btn" title="Schließen"></i>
                </div>
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



// Function to render skill cards and modals
const renderSkillCardsAndModals = (skillsData) => {
    renderCardsAndModals(skillsData, 'skills-container', createSkillCard, null);
};

// Function to render job cards and modals
const renderJobCardsAndModals = (jobsData) => {
    renderCardsAndModals(jobsData, 'jobs-container', createJobCard, createJobModal);
};

// Function to render otherSkill cards and modals
const renderOtherSkillCardsAndModals = (otherSkillsData) => {
    renderCardsAndModals(otherSkillsData, 'other-skills-container', createOtherSkillCard, createOtherSkillModal);
};



fetchDataAndRender(skillsData, renderSkillCardsAndModals, checkRenderComplete);
fetchDataAndRender(jobsData, renderJobCardsAndModals, checkRenderComplete);
fetchDataAndRender(otherSkillsData, renderOtherSkillCardsAndModals, checkRenderComplete);


// =======================
// Experience section Modal
// =======================

function initializeItemShowMoreBtns() {
    document.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('item-show-more-btn')) {
            const parent = target.closest('.education');

            parent.querySelector('.item-show-less-btn').style.display = 'block';

            parent.querySelectorAll('.edu-list .item.hide, .edu-list .bar.hide').forEach(item => {
                item.style.display = 'block';
            });

            target.style.display = 'none';
        } else if (target.classList.contains('item-show-less-btn')) {
            const parent = target.closest('.education');

            parent.querySelector('.item-show-more-btn').style.display = 'block';

            parent.querySelectorAll('.edu-list .item.hide, .edu-list .bar.hide').forEach(item => {
                item.style.display = 'none';
            });

            target.style.display = 'none';
        }
    });
}

function initializeModals() {
    // Selecting modal elements
    const experienceModals = document.querySelectorAll(".experience-modal");
    const experienceLearnMoreBtns = document.querySelectorAll(".experience-learn-more-btn");
    const experienceModalCloseBtns = document.querySelectorAll(".experience-modal-close-btn");
    const experienceModalShareBtn = document.querySelectorAll('.experience-modal-share-btn');

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

    // Event listeners for clicking modal share buttons
    experienceModalShareBtn.forEach((modalShareBtn) => {
        modalShareBtn.addEventListener("click", () => {
            const modalId = modalShareBtn.closest('.experience-modal').getAttribute('data-modal-id');
            const link = `${window.location.protocol}//${window.location.host}/?modal=${modalId}`;

            // Use the newer navigator.clipboard.writeText() API to copy text to clipboard
            navigator.clipboard.writeText(link)
                .then(function () {
                    // Provide feedback to the user that the link has been copied
                    alert("Link kopiert: " + link);
                })
                .catch(function (error) {
                    // Handle any errors that may occur during copying
                    console.error('Fehler beim kopieren des Links: ', error);
                });
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
    /* if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark-theme");
        themeBtn.classList.add("sun");
    } */
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