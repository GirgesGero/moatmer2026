/* 
 * ==========================================
 * 1. بيانات المقاعد (JSON Array)
 * الترقيم التسلسلي: 1 - 49 مقعد
 * ==========================================
 */
let passengers = [
    // === أوتوبيس 1 ===
    { "name": "امير", "bus": 1, "seat": 1, "elementId": "bus1-seat-1" },
    { "name": "ابانوب سويحة", "bus": 1, "seat": 2, "elementId": "bus1-seat-2" },
    { "name": "جرجس", "bus": 1, "seat": 3, "elementId": "bus1-seat-3" },
    { "name": "سامح", "bus": 1, "seat": 4, "elementId": "bus1-seat-4" },
    { "name": "فيلو", "bus": 1, "seat": 5, "elementId": "bus1-seat-5" },
    { "name": "ابانوب", "bus": 1, "seat": 42, "elementId": "bus1-seat-42" },
    // === أوتوبيس 2 ===
    { "name": "مريم", "bus": 2, "seat": 39, "elementId": "bus2-seat-39" }
];

/* 
 * ==========================================
 * 1.5 قراءة التعديلات من localStorage
 * لو تم تعديل الأسماء من صفحة إدارة الركاب
 * يتم استخدام البيانات المعدلة بدلاً من الأصلية
 * ==========================================
 */
(function loadModifiedPassengers() {
    try {
        var savedV3 = localStorage.getItem('conference_passengers_v3');
        if (savedV3) {
            var data = JSON.parse(savedV3);
            if (data.passengers && Array.isArray(data.passengers) && data.passengers.length > 0) {
                passengers = data.passengers.map(function(p) {
                    return {
                        name: p.name,
                        bus: p.bus,
                        seat: p.seat,
                        elementId: 'bus' + p.bus + '-seat-' + p.seat
                    };
                });
                console.log('تم تحميل التعديلات من localStorage:', passengers.length, 'راكب');
                return;
            }
        }
    } catch (e) {
        console.warn('تعذر قراءة التعديلات من localStorage:', e);
    }
})();

/* 
 * ==========================================
 * 2. دالة بناء كراسي الأوتوبيس ديناميكياً
 * ==========================================
 */
function generateBusHTML(busNum) {
    let rowsHtml = '';
    let seatNum = 1;

    // صفوف 1-5
    for (let r = 1; r <= 5; r++) {
        rowsHtml += `<div class="seat seat-col-1" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
        rowsHtml += `<div class="seat seat-col-2" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
        rowsHtml += `<div class="aisle-gap seat-col-3"></div>`;
        rowsHtml += `<div class="seat seat-col-4" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
        rowsHtml += `<div class="seat seat-col-5" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
    }

    // صف 6: باب + 2 مقاعد
    rowsHtml += `<div class="door-indicator">🪜🚪 سلم · باب</div>`;
    rowsHtml += `<div class="empty-space seat-col-2"></div>`;
    rowsHtml += `<div class="aisle-gap seat-col-3"></div>`;
    rowsHtml += `<div class="seat seat-col-4" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;
    rowsHtml += `<div class="seat seat-col-5" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;

    // صف 7
    rowsHtml += `<div class="empty-space seat-col-1"></div>`;
    rowsHtml += `<div class="empty-space seat-col-2"></div>`;
    rowsHtml += `<div class="aisle-gap seat-col-3"></div>`;
    rowsHtml += `<div class="seat seat-col-4" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;
    rowsHtml += `<div class="seat seat-col-5" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;

    // صفوف 8-12
    for (let r = 8; r <= 12; r++) {
        rowsHtml += `<div class="seat seat-col-1" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
        rowsHtml += `<div class="seat seat-col-2" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
        rowsHtml += `<div class="aisle-gap seat-col-3"></div>`;
        rowsHtml += `<div class="seat seat-col-4" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
        rowsHtml += `<div class="seat seat-col-5" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
        seatNum++;
    }

    // صف 13 خلفي
    rowsHtml += `<div class="seat seat-col-1" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;
    rowsHtml += `<div class="seat seat-col-2" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;
    rowsHtml += `<div class="seat seat-col-3 seat-middle" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;
    rowsHtml += `<div class="seat seat-col-4" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;
    rowsHtml += `<div class="seat seat-col-5" id="bus${busNum}-seat-${seatNum}" data-seat="${seatNum}"><div class="seat-number">${seatNum}</div><div class="passenger-name"></div></div>`;
    seatNum++;

    // نوافذ
    let windowsHtml = '';
    for (let w = 1; w <= 10; w++) {
        windowsHtml += `<div class="bus-window"><div class="window-glass"><div class="window-reflection"></div></div><div class="window-frame"></div></div>`;
    }

    return `
    <div class="bus-container" id="bus-${busNum}">
        <div class="bus-headlight-left"></div>
        <div class="bus-headlight-right"></div>
        <div class="bus-mirror-left"><div class="mirror-glass"></div></div>
        <div class="bus-mirror-right"><div class="mirror-glass"></div></div>
        <div class="bus-wheel-front"><div class="wheel-hub"></div></div>
        <div class="bus-wheel-back"><div class="wheel-hub"></div></div>
        <div class="bus-windows-right">${windowsHtml}</div>
        <div class="bus-windows-left">${windowsHtml}</div>
        <div class="bus-header">
            <div class="bus-title">أتوبيس ${busNum} 🚍</div>
            <div class="bus-subtitle">مؤتمر الشباب</div>
        </div>
        <div class="bus-front">
            <div class="front-stairs"><div class="stairs-door-icon">🪜🚪</div><div class="stairs-label">سلم · باب</div></div>
            <div class="front-aisle-space"></div>
            <div class="driver-seat"><div class="steering-wheel"></div><div class="driver-label">سواق</div></div>
        </div>
        <div class="seats-wrapper">
            <div class="seats-grid">${rowsHtml}</div>
        </div>
        <div class="legend d-flex justify-content-center gap-3 mt-3 flex-wrap">
            <div class="legend-item d-flex align-items-center gap-1"><div class="legend-box legend-available"></div><span>فاضي</span></div>
            <div class="legend-item d-flex align-items-center gap-1"><div class="legend-box legend-booked"></div><span>محجوز</span></div>
        </div>
        <div class="bus-stats d-flex justify-content-center gap-3 mt-2 mb-3 flex-wrap">
            <div class="stat-item"><span id="stats-total-${busNum}">49</span> الإجمالي</div>
            <div class="stat-item"><span class="stat-number stat-empty" id="stats-empty-${busNum}">49</span> فاضي</div>
            <div class="stat-item"><span class="stat-number stat-booked" id="stats-booked-${busNum}">0</span> محجوز</div>
        </div>
    </div>`;
}

