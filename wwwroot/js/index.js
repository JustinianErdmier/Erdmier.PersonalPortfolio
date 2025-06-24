$(document).ready(() => {
    setYearsOfExperienceStat();
});

$(window).scroll(() => {
    const scrolledClass = 'header--scrolled';
    const header = $('#site-header');
    let scroll = $(window).scrollTop();

    if (scroll >= 100) header.addClass(scrolledClass); else header.removeClass(scrolledClass);
});

/**
 * Opens a specified modal by element id.
 *
 * @param modalId
 * @return {void} This function does not return a value.
 */
function openModal(modalId) {
    $('#' + modalId).show();
}

/**
 * Closes a specified modal by element id.
 *
 * @param modalId
 * @return {void} This function does not return a value.
 */
function closeModal(modalId) {
    $('#' + modalId).hide();
}

/**
 * Sets the navigation button with the specified ID as active by applying the active CSS class.
 * Removes the active CSS class from the currently active navigation button.
 *
 * @param {string} buttonId - The ID of the navigation button to be set as active.
 * @return {void} This function does not return a value.
 */
function setNavButtonAsActive(buttonId) {
    const navItemClass = 'nav__item';
    const activeClass = 'nav__item--active';

    $('.' + navItemClass + '.' + activeClass).removeClass(activeClass);

    $('#' + buttonId).addClass(activeClass);
}

/**
 * Updates the years of experience statistic by calculating the difference between the current year
 * and the starting year, then sets the text of the corresponding HTML element.
 *
 * @return {void} This function does not return a value.
 */
function setYearsOfExperienceStat() {
    const yearsOfExperienceStatElement = $('#years-of-experience-stat');
    const startingYear = 2021;
    const currentYear = new Date().getFullYear();

    const yearsOfExperience = currentYear - startingYear;

    yearsOfExperienceStatElement.text(yearsOfExperience);
}