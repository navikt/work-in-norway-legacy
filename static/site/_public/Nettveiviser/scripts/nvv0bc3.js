$(document).ready(function () {
    dropDownShortcuts();
});

function scrollToMain(e) {
    if (e) {
        e.preventDefault();
    }
    const mainContent = document.getElementById('maincontent');
    if (mainContent) {
        mainContent.focus();
    }
}

function dropDownShortcuts() {
    if ($('.dropdown-1')) {
        doDynamicWidth();

        $('.dropdown-1').mouseleave(function (e) {
            e.preventDefault();

            $('.dropdown-1').slideToggle();
        });

        $('.dropdown-area').click(function (e) {
            e.preventDefault();

            $('.dropdown-1').slideToggle();
        });

        $(document).mouseup(function (e) {
            var container = $('.dropdown-1');

            if (container.has(e.target).length == 0) {
                container.slideUp();
            }
        });
    }
}

function doDynamicWidth() {
    var width = $('.dropdown-area').width();

    $('.dropdown-1').css('width', width);
}

/**
 * Funksjonalitet for å scrolle til innholdselementet
 * når bruker kommer til en side på mobil. Laget i sammenheng
 * med at sidene ble gjort om til å være responsive.
 */

(function () {
    var BREAKPOINT = 1030; // Breakpoint som brukes i css
    var scrollToElementId = 'js-scroll-innholdContainer';
    var forsideNorsk = '/no/Forside';
    var forsideEngelsk = '/en/Home';

    function brukerKommerFraEnUnderside() {
        return (
            document.referrer.indexOf(forsideNorsk) === -1 &&
            document.referrer.indexOf(forsideEngelsk) === -1
        );
    }

    document.addEventListener('DOMContentLoaded', function (event) {
        // Scroll til innholdet dersom det er responsiv visning og
        // bruker ikke kommer fra en underside. Når bruker kommer fra en forside
        // er det greit å vise menyen først.

        if (window.innerWidth <= BREAKPOINT && brukerKommerFraEnUnderside()) {
            content = document.getElementById(scrollToElementId);
            if (content && content.getBoundingClientRect) {
                setTimeout(function () {
                    pos = content.getBoundingClientRect();
                    window.scrollTo(0, pos.top + window.scrollY - 30);
                }, 10);
            }
        }
    });
})();