// رسم الأوتوبيسين
$('#buses-wrapper').html(generateBusHTML(1) + generateBusHTML(2));

// تأخير أنيميشن الأتوبيس الثاني - يتم التحكم من CSS الآن (bus3DEntrance)

// تعبئة البيانات
function populateData() {
    $.each(passengers, function(i, p) {
        const $seat = $('#' + p.elementId);
        if ($seat.length) {
            $seat.addClass('booked');
            $seat.find('.passenger-name').text(p.name);
        }
    });

    let globalTotal = 0, globalBooked = 0;

    [1, 2].forEach(function(busNum) {
        const totalSeats = $(`#bus-${busNum} .seats-wrapper .seat`).length;
        const busPassengers = passengers.filter(p => p.bus === busNum).length;
        $(`#stats-total-${busNum}`).text(totalSeats);
        $(`#stats-booked-${busNum}`).text(busPassengers);
        $(`#stats-empty-${busNum}`).text(totalSeats - busPassengers);
        globalTotal += totalSeats;
        globalBooked += busPassengers;
    });

    $('#global-total').text(globalTotal);
    $('#global-booked').text(globalBooked);
    $('#global-avail').text(globalTotal - globalBooked);
}
populateData();

// أنيميشن العداد للإحصائيات
function animateCounter($element, target) {
    const current = parseInt($element.text()) || 0;
    if (current === target) return;
    $({ count: current }).animate({ count: target }, {
        duration: 800,
        easing: 'swing',
        step: function() {
            $element.text(Math.floor(this.count));
        },
        complete: function() {
            $element.text(target);
        }
    });
}

/* 
 * ==========================================
 * 3. وظائف الواجهة باستخدام jQuery
 * ==========================================
 */

