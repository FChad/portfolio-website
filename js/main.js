
//Sticky navigation
window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
});


//Experience section Modal
const experienceModals = document.querySelectorAll(".experience-modal");
const experienceLearnMoreBtns = document.querySelectorAll(".experience-learn-more-btn");
const experienceModalCloseBtns = document.querySelectorAll(".experience-modal-close-btn");

var modal = function (modalClick) {
    experienceModals[modalClick].classList.add("active");
}

experienceLearnMoreBtns.forEach((learnmoreBtn, i) => {
    learnmoreBtn.addEventListener("click", () => {
        modal(i);
    });
});

experienceModalCloseBtns.forEach((modalCloseBtn) => {
    modalCloseBtn.addEventListener("click", () => {
        experienceModals.forEach((modalView) => {
            modalView.classList.remove("active");
        });
    });
});


//Calculate age
const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);

document.getElementById("age").innerText = getAge('1999-08-03');


// Project Content Switch
const projectDescriptionBtns = document.querySelectorAll(".project-description-btn");
const projectImplementationBtns = document.querySelectorAll(".project-implementation-btn");
const projectSoftwareBtns = document.querySelectorAll(".project-software-btn");

const projectDescription = document.querySelectorAll(".project-description");
const projectImplementation = document.querySelectorAll(".project-implementation");
const projectSoftware = document.querySelectorAll(".project-software");

projectDescriptionBtns.forEach((projectDescriptionBtn, i) => {
    projectDescriptionBtn.addEventListener("click", () => {
        projectDescriptionBtn.classList.add("active");
        projectDescription[i].classList.add("show");

        projectImplementation[i].classList.remove("show");
        projectSoftware[i].classList.remove("show");

        projectImplementationBtns[i].classList.remove("active");
        projectSoftwareBtns[i].classList.remove("active");
    });
});

projectImplementationBtns.forEach((projectImplementationBtn, i) => {
    projectImplementationBtn.addEventListener("click", () => {
        projectImplementationBtn.classList.add("active");
        projectImplementation[i].classList.add("show");

        projectDescription[i].classList.remove("show");
        projectSoftware[i].classList.remove("show");

        projectDescriptionBtns[i].classList.remove("active");
        projectSoftwareBtns[i].classList.remove("active");
    });
});

projectSoftwareBtns.forEach((projectSoftwareBtn, i) => {
    projectSoftwareBtn.addEventListener("click", () => {
        projectSoftwareBtn.classList.add("active");
        projectSoftware[i].classList.add("show");

        projectDescription[i].classList.remove("show");
        projectImplementation[i].classList.remove("show");

        projectDescriptionBtns[i].classList.remove("active");
        projectImplementationBtns[i].classList.remove("active");
    });
});


//Website dark/Light theme
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




//Scroll to top button
const scrollTopBtn = document.querySelector(".scrollToTop-btn");

window.addEventListener("scroll", function () {
    scrollTopBtn.classList.toggle("active", window.scrollY > 500);
});

scrollTopBtn.addEventListener("click", () => {
    document.body.scrol1Top = 0;
    document.documentElement.scrollTop = 0;
});



//Navigation menu items active on page scroll
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

//Responsive navigation menu toggle
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


// Close all modals with "Escape"
window.addEventListener("keydown", function (event) {
    if (event.key === 'Escape') {
        // Close navigation modals
        navigation.classList.remove("active");

        // Close experience modals
        experienceModals.forEach((modalView) => {
            modalView.classList.remove("active");
        });
    }
});