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

// Initialize amplitude
!(function () {
    'use strict';
    !(function (e, t) {
        var n = e.amplitude || { _q: [], _iq: {} };
        if (n.invoked)
            e.console &&
                console.error &&
                console.error('Amplitude snippet has been loaded.');
        else {
            var r = function (e, t) {
                    e.prototype[t] = function () {
                        return (
                            this._q.push({
                                name: t,
                                args: Array.prototype.slice.call(arguments, 0),
                            }),
                            this
                        );
                    };
                },
                s = function (e, t, n) {
                    return function (r) {
                        e._q.push({
                            name: t,
                            args: Array.prototype.slice.call(n, 0),
                            resolve: r,
                        });
                    };
                },
                o = function (e, t, n) {
                    e[t] = function () {
                        if (n)
                            return {
                                promise: new Promise(
                                    s(
                                        e,
                                        t,
                                        Array.prototype.slice.call(arguments)
                                    )
                                ),
                            };
                    };
                },
                i = function (e) {
                    for (var t = 0; t < y.length; t++) o(e, y[t], !1);
                    for (var n = 0; n < g.length; n++) o(e, g[n], !0);
                };
            n.invoked = !0;
            var a = t.createElement('script');
            (a.type = 'text/javascript'),
                (a.crossOrigin = 'anonymous'),
                (a.async = !0),
                (a.src =
                    'https://cdn.nav.no/team-researchops/amplitudeNavSdk.js.gz'),
                (a.onload = function () {
                    e.amplitude.runQueuedFunctions ||
                        console.log('[Amplitude] Error: could not load SDK');
                });
            var c = t.getElementsByTagName('script')[0];
            c.parentNode.insertBefore(a, c);
            for (
                var u = function () {
                        return (this._q = []), this;
                    },
                    l = [
                        'add',
                        'append',
                        'clearAll',
                        'prepend',
                        'set',
                        'setOnce',
                        'unset',
                        'preInsert',
                        'postInsert',
                        'remove',
                        'getUserProperties',
                    ],
                    p = 0;
                p < l.length;
                p++
            )
                r(u, l[p]);
            n.Identify = u;
            for (
                var d = function () {
                        return (this._q = []), this;
                    },
                    f = [
                        'getEventProperties',
                        'setProductId',
                        'setQuantity',
                        'setPrice',
                        'setRevenue',
                        'setRevenueType',
                        'setEventProperties',
                    ],
                    v = 0;
                v < f.length;
                v++
            )
                r(d, f[v]);
            n.Revenue = d;
            var y = [
                    'getDeviceId',
                    'setDeviceId',
                    'getSessionId',
                    'setSessionId',
                    'getUserId',
                    'setUserId',
                    'setOptOut',
                    'setTransport',
                    'reset',
                ],
                g = [
                    'init',
                    'add',
                    'remove',
                    'track',
                    'logEvent',
                    'identify',
                    'groupIdentify',
                    'setGroup',
                    'revenue',
                    'flush',
                ];
            i(n),
                (n.createInstance = function (e) {
                    return (n._iq[e] = { _q: [] }), i(n._iq[e]), n._iq[e];
                }),
                (e.amplitude = n);
        }
    })(window, document);

    if (amplitude?.init) {
        amplitude.init('9b5cd472eadd825603ba5109d81e30cb', null, {
            serverZone: 'EU',
            defaultTracking: true,
        });
    } else {
        console.error(`Amplitude init function does not exist!`);
    }
})();