// دالة لمعالجة النصوص العربية
function normalizeArabic(text) {
    return text.replace(/[أإآا]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').toLowerCase();
}

// تفاعل الضغط على الكرسي + hover باللمس للموبايل
let $currentHoveredSeat = null;
let isTouchDevice = false;
let touchMoved = false;

function clearSeatHover() {
    if ($currentHoveredSeat) {
        $currentHoveredSeat.removeClass('hovered');
        $currentHoveredSeat = null;
    }
}

// كشف أجهزة اللمس
$(document).on('touchstart', function() {
    isTouchDevice = true;
}, { once: true });

$(document).on('touchstart', '.seat', function(e) {
    touchMoved = false;
});

$(document).on('touchmove', '.seat', function(e) {
    touchMoved = true;
    // إزالة hover عند التحرك (scroll)
    clearSeatHover();
});

$(document).on('touchend', '.seat', function(e) {
    if (touchMoved) return; // لا تفعل شيء إذا كان scroll
    
    e.preventDefault();
    const $seat = $(this);
    
    // إزالة hover من المقعد السابق
    if ($currentHoveredSeat && $currentHoveredSeat[0] !== $seat[0]) {
        clearSeatHover();
    }
    
    // تبديل hover على المقعد
    if ($seat.hasClass('hovered')) {
        $seat.removeClass('hovered');
        $currentHoveredSeat = null;
    } else {
        $seat.addClass('hovered');
        $currentHoveredSeat = $seat;
    }
});

// على الديسكتوب - إزالة hovered عند إزالة الماوس
$(document).on('mouseleave', '.seat', function() {
    if (!isTouchDevice && $(this).hasClass('hovered')) {
        $(this).removeClass('hovered');
        if ($currentHoveredSeat && $currentHoveredSeat[0] === this) {
            $currentHoveredSeat = null;
        }
    }
});

// إزالة hover عند الضغط على أي مكان آخر (ديسكتوب)
$(document).on('click', function(e) {
    if (!isTouchDevice && !$(e.target).closest('.seat').length) {
        clearSeatHover();
    }
});

// إزالة hover عند اللمس خارج المقاعد (موبايل)
$(document).on('touchstart', function(e) {
    if (!$(e.target).closest('.seat').length && $currentHoveredSeat) {
        clearSeatHover();
    }
});

// ========== نظام Error Handling ==========
let appLoadedSuccessfully = false;

// التحقق من تحميل البيانات بشكل سليم
function verifyAppIntegrity() {
    try {
        // التأكد إن بيانات الركاب موجودة
        if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
            throw new Error('بيانات الركاب مش موجودة');
        }
        // التأكد إن الأوتوبيسات اترسمت
        if ($('#buses-wrapper').children().length === 0) {
            throw new Error('الأوتوبيسات متعملتش');
        }
        // التأكد إن المقاعد موجودة
        if ($('.seat').length === 0) {
            throw new Error('المقاعد مش موجودة');
        }
        // التأكد إن populateData اشتغلت
        const globalBooked = parseInt($('#global-booked').text()) || 0;
        if (globalBooked === 0 && passengers.length > 0) {
            throw new Error('بيانات الركاب متحملتش');
        }
        appLoadedSuccessfully = true;
        return true;
    } catch (error) {
        console.error('خطأ في تحميل التطبيق:', error.message);
        showErrorOverlay(error.message);
        return false;
    }
}

// عرض شاشة الخطأ
function showErrorOverlay(errorMsg) {
    $('#error-overlay').addClass('show');
    $('#main-content').css({ opacity: 0.3, pointerEvents: 'none' });
    console.error('Error Details:', errorMsg);
}

// إخفاء شاشة الخطأ
function hideErrorOverlay() {
    $('#error-overlay').removeClass('show');
    $('#main-content').css({ opacity: 1, pointerEvents: 'auto' });
}

// التحقق من الاتصال بالإنترنت
window.addEventListener('offline', function() {
    showErrorOverlay('فقدت الاتصال بالإنترنت');
});

window.addEventListener('online', function() {
    if (appLoadedSuccessfully) {
        hideErrorOverlay();
    } else {
        location.reload();
    }
});

// خطأ JavaScript عام
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('JS Error:', msg, 'at', url, 'line', lineNo);
    // لو الخطأ حرج نعرض الشاشة
    if (msg && (msg.includes('passengers') || msg.includes('bus') || msg.includes('seat'))) {
        showErrorOverlay(msg);
    }
    return false;
};

// شاشة الترحيب - تم فصلها في welcome.html
// عند فتح صفحة المقاعد مباشرة، نظهر المحتوى ونفتح البحث
$(document).ready(function() {
    // التأكد إن المحتوى ظاهر
    $('#main-content').show();
    
    // التحقق من سلامة التطبيق
    const isHealthy = verifyAppIntegrity();
    
    if (isHealthy) {
        // فتح نافذة البحث تلقائياً مرة واحدة فقط عند أول دخول
        if (!sessionStorage.getItem('search_shown')) {
            setTimeout(function() { 
                if ($('#buses-wrapper').children().length > 0) {
                    openSearchPopup();
                    sessionStorage.setItem('search_shown', 'true');
                }
            }, 800);
        }
    }
});

// Bootstrap Modal للبحث
let searchModal = null;

function openSearchPopup() {
    if (!searchModal) {
        searchModal = new bootstrap.Modal(document.getElementById('search-popup'));
    }
    $('#search-input').val('');
    $('#search-result').html('');
    $('#search-options').removeClass('show').html('');
    searchModal.show();
    setTimeout(function() { $('#search-input').trigger('focus'); }, 300);
}

function closeSearchPopup() {
    if (searchModal) searchModal.hide();
}

// زر البحث في Navbar
$('#nav-search-btn').on('click', function() {
    openSearchPopup();
});

// زر البحث العائم
$('#open-search-btn').on('click', function() {
    openSearchPopup();
});

