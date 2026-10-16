// Coders Farm site script. Plain JavaScript on top of the template's js/main.js, which stays untouched.
// Loaded in <head> without defer: the landing-link code has to run before the browser jumps to #section.
(function () {
    'use strict';

    var LANDING_SCROLL_DELAY_MS = 700;
    var landingHash = '';

    // Landing links (codersfarm.org/#domovoi): hold the browser's instant jump, then scroll there
    // after the page loads, the same way a click on the section's own button does.
    try {
        if (location.hash.length > 1) {
            landingHash = location.hash;
            history.replaceState(null, '', location.pathname + location.search);
        }
        if ('scrollRestoration' in history && landingHash) {
            history.scrollRestoration = 'manual';
        }
    } catch (error) {
        landingHash = '';
    }

    function getHeaderHeight() {
        var navbar = document.querySelector('header nav.navbar');
        return navbar ? navbar.offsetHeight : 0;
    }

    function findSection(hash) {
        try {
            return document.querySelector(hash);
        } catch (error) {
            return null;
        }
    }

    // Smooth scroll that stops just under the sticky header. The template's own .section-link
    // scroller lands short on this page, so links to our sections use .smooth-link instead.
    function scrollToSection(target) {
        var top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderHeight();
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    }

    function setupSmoothLinks() {
        document.addEventListener('click', function (event) {
            var link = event.target.closest ? event.target.closest('a.smooth-link') : null;
            if (!link) {
                return;
            }
            var hash = link.getAttribute('href');
            var target = hash && hash.charAt(0) === '#' ? findSection(hash) : null;
            if (!target) {
                return;
            }
            event.preventDefault();
            scrollToSection(target);
            history.replaceState(null, '', location.pathname + location.search + hash);
        });
    }

    function scrollToLandingSection(hash) {
        history.replaceState(null, '', location.pathname + location.search + hash);
        var target = findSection(hash);
        if (target) {
            scrollToSection(target);
        }
    }

    // Template buttons swap their label for data-text on hover. Size each label to fit the longer of
    // the two, so the hover text never runs over the button's icon or arrow.
    function fitSwitchButtonLabels() {
        var labels = document.querySelectorAll('.btn-switch-text .btn-double-text[data-text]');
        Array.prototype.forEach.call(labels, function (label) {
            var probe = document.createElement('span');
            probe.textContent = label.getAttribute('data-text');
            probe.style.position = 'absolute';
            probe.style.visibility = 'hidden';
            probe.style.whiteSpace = 'nowrap';
            label.appendChild(probe);
            var hoverTextWidth = probe.offsetWidth;
            label.removeChild(probe);
            if (hoverTextWidth > label.offsetWidth) {
                label.style.minWidth = Math.ceil(hoverTextWidth) + 'px';
                label.style.textAlign = 'center';
            }
        });
    }

    // Older browsers, and some embedded ones, block navigator.clipboard; a selected textarea still copies.
    function copyTextWithTextarea(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        var copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (error) {
            copied = false;
        }
        document.body.removeChild(textarea);
        return copied ? Promise.resolve() : Promise.reject(new Error('copy blocked'));
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).catch(function () {
                return copyTextWithTextarea(text);
            });
        }
        return copyTextWithTextarea(text);
    }

    function showCopyStatus(button, message) {
        button.setAttribute('data-copy-status', message);
        button.classList.add('copied');
        setTimeout(function () {
            button.classList.remove('copied');
        }, 2000);
    }

    // Copy-link buttons: <a href="#domovoi" data-copy-link>. Copies the full address of that section,
    // and puts it in the address bar too.
    function setupCopyLinks() {
        var buttons = document.querySelectorAll('[data-copy-link]');
        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                var hash = button.getAttribute('href');
                var url = location.origin + location.pathname + hash;
                history.replaceState(null, '', location.pathname + location.search + hash);
                copyText(url).then(function () {
                    showCopyStatus(button, 'Link copied');
                }, function () {
                    showCopyStatus(button, 'Link is in the address bar');
                });
            });
        });
    }

    window.addEventListener('load', function () {
        var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        fontsReady.then(fitSwitchButtonLabels);
        setupSmoothLinks();
        setupCopyLinks();
        if (landingHash) {
            setTimeout(function () {
                scrollToLandingSection(landingHash);
            }, LANDING_SCROLL_DELAY_MS);
        }
    });
})();