// تنفيذ البحث
function performSearch() {
    const rawName = $('#search-input').val().trim();
    if (!rawName) return;

    const searchName = normalizeArabic(rawName);
    $('.seat.highlight').removeClass('highlight');

    const found = passengers.filter(p => normalizeArabic(p.name).includes(searchName));

    const $options = $('#search-options');
    const $result = $('#search-result');
    $options.removeClass('show').html('');

    if (found.length === 0) {
        $result.html(`<div class="error-msg">
            <span style="font-size: 1rem;">😅</span><br>
            <strong>مش لاقيين الاسم</strong><br>
            <span style="opacity: 0.8;">جرّب تكتب الاسم كامل أو كلم المسؤول</span>
        </div>`);
        return;
    }

    if (found.length > 1) {
        $result.html(`<div class="choose-msg"><strong>لقيت ${found.length} شخص بنفس الاسم، اختار نفسك:</strong></div>`);
        $.each(found, function(i, p) {
            $options.append(`<div class="search-option-item" data-index="${i}">${p.name} - أتوبيس ${p.bus} مقعد ${p.seat}</div>`);
        });
        $options.addClass('show');

        $options.off('click', '.search-option-item').on('click', '.search-option-item', function() {
            const idx = $(this).data('index');
            $options.removeClass('show').html('');
            showSearchResult(found[idx]);
        });
    } else {
        showSearchResult(found[0]);
    }
}

function showSearchResult(person) {
    // حفظ الشخص الأخير للمشاركة
    lastFoundPerson = person;

    // جملتين ترحيبية عشوائية عشان الرسالة متبقاش مكررة كل مرة
    const warmMessages = [
        ['ربنا يرافقك في كل خطوة ويملا رحلتك بالفرح والسلام 🙏', 'استعد لأيام هتفضل عالقة في قلبك، مع أحلى رفقة وأجمل ذكريات 💙'],
        ['نورت الرحلة يا نجم، وربنا يكون معاك في كل لحظة ✨', 'جهّز نفسك لأيام مليانة بركة وضحك وذكريات ما تتنسيش 💫'],
        ['فرحانين إنك هتكون معانا، ربنا يبارك وجودك 🕊️', 'يلا نستعد لرحلة روحية حلوة، مليانة محبة وسط أحلى إخوات 💙']
    ];
    const msg = warmMessages[Math.floor(Math.random() * warmMessages.length)];

    $('#search-result').html(`<div class="success-msg">
        <span class="emoji">🎉</span>
        <span class="name">أهلاً بيك يا ${person.name}</span>
        <div class="ticket-box">
            <div class="ticket-item">
                <span class="ticket-label">الأتوبيس</span>
                <span class="ticket-value">${person.bus}</span>
            </div>
            <div class="ticket-divider">
                <span class="ticket-dot"></span><span class="ticket-dot"></span><span class="ticket-dot"></span>
            </div>
            <div class="ticket-item">
                <span class="ticket-label">المقعد</span>
                <span class="ticket-value">${person.seat}</span>
            </div>
        </div>
        <div class="welcome-message">
            <p>${msg[0]}</p>
            <p>${msg[1]}</p>
        </div>
        <button class="share-result-btn" onclick="openShareModal(); closeSearchPopup();">
            <i class="bi bi-share-fill me-1"></i>شارك مكانك
        </button>
    </div>`);

    const $seat = $('#' + person.elementId);
    if ($seat.length) {
        // إزالة أي hover سابق
        clearSeatHover();
        // إزالة أي highlight سابق
        $('.seat.highlight').removeClass('highlight');
        $seat.addClass('highlight');
        setTimeout(function() {
            closeSearchPopup();
            $('html, body').animate({ scrollTop: $seat.offset().top - 100 }, 600);
            // إزالة highlight بعد 5 ثواني
            setTimeout(function() {
                $seat.removeClass('highlight');
            }, 5000);
        }, 2000);
    }
}

$('#search-btn').on('click', performSearch);
$('#search-input').on('keypress', function(e) {
    if (e.which === 13) performSearch();
});

// تأثير Navbar عند الـ Scroll فقط (بدون parallax لتجنب تعارض مع أنيميشن الخلفية)
$(window).on('scroll', function() {
    const currentScrollY = window.scrollY;

    // Navbar تأثير عند الـ scroll
    if (currentScrollY > 50) {
        $('.app-navbar').addClass('scrolled');
        $('#nav-top-btn').fadeIn(300);
    } else {
        $('.app-navbar').removeClass('scrolled');
        $('#nav-top-btn').fadeOut(300);
    }
});

// زر العودة لأعلى
$('#nav-top-btn').on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
});

// أنيميشن المقاعد - wave effect حسب الصف
$('.seat').each(function(index) {
    const $seat = $(this);
    const delay = Math.floor(index / 4) * 60 + (index % 4) * 20; // stagger by row then column
    setTimeout(function() {
        $seat.addClass('animate-in');
    }, 300 + delay);
});

const seatsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            $(entry.target).addClass('animate-in');
        }
    });
}, { threshold: 0.1 });

$('.seat').each(function() {
    seatsObserver.observe(this);
});

// ========== نظام تكامل الخرائط ==========
const DESTINATION = {
    name: 'King Land Villa',
    address: 'جمعية أحمد عرابى، العبور، محافظة القاهرة',
    plusCode: '6GMP+W46',
    lat: 30.2219,
    lng: 31.4381,
    placeId: '6GMP+W46 جمعية احمد عرابى العبور',
    departure: 'كنيسة مارمرقس الرسول بالمنشية'
};

// ========== قائمة مسار المؤتمر الجانبية (Slide-out Menu) ==========
let routeMenuOpen = false;
let mapIframeLoaded = false;

function openRouteMenu() {
    routeMenuOpen = true;
    $('#route-menu').addClass('open');
    $('#route-menu-overlay').addClass('show');
    $('#nav-menu-btn').addClass('active');
    document.body.style.overflow = 'hidden'; // منع الـ scroll
}

function closeRouteMenu() {
    routeMenuOpen = false;
    $('#route-menu').removeClass('open');
    $('#route-menu-overlay').removeClass('show');
    $('#nav-menu-btn').removeClass('active');
    document.body.style.overflow = ''; // إعادة الـ scroll
}

// زر Menu في الـ Navbar
$('#nav-menu-btn').on('click', function() {
    if (routeMenuOpen) {
        closeRouteMenu();
    } else {
        openRouteMenu();
    }
});

// زر الإغلاق
$('#route-menu-close').on('click', function() {
    closeRouteMenu();
});

// الضغط على الـ overlay للإغلاق
$('#route-menu-overlay').on('click', function() {
    closeRouteMenu();
});

// زر Escape للإغلاق
$(document).on('keydown', function(e) {
    if (e.key === 'Escape' && routeMenuOpen) {
        closeRouteMenu();
    }
});

// منع إغلاق القائمة عند الضغط داخلها
$('#route-menu').on('click', function(e) {
    e.stopPropagation();
});

// ========== القوائم الفرعية القابلة للتوسيع ==========
// تبديل القسم الفرعي (فتح/إغلاق)
function toggleMenuSection(toggleId, subId, arrowId) {
    const $sub = $('#' + subId);
    const $arrow = $('#' + arrowId);

    if ($sub.hasClass('expanded')) {
        $sub.removeClass('expanded');
        $arrow.removeClass('expanded');
    } else {
        $sub.addClass('expanded');
        $arrow.addClass('expanded');

        // تحميل iframe للخريطة + طلب الموقع الجغرافي عند أول فتح فقط (مش تلقائي عند تحميل الصفحة)
        if (subId === 'map-sub-content' && !mapIframeLoaded) {
            const $iframe = $sub.find('.map-embed iframe');
            if ($iframe.length && $iframe.attr('data-src')) {
                $iframe.attr('src', $iframe.attr('data-src'));
                mapIframeLoaded = true;
            }
            tryGetUserLocation();
        }
    }
}

// قسم الخريطة
$('#menu-map-toggle').on('click', function() {
    toggleMenuSection('menu-map-toggle', 'map-sub-content', 'map-expand-arrow');
});

// قسم الألعاب
$('#menu-games-toggle').on('click', function() {
    toggleMenuSection('menu-games-toggle', 'games-sub-content', 'games-expand-arrow');
});

// إنشاء رابط الاتجاهات الديناميكي
function getDirectionsUrl() {
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const origin = encodeURIComponent(DESTINATION.departure);
    const destination = encodeURIComponent(DESTINATION.name + ', ' + DESTINATION.plusCode + ', ' + DESTINATION.address);
    return baseUrl + '&origin=' + origin + '&destination=' + destination + '&travelmode=driving';
}

// إنشاء رابط الموقع
function getPlaceUrl() {
    return 'https://www.google.com/maps/place/' + encodeURIComponent(DESTINATION.placeId);
}

// تحديث روابط الخريطة ديناميكياً
function initMapLinks() {
    const $navBtn = $('.map-btn-nav');
    const $locBtn = $('.map-btn-loc');
    
    if ($navBtn.length) {
        $navBtn.attr('href', getDirectionsUrl());
    }
    if ($locBtn.length) {
        $locBtn.attr('href', getPlaceUrl());
    }
}
// محاولة الحصول على الموقع الحالي للمستخدم لعرض المسافة
function tryGetUserLocation() {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(function(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // حساب المسافة التقريبية باستخدام قانون هافراين
        const distance = haversineDistance(userLat, userLng, DESTINATION.lat, DESTINATION.lng);
        
        if (distance) {
            const distanceText = distance < 1 ? 
                Math.round(distance * 1000) + ' متر' : 
                distance.toFixed(1) + ' كم';
            
            // إضافة معلومات المسافة داخل القائمة الجانبية
            const $distanceInfo = $(`<div class="map-distance-info">
                <i class="bi bi-geo-alt-fill"></i>
                <span>أنت على بعد ${distanceText} من الوجهة</span>
            </div>`);
            
            $('#route-distance-info').html($distanceInfo);
            
            // تحديث رابط الاتجاهات ليشمل موقع المستخدم الحالي
            const $navBtn = $('.map-btn-nav');
            if ($navBtn.length) {
                const origin = encodeURIComponent(userLat + ',' + userLng);
                const destination = encodeURIComponent(DESTINATION.lat + ',' + DESTINATION.lng);
                const newUrl = 'https://www.google.com/maps/dir/?api=1&origin=' + origin + '&destination=' + destination + '&travelmode=driving';
                $navBtn.attr('href', newUrl);
                $navBtn.html('<i class="bi bi-map me-2"></i>الاتجاهات (' + distanceText + ')');
            }
        }
    }, function() {
        // المستخدم لم يسمح بالوصول للموقع - لا مشكلة
        console.log('لم يتم السماح بالوصول للموقع');
    }, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000
    });
}

// حساب المسافة بين نقطتين (قانون هافراين)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// تهيئة نظام الخرائط
$(document).ready(function() {
    initMapLinks();
    // ملاحظة: tryGetUserLocation() بقت تتنادى بس عند فتح قسم الخريطة (toggleMenuSection)
    // بدل ما تتنادى تلقائي هنا وتظهر popup إذن الموقع فور فتح الصفحة
});

// ========== نظام الأسئلة ==========
function showQuestionModal() {
    $('#question-modal').addClass('show');
    $('#fb-name').trigger('focus');
}

function closeQuestionModal() {
    $('#question-modal').removeClass('show');
}

$('#question-modal').on('click', function(e) {
    if (e.target === this) closeQuestionModal();
});

function checkFormValidity() {
    const isValid = $('#fb-destination').val().trim() !== '' && $('#fb-name').val().trim() !== '';
    $('#fb-submit').prop('disabled', !isValid);
}

$('#fb-destination, #fb-name').on('input', checkFormValidity);

function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'Unknown';
    if (/iPhone/i.test(userAgent)) deviceType = 'iPhone';
    else if (/iPad/i.test(userAgent)) deviceType = 'iPad';
    else if (/Android/i.test(userAgent)) deviceType = /Mobile/i.test(userAgent) ? 'Android Phone' : 'Android Tablet';
    else if (/Windows Phone/i.test(userAgent)) deviceType = 'Windows Phone';
    else if (/Mac/i.test(userAgent)) deviceType = 'Mac';
    else if (/Windows/i.test(userAgent)) deviceType = 'Windows PC';
    else if (/Linux/i.test(userAgent)) deviceType = 'Linux PC';

    let osInfo = 'Unknown OS', browserInfo = 'Unknown Browser';
    if (/Android/i.test(userAgent)) { const v = userAgent.match(/Android\s([\d.]+)/); osInfo = v ? `Android ${v[1]}` : 'Android'; }
    if (/iPhone|iPad/i.test(userAgent)) { const v = userAgent.match(/OS\s([\d_]+)/); osInfo = v ? `iOS ${v[1].replace(/_/g, '.')}` : 'iOS'; }
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) browserInfo = 'Chrome';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browserInfo = 'Safari';
    else if (/Firefox/i.test(userAgent)) browserInfo = 'Firefox';
    else if (/Edge/i.test(userAgent)) browserInfo = 'Edge';

    const now = new Date();
    return { deviceType, os: osInfo, browser: browserInfo, userAgent, time: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }), date: now.toLocaleDateString('ar-EG') };
}

function submitFeedback() {
    const destination = $('#fb-destination').val().trim();
    const name = $('#fb-name').val().trim();

    if (!destination || !name) { alert('لو سمحت كمّل كل البيانات!'); return; }

    const deviceInfo = getDeviceInfo();
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfw4IwP36zSLoYRO5k5YKCkC7BMcnxmr3emWVtMZr-QDF52Fw/formResponse';

    $.ajax({
        url: formUrl,
        method: 'POST',
        data: {
            'entry.216982914': destination,
            'entry.1430254715': name,
            'entry.2017420717': `${deviceInfo.date} ${deviceInfo.time}`,
            'entry.661154536': `${deviceInfo.deviceType} - ${deviceInfo.os} - ${deviceInfo.browser}`
        },
        dataType: 'xml',
        crossDomain: true
    }).always(function() {
        showSuccessCelebration();
        $('#fb-destination').val('');
        $('#fb-name').val('');
    });
}

function showSuccessCelebration() {
    closeQuestionModal();
    const $celebration = $('#success-celebration');
    $celebration.addClass('show');
    createConfetti();
    setTimeout(function() {
        $celebration.css({ transition: 'all 0.5s ease', opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' });
        setTimeout(function() {
            $celebration.removeClass('show').css({ opacity: '', transform: '', transition: '' });
        }, 500);
    }, 3000);
}

function createConfetti() {
    const colors = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#22d3ee', '#34d399', '#fbbf24', '#a78bfa'];
    const shapes = ['50%', '3px', '0']; // circle, rounded square, square
    for (let i = 0; i < 60; i++) {
        setTimeout(function() {
            const $confetti = $('<div class="confetti"></div>');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = 6 + Math.random() * 10;
            $confetti.css({
                left: Math.random() * 100 + 'vw',
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                width: size + 'px',
                height: size + 'px',
                borderRadius: shape,
                animationDuration: (2 + Math.random() * 3) + 's',
                animationDelay: Math.random() * 0.5 + 's'
            });
            $('body').append($confetti);
            setTimeout(function() { $confetti.remove(); }, 5000);
        }, i * 25);
    }
}

// ========== عداد الوقت ==========
const $countdownBar = $('#countdown-bar');
const $videoOverlay = $('#video-overlay');

const TIMING_CONFIG = { dayOfWeek: 0, startHour: 7, endHour: 19 };

function updateCountdown() {
    const now = new Date();
    const targetDay = TIMING_CONFIG.dayOfWeek;

    if (now.getDay() === targetDay && now.getHours() >= TIMING_CONFIG.endHour) { showVideoOnly(); return; }
    if (now.getDay() === targetDay && now.getHours() < TIMING_CONFIG.startHour) { $countdownBar.removeClass('show'); $('body').removeClass('countdown-active'); return; }

    if (now.getDay() === targetDay && now.getHours() >= TIMING_CONFIG.startHour && now.getHours() < TIMING_CONFIG.endHour) {
        $countdownBar.addClass('show');
        $('body').addClass('countdown-active');
    } else {
        $countdownBar.removeClass('show');
        $('body').removeClass('countdown-active');
    }

    let targetDate = new Date();
    targetDate.setHours(TIMING_CONFIG.endHour, 0, 0, 0);
    const daysUntil = (targetDay - now.getDay() + 7) % 7;
    targetDate.setDate(targetDate.getDate() + daysUntil);
    const diff = targetDate - now;

    $('#days').text(Math.floor(diff / 86400000).toString().padStart(2, '0'));
    $('#hours').text(Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0'));
    $('#minutes').text(Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0'));
    $('#seconds').text(Math.floor((diff % 60000) / 1000).toString().padStart(2, '0'));
}

function showVideoOnly() {
    const $iframe = $videoOverlay.find('iframe');
    if ($iframe.length && !$iframe.attr('src')) {
        const videoSrc = $iframe.attr('data-src');
        if (videoSrc) $iframe.attr('src', videoSrc);
    }
    $videoOverlay.addClass('show');
    $('#main-content').hide();
    $('#search-popup').addClass('d-none');
    $('#open-search-btn').hide();
    $('.bg-layer').hide();
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ========== نظام المشاركة الاجتماعية ==========
let lastFoundPerson = null;

// زر المشاركة العائم
$('#share-btn').on('click', function() {
    openShareModal();
});

function openShareModal() {
    const $modal = $('#share-modal');
    const $shareName = $('#share-name');
    const $shareInfo = $('#share-info');
    
    // لو فيه شخص اتعمله بحث قبل كدا
    if (lastFoundPerson) {
        $shareName.text(lastFoundPerson.name);
        $shareInfo.html(`أتوبيس ${lastFoundPerson.bus} - مقعد ${lastFoundPerson.seat}`);
        updateShareLinks(lastFoundPerson);
    } else {
        $shareName.text('دور على اسمك الأول!');
        $shareInfo.text('دور على مكانك وشاركه مع صحابك');
        setDefaultShareLinks();
    }
    
    $modal.addClass('show');
}

function closeShareModal() {
    $('#share-modal').removeClass('show');
}

// إغلاق بالضغط على الخلفية
$('#share-modal').on('click', function(e) {
    if (e.target === this) closeShareModal();
});

// تحديث روابط المشاركة
function updateShareLinks(person) {
    const pageUrl = window.location.href;
    const shareText = `🚍 مؤتمر الشباب\n📋 ${person.name}\n💺 أتوبيس ${person.bus} - مقعد ${person.seat}\n📍 دور على مكانك هنا:`;
    const fullText = shareText + ' ' + pageUrl;
    
    // واتساب
    $('#share-whatsapp').attr('href', 
        'https://wa.me/?text=' + encodeURIComponent(fullText)
    );
    
    // تليجرام
    $('#share-telegram').attr('href', 
        'https://t.me/share/url?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(shareText)
    );
}

function setDefaultShareLinks() {
    const pageUrl = window.location.href;
    const shareText = '🚍 مؤتمر الشباب - دور على مكانك في الأتوبيس!';
    const fullText = shareText + ' ' + pageUrl;
    
    $('#share-whatsapp').attr('href', 
        'https://wa.me/?text=' + encodeURIComponent(fullText)
    );
    $('#share-telegram').attr('href', 
        'https://t.me/share/url?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(shareText)
    );
}

// نسخ الرابط
function copyShareLink() {
    const pageUrl = window.location.href;
    let copyText = pageUrl;
    
    if (lastFoundPerson) {
        copyText = `🚍 مؤتمر الشباب\n📋 ${lastFoundPerson.name}\n💺 أتوبيس ${lastFoundPerson.bus} - مقعد ${lastFoundPerson.seat}\n🔗 ${pageUrl}`;
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText).then(function() {
            showCopyToast();
        }).catch(function() {
            fallbackCopy(copyText);
        });
    } else {
        fallbackCopy(copyText);
    }
}

function fallbackCopy(text) {
    const $temp = $('<textarea>');
    $('body').append($temp);
    $temp.val(text).select();
    try {
        document.execCommand('copy');
        showCopyToast();
    } catch(e) {
        // fallback: فتح نافذة الواتساب كحل بديل
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    }
    $temp.remove();
}

function showCopyToast() {
    const $toast = $('<div class="copy-toast"><i class="bi bi-check-circle me-2"></i>تم نسخ الرابط!</div>');
    $('body').append($toast);
    setTimeout(function() { $toast.remove(); }, 2200);
}

// سكرين شوت
function takeScreenshot() {
    // محاولة استخدام html2canvas لو متوفر
    if (typeof html2canvas !== 'undefined') {
        takeScreenshotWithHtml2Canvas();
        return;
    }
    
    // محاولة استخدام Web Share API
    if (navigator.share && navigator.canShare) {
        shareViaWebAPI();
        return;
    }
    
    // Fallback: نسخ النص كرسالة
    copyShareLink();
    showScreenshotHint();
}

function showScreenshotHint() {
    const $hint = $('<div class="copy-toast" style="background: linear-gradient(135deg, var(--seat-booked) 0%, var(--seat-booked-mid) 100%); box-shadow: 0 6px 20px var(--seat-booked-glow);"><i class="bi bi-phone me-2"></i>خد سكرين شوت وشاركه!</div>');
    $('body').append($hint);
    setTimeout(function() { $hint.remove(); }, 2500);
}

function shareViaWebAPI() {
    const pageUrl = window.location.href;
    let shareTitle = 'مؤتمر الشباب - مقعدي';
    let shareText = '🚍 مؤتمر الشباب\nدور على مكانك في الأتوبيس!';
    
    if (lastFoundPerson) {
        shareTitle = `مقعدي - أتوبيس ${lastFoundPerson.bus}`;
        shareText = `📋 ${lastFoundPerson.name}\n💺 أتوبيس ${lastFoundPerson.bus} - مقعد ${lastFoundPerson.seat}`;
    }
    
    navigator.share({
        title: shareTitle,
        text: shareText,
        url: pageUrl
    }).catch(function(err) {
        if (err.name !== 'AbortError') {
            copyShareLink();
        }
    });
}

function takeScreenshotWithHtml2Canvas() {
    // تحديد المنطقة اللي فيها مقعد الشخص
    let $target = null;
    if (lastFoundPerson) {
        $target = $('#' + lastFoundPerson.elementId).closest('.bus-container');
    }
    if (!$target || !$target.length) {
        $target = $('.bus-container').first();
    }
    
    html2canvas($target[0], {
        backgroundColor: '#0b1121',
        scale: 2,
        useCORS: true,
        logging: false
    }).then(function(canvas) {
        canvas.toBlob(function(blob) {
            if (navigator.share && navigator.canShare({ files: [new File([blob], 'my-seat.png', { type: 'image/png' })] })) {
                const file = new File([blob], 'my-seat.png', { type: 'image/png' });
                navigator.share({
                    title: 'مقعدي - مؤتمر الشباب',
                    files: [file]
                }).catch(function() {});
            } else {
                // تحميل الصورة
                const url = URL.createObjectURL(blob);
                const $a = $('<a>').attr({ href: url, download: 'my-seat.png' });
                $('body').append($a);
                $a[0].click();
                $a.remove();
                URL.revokeObjectURL(url);
                showScreenshotHint();
            }
        }, 'image/png');
    }).catch(function() {
        copyShareLink();
        showScreenshotHint();
    });
}
