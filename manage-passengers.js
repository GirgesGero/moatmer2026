/* ============================================
   manage-passengers.js
   بيانات ووظائف إدارة الركاب
   - يقرأ بيانات الركاب من script.js تلقائياً
   - يحفظ التعديلات في localStorage للاستكمال لاحقاً
   - يدعم تصدير/استيراد نسخ احتياطية JSON
   - يدعم تصدير script.js جديد بالأسماء المعدلة
   ============================================ */

const SEATS_PER_BUS = 49;
let currentBus = 1;
let editingBus = 1;
let editingSeat = 1;

let passengers = [];

/* ============================================
   دالة بناء خريطة المقاعد
   ============================================ */
function getSeatLayout() {
    const rows = [];
    let seatNum = 1;

    for (let r = 0; r < 5; r++) {
        rows.push([
            { type: 'seat', seatNum: seatNum++ },
            { type: 'seat', seatNum: seatNum++ },
            { type: 'aisle', seatNum: null },
            { type: 'seat', seatNum: seatNum++ },
            { type: 'seat', seatNum: seatNum++ }
        ]);
    }

    rows.push([
        { type: 'door', seatNum: null },
        { type: 'door', seatNum: null },
        { type: 'aisle', seatNum: null },
        { type: 'seat', seatNum: seatNum++ },
        { type: 'seat', seatNum: seatNum++ }
    ]);

    rows.push([
        { type: 'empty', seatNum: null },
        { type: 'empty', seatNum: null },
        { type: 'aisle', seatNum: null },
        { type: 'seat', seatNum: seatNum++ },
        { type: 'seat', seatNum: seatNum++ }
    ]);

    for (let r = 0; r < 5; r++) {
        rows.push([
            { type: 'seat', seatNum: seatNum++ },
            { type: 'seat', seatNum: seatNum++ },
            { type: 'aisle', seatNum: null },
            { type: 'seat', seatNum: seatNum++ },
            { type: 'seat', seatNum: seatNum++ }
        ]);
    }

    rows.push([
        { type: 'seat', seatNum: seatNum++, backRow: true },
        { type: 'seat', seatNum: seatNum++, backRow: true },
        { type: 'seat', seatNum: seatNum++, backRow: true },
        { type: 'seat', seatNum: seatNum++, backRow: true },
        { type: 'seat', seatNum: seatNum++, backRow: true }
    ]);

    return rows;
}

/* ============================================
   عرض شبكة المقاعد
   ============================================ */
function renderSeatsGrid() {
    const layout = getSeatLayout();
    const busPassengers = passengers.filter(p => p.bus === currentBus);
    let html = `<div class="bus-section-title">🚍 أتوبيس ${currentBus}</div>`;
    html += '<div class="seats-grid">';

    for (const row of layout) {
        for (const cell of row) {
            if (cell.type === 'seat') {
                const passenger = busPassengers.find(p => p.seat === cell.seatNum);
                const isBooked = !!passenger;
                const name = isBooked ? passenger.name : 'فاضي';
                const cls = isBooked ? 'booked' : 'empty';
                const backCls = cell.backRow ? ' back-row-cell' : '';
                html += `<div class="seat-cell ${cls}${backCls}" onclick="openEdit(${currentBus}, ${cell.seatNum})" title="${isBooked ? passenger.name : 'مقعد فاضي - ' + cell.seatNum}">
                    <span class="seat-number">${cell.seatNum}</span>
                    <span class="seat-name">${name}</span>
                </div>`;
            } else if (cell.type === 'aisle') {
                html += '<div class="aisle-cell"></div>';
            } else if (cell.type === 'door') {
                if (cell === row[0]) {
                    html += '<div class="door-cell">🪜🚪 سلم</div>';
                }
            } else if (cell.type === 'empty') {
                html += '<div class="seat-cell empty" style="opacity:0.3;cursor:default;border-style:dashed;"></div>';
            }
        }
    }

    html += '</div>';
    $('#seatsContainer').html(html);
}

/* ============================================
   عرض قائمة الركاب
   ============================================ */
function renderPassengerList() {
    const searchTerm = $('#searchInput').val().trim().toLowerCase();
    let filtered = passengers.filter(p => p.bus === currentBus);

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    filtered.sort((a, b) => a.seat - b.seat);

    let html = '';
    if (filtered.length === 0) {
        html = '<div style="text-align:center;color:var(--text-muted);padding:30px;font-size:0.9rem;">لا يوجد ركاب' + (searchTerm ? ' مطابقين للبحث' : ' في هذا الأتوبيس') + '</div>';
    } else {
        for (const p of filtered) {
            html += `<div class="passenger-item" onclick="openEdit(${p.bus}, ${p.seat})">
                <div class="p-seat-badge">${p.seat}</div>
                <div class="p-info">
                    <div class="p-name">${p.name}</div>
                    <div class="p-details">أتوبيس ${p.bus} · مقعد ${p.seat}</div>
                </div>
                <div class="p-edit-btn" onclick="event.stopPropagation(); openEdit(${p.bus}, ${p.seat})" title="تعديل"><i class="bi bi-pencil"></i></div>
                <div class="p-delete-btn" onclick="event.stopPropagation(); deletePassenger(${p.bus}, ${p.seat})" title="حذف"><i class="bi bi-trash3"></i></div>
            </div>`;
        }
    }

    $('#passengerList').html(html);
    $('#listCount').text(filtered.length + ' راكب');
}

/* ============================================
   تحديث الإحصائيات
   ============================================ */
function updateStats() {
    const totalPassengers = passengers.length;
    const totalSeatCount = SEATS_PER_BUS * 2;
    const totalEmpty = totalSeatCount - totalPassengers;

    $('#totalPassengers').text(totalPassengers);
    $('#totalEmpty').text(totalEmpty);
    $('#totalSeats').text(totalSeatCount);
}

/* ============================================
   تبديل الأتوبيس
   ============================================ */
function switchBus(busNum) {
    currentBus = busNum;
    $('.bus-tab').removeClass('active');
    $(`.bus-tab[data-bus="${busNum}"]`).addClass('active');
    renderSeatsGrid();
    renderPassengerList();
}

/* ============================================
   نافذة تعديل المقعد
   ============================================ */
function openEdit(bus, seat) {
    editingBus = bus;
    editingSeat = seat;

    const passenger = passengers.find(p => p.bus === bus && p.seat === seat);

    $('#editTitle').text(passenger ? 'تعديل المقعد ' + seat : 'إضافة راكب - مقعد ' + seat);
    $('#editSeatInfo').text(`أتوبيس ${bus} · مقعد ${seat}`);
    $('#editName').val(passenger ? passenger.name : '');
    $('#editBus').val(bus);
    $('#editSeat').val(seat);
    $('#clearNameBtn').toggle(!!passenger);

    $('#editOverlay').addClass('show');
    setTimeout(() => $('#editName').focus(), 300);
}

function closeEdit() {
    $('#editOverlay').removeClass('show');
}

function saveEdit() {
    const name = $('#editName').val().trim();
    const newBus = parseInt($('#editBus').val());
    const newSeat = parseInt($('#editSeat').val());

    if (!name) {
        showToast('اكتب اسم الراكب!', 'error');
        return;
    }

    if (!newSeat || newSeat < 1 || newSeat > SEATS_PER_BUS) {
        showToast('رقم المقعد لازم يكون من 1 لـ ' + SEATS_PER_BUS, 'error');
        return;
    }

    const existingIndex = passengers.findIndex(p => p.bus === newBus && p.seat === newSeat);
    const oldIndex = passengers.findIndex(p => p.bus === editingBus && p.seat === editingSeat);

    if (existingIndex !== -1 && existingIndex !== oldIndex) {
        showToast(`المقعد ${newSeat} في أتوبيس ${newBus} محجوز لـ "${passengers[existingIndex].name}"`, 'warning');
        return;
    }

    if (oldIndex !== -1) {
        passengers[oldIndex].name = name;
        passengers[oldIndex].bus = newBus;
        passengers[oldIndex].seat = newSeat;
        showToast('تم تعديل ' + name + ' بنجاح ✅', 'success');
    } else {
        passengers.push({ name, bus: newBus, seat: newSeat });
        showToast('تم إضافة ' + name + ' بنجاح ✅', 'success');
    }

    saveToStorage();
    closeEdit();
    refreshAll();
}

function clearSeatName() {
    const index = passengers.findIndex(p => p.bus === editingBus && p.seat === editingSeat);
    if (index !== -1) {
        const name = passengers[index].name;
        passengers.splice(index, 1);
        saveToStorage();
        closeEdit();
        refreshAll();
        showToast('تم إخلاء مقعد ' + editingSeat + ' (' + name + ') ✅', 'info');
    }
}

/* ============================================
   إضافة راكب جديد
   ============================================ */
function openAddModal() {
    $('#addName').val('');
    $('#addBus').val(currentBus);
    $('#addSeat').val('');
    $('#addSeatStatus').text('');
    $('#addOverlay').addClass('show');
    setTimeout(() => $('#addName').focus(), 300);
}

function closeAddModal() {
    $('#addOverlay').removeClass('show');
}

$(document).on('input change', '#addBus, #addSeat', function() {
    const bus = parseInt($('#addBus').val());
    const seat = parseInt($('#addSeat').val());
    if (bus && seat) {
        const existing = passengers.find(p => p.bus === bus && p.seat === seat);
        if (existing) {
            $('#addSeatStatus').html('<span style="color:var(--danger);">⚠️ المقعد محجوز لـ ' + existing.name + '</span>');
        } else if (seat < 1 || seat > SEATS_PER_BUS) {
            $('#addSeatStatus').html('<span style="color:var(--danger);">⚠️ رقم المقعد غير صحيح</span>');
        } else {
            $('#addSeatStatus').html('<span style="color:var(--seat-avail-light);">✅ المقعد فاضي</span>');
        }
    } else {
        $('#addSeatStatus').text('');
    }
});

function saveAddPassenger() {
    const name = $('#addName').val().trim();
    const bus = parseInt($('#addBus').val());
    const seat = parseInt($('#addSeat').val());

    if (!name) { showToast('اكتب اسم الراكب!', 'error'); return; }
    if (!seat || seat < 1 || seat > SEATS_PER_BUS) { showToast('رقم المقعد لازم يكون من 1 لـ ' + SEATS_PER_BUS, 'error'); return; }

    const existing = passengers.find(p => p.bus === bus && p.seat === seat);
    if (existing) {
        showToast(`المقعد ${seat} محجوز لـ "${existing.name}"`, 'warning');
        return;
    }

    passengers.push({ name, bus, seat });
    saveToStorage();
    closeAddModal();
    refreshAll();
    showToast('تم إضافة ' + name + ' بنجاح ✅', 'success');
}

/* ============================================
   حذف راكب
   ============================================ */
function deletePassenger(bus, seat) {
    const p = passengers.find(p => p.bus === bus && p.seat === seat);
    if (!p) return;

    showConfirm(
        'حذف راكب',
        `هل تريد حذف "${p.name}" من أتوبيس ${bus} مقعد ${seat}؟`,
        function() {
            const idx = passengers.findIndex(pp => pp.bus === bus && pp.seat === seat);
            if (idx !== -1) {
                passengers.splice(idx, 1);
                saveToStorage();
                refreshAll();
                showToast('تم حذف ' + p.name + ' ✅', 'info');
            }
        }
    );
}

/* ============================================
   مسح كل الأسماء
   ============================================ */
function confirmClearAll() {
    if (passengers.length === 0) {
        showToast('مفيش أسماء للمسح!', 'warning');
        return;
    }
    showConfirm(
        'مسح كل الأسماء',
        `هل تريد مسح كل أسماء الركاب (${passengers.length} راكب)؟<br>هذا الإجراء لا يمكن التراجع عنه!`,
        function() {
            passengers = [];
            saveToStorage();
            refreshAll();
            showToast('تم مسح كل الأسماء ✅', 'info');
        }
    );
}

/* ============================================
   نافذة التأكيد
   ============================================ */
function showConfirm(title, text, onConfirm) {
    $('#confirmTitle').text(title);
    $('#confirmText').html(text);
    $('#confirmOverlay').addClass('show');

    $('#confirmYes').off('click').on('click', function() {
        closeConfirm();
        onConfirm();
    });
}

function closeConfirm() {
    $('#confirmOverlay').removeClass('show');
}

/* ============================================
   تحميل script.js الأصلي
   ============================================ */
let originalScriptContent = null;

function fetchOriginalScript() {
    return fetch('script.js')
        .then(function(r) { return r.text(); })
        .then(function(content) {
            originalScriptContent = content;
            return content;
        })
        .catch(function() {
            console.log('تعذر تحميل script.js الأصلي');
            return null;
        });
}

/* ============================================
   استخراج مصفوفة passengers من محتوى script.js
   ============================================ */
function parsePassengersFromScript(scriptContent) {
    if (!scriptContent) return [];

    try {
        // محاولة استخراج المصفوفة باستخدام regex
        // البحث عن const passengers = [...] أو let passengers = [...] أو var passengers = [...]
        var match = scriptContent.match(/(?:const|let|var)\s+passengers\s*=\s*(\[[\s\S]*?\])\s*;/);
        if (match && match[1]) {
            // استخدام Function constructor لتقييم المصفوفة بأمان
            // هذا يتعامل مع التعليقات والتنسيقات المختلفة
            var arrayStr = match[1];
            try {
                var parsedArray = new Function('return ' + arrayStr)();
                if (Array.isArray(parsedArray)) {
                    return parsedArray.map(function(p) {
                        return {
                            name: p.name || '',
                            bus: parseInt(p.bus) || 1,
                            seat: parseInt(p.seat) || 1
                        };
                    }).filter(function(p) { return p.name.trim() !== ''; });
                }
            } catch (e2) {
                console.warn('فشل تقييم المصفوفة، محاولة JSON.parse بعد التنظيف:', e2);
                // محاولة تنظيف التعليقات ثم JSON.parse
                var cleaned = arrayStr
                    .replace(/\/\/.*$/gm, '')           // حذف تعليقات سطر واحد
                    .replace(/\/\*[\s\S]*?\*\//g, '')   // حذف تعليقات متعددة الأسطر
                    .replace(/,\s*]/g, ']')             // حذف فاصلة أخيرة قبل ]
                    .replace(/,\s*}/g, '}')             // حذف فاصلة أخيرة قبل }
                    .trim();
                try {
                    var parsed = JSON.parse(cleaned);
                    if (Array.isArray(parsed)) {
                        return parsed.map(function(p) {
                            return {
                                name: p.name || '',
                                bus: parseInt(p.bus) || 1,
                                seat: parseInt(p.seat) || 1
                            };
                        }).filter(function(p) { return p.name.trim() !== ''; });
                    }
                } catch (e3) {
                    console.warn('فشل JSON.parse أيضاً:', e3);
                }
            }
        }
    } catch (e) {
        console.error('خطأ في تحليل script.js:', e);
    }

    return [];
}

/* ============================================
   تصدير script.js كامل - بالأسماء والمقاعد الجديدة
   يستخدم SCRIPT_TEMPLATE (من script-template.js)
   اللي فيه كل الكود الأصلي بعد مصفوفة الركاب
   ============================================ */
function exportScript() {
    // بناء مصفوفة passengers بالتنسيق الأصلي
    var passengersStr = '';
    var bus1Passengers = passengers.filter(function(p) { return p.bus === 1; });
    var bus2Passengers = passengers.filter(function(p) { return p.bus === 2; });

    // ترتيب حسب رقم المقعد
    bus1Passengers.sort(function(a, b) { return a.seat - b.seat; });
    bus2Passengers.sort(function(a, b) { return a.seat - b.seat; });

    if (bus1Passengers.length > 0) {
        passengersStr += '    // === أوتوبيس 1 ===\n';
        for (var i = 0; i < bus1Passengers.length; i++) {
            var p = bus1Passengers[i];
            passengersStr += '    { "name": "' + escapeForJS(p.name) + '", "bus": ' + p.bus + ', "seat": ' + p.seat + ', "elementId": "bus' + p.bus + '-seat-' + p.seat + '" }';
            if (i < bus1Passengers.length - 1 || bus2Passengers.length > 0) {
                passengersStr += ',';
            }
            passengersStr += '\n';
        }
    }

    if (bus2Passengers.length > 0) {
        passengersStr += '    // === أوتوبيس 2 ===\n';
        for (var i = 0; i < bus2Passengers.length; i++) {
            var p = bus2Passengers[i];
            passengersStr += '    { "name": "' + escapeForJS(p.name) + '", "bus": ' + p.bus + ', "seat": ' + p.seat + ', "elementId": "bus' + p.bus + '-seat-' + p.seat + '" }';
            if (i < bus2Passengers.length - 1) {
                passengersStr += ',';
            }
            passengersStr += '\n';
        }
    }

    // القسم 1: مصفوفة passengers
    var newSection1 = '/* \n * ==========================================\n * 1. بيانات المقاعد (JSON Array)\n * الترقيم التسلسلي: 1 - 49 مقعد\n * ==========================================\n */\nlet passengers = [\n' + passengersStr + '];\n';

    // القسم 1.5: كود قراءة localStorage
    var newSection15 = '\n/* \n * ==========================================\n * 1.5 قراءة التعديلات من localStorage\n * لو تم تعديل الأسماء من صفحة إدارة الركاب\n * يتم استخدام البيانات المعدلة بدلاً من الأصلية\n * ==========================================\n */\n(function loadModifiedPassengers() {\n    try {\n        var savedV3 = localStorage.getItem(\'conference_passengers_v3\');\n        if (savedV3) {\n            var data = JSON.parse(savedV3);\n            if (data.passengers && Array.isArray(data.passengers) && data.passengers.length > 0) {\n                passengers = data.passengers.map(function(p) {\n                    return {\n                        name: p.name,\n                        bus: p.bus,\n                        seat: p.seat,\n                        elementId: \'bus\' + p.bus + \'-seat-\' + p.seat\n                    };\n                });\n                console.log(\'تم تحميل التعديلات من localStorage:\', passengers.length, \'راكب\');\n                return;\n            }\n        }\n    } catch (e) {\n        console.warn(\'تعذر قراءة التعديلات من localStorage:\', e);\n    }\n})();\n';

    var scriptContent;

    // الأولوية 1: لو script.js الأصلي اتحمل بنجاح من السيرفر
    if (originalScriptContent) {
        var regexWithIIFE = /\/\*[\s\S]*?1\.\s*بيانات المقاعد[\s\S]*?\*\/\s*\n(?:const|let|var)\s+passengers\s*=\s*\[[\s\S]*?\];\s*\n\/\*[\s\S]*?1\.5[\s\S]*?\*\/\s*\n\(function loadModifiedPassengers\(\)[\s\S]*?\}\)\(\);/;

        if (regexWithIIFE.test(originalScriptContent)) {
            scriptContent = originalScriptContent.replace(regexWithIIFE, newSection1 + newSection15);
        } else {
            var regexSection1 = /\/\*[\s\S]*?1\.\s*بيانات المقاعد[\s\S]*?\*\/\s*\n(?:const|let|var)\s+passengers\s*=\s*\[[\s\S]*?\];/;
            if (regexSection1.test(originalScriptContent)) {
                scriptContent = originalScriptContent.replace(regexSection1, newSection1 + newSection15);
            } else {
                scriptContent = originalScriptContent.replace(/(?:const|let|var)\s+passengers\s*=\s*\[[\s\S]*?\];/, newSection1 + newSection15);
            }
        }
    }
    // الأولوية 2: استخدام القالب المضمّن (SCRIPT_TEMPLATE من script-template.js)
    else if (typeof SCRIPT_TEMPLATE !== 'undefined' && SCRIPT_TEMPLATE) {
        scriptContent = newSection1 + newSection15 + SCRIPT_TEMPLATE;
    }
    // الأولوية 3: fallback - ملف مبسط
    else {
        scriptContent = newSection1 + newSection15 + '\nconsole.log("بيانات الركاب جاهزة:", passengers.length, "راكب");\n';
    }

    var blob = new Blob([scriptContent], { type: 'application/javascript' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'script.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('تم تحميل script.js الكامل (' + passengers.length + ' راكب) ✅', 'success');
}

/* حماية الأسماء عند كتابتها كـ string في JavaScript */
function escapeForJS(str) {
    return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
}

/* ============================================
   استيراد بيانات
   ============================================ */
function toggleImport() {
    const $section = $('#importSection');
    $section.toggle();
    if ($section.is(':visible')) {
        $('html, body').animate({ scrollTop: $section.offset().top - 60 }, 400);
    }
}

function importData(mode) {
    const raw = $('#importArea').val().trim();
    if (!raw) { showToast('الصق البيانات أولاً!', 'warning'); return; }

    try {
        let newData = JSON.parse(raw);
        if (!Array.isArray(newData)) throw new Error('البيانات لازم تكون مصفوفة');

        for (const item of newData) {
            if (!item.name || typeof item.name !== 'string') throw new Error('كل عنصر لازم فيه name');
            if (!item.bus || ![1, 2].includes(item.bus)) throw new Error('bus لازم يكون 1 أو 2');
            if (!item.seat || item.seat < 1 || item.seat > SEATS_PER_BUS) throw new Error('seat لازم يكون من 1 لـ ' + SEATS_PER_BUS);
        }

        if (mode === 'replace') {
            passengers = newData.map(p => ({ name: p.name, bus: p.bus, seat: p.seat }));
            showToast('تم استبدال كل البيانات (' + passengers.length + ' راكب) ✅', 'success');
        } else {
            let added = 0;
            for (const item of newData) {
                const exists = passengers.find(p => p.bus === item.bus && p.seat === item.seat);
                if (!exists) {
                    passengers.push({ name: item.name, bus: item.bus, seat: item.seat });
                    added++;
                }
            }
            showToast('تم إضافة ' + added + ' راكب جديد ✅', 'success');
        }

        saveToStorage();
        refreshAll();
        $('#importArea').val('');
    } catch (e) {
        showToast('خطأ في البيانات: ' + e.message, 'error');
    }
}

/* ============================================
   البحث
   ============================================ */
function filterPassengers() {
    renderPassengerList();
}

/* ============================================
   حفظ واسترجاع من localStorage + مؤشر الحفظ
   ============================================ */
let lastSaveTime = null;
let hasUnsavedChanges = false;

function saveToStorage() {
    try {
        const saveData = {
            passengers: passengers,
            lastSaved: new Date().toISOString(),
            version: 'v3'
        };
        localStorage.setItem('conference_passengers_v3', JSON.stringify(saveData));
        lastSaveTime = new Date();
        hasUnsavedChanges = false;
        updateSaveIndicator();
    } catch (e) { console.error('خطأ في الحفظ:', e); }
}

function loadFromStorage() {
    try {
        // محاولة تحميل النسخة الأحدث
        const savedV3 = localStorage.getItem('conference_passengers_v3');
        if (savedV3) {
            const data = JSON.parse(savedV3);
            if (data.passengers && Array.isArray(data.passengers) && data.passengers.length > 0) {
                passengers = data.passengers;
                if (data.lastSaved) lastSaveTime = new Date(data.lastSaved);
                updateSaveIndicator();
                return true;
            }
        }
        // محاولة تحميل النسخة القديمة v2
        const savedV2 = localStorage.getItem('conference_passengers_v2');
        if (savedV2) {
            const data = JSON.parse(savedV2);
            if (data.passengers && Array.isArray(data.passengers) && data.passengers.length > 0) {
                passengers = data.passengers;
                if (data.lastSaved) lastSaveTime = new Date(data.lastSaved);
                saveToStorage(); // ترقية لـ v3
                return true;
            }
        }
        // محاولة تحميل النسخة القديمة v1
        const savedV1 = localStorage.getItem('conference_passengers_v1');
        if (savedV1) {
            const data = JSON.parse(savedV1);
            if (Array.isArray(data) && data.length > 0) {
                passengers = data;
                saveToStorage(); // ترقية لـ v3
                return true;
            }
        }
    } catch (e) { console.error('خطأ في التحميل من localStorage:', e); }
    return false;
}

function updateSaveIndicator() {
    const $dot = $('#saveDot');
    const $status = $('#saveStatus');
    if (hasUnsavedChanges) {
        $dot.addClass('unsaved');
        $status.text('تغييرات غير محفوظة...');
    } else if (lastSaveTime) {
        $dot.removeClass('unsaved');
        const timeStr = lastSaveTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        $status.text('تم الحفظ تلقائياً - ' + timeStr);
    } else {
        $dot.removeClass('unsaved');
        $status.text('يتم الحفظ تلقائياً');
    }
}

function markUnsaved() {
    hasUnsavedChanges = true;
    updateSaveIndicator();
}

/* ============================================
   تصدير نسخة احتياطية JSON
   ============================================ */
function exportJSONBackup() {
    const backupData = {
        app: 'مؤتمر الشباب 2026 - إدارة الركاب',
        exportDate: new Date().toISOString(),
        exportDateFormatted: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        totalPassengers: passengers.length,
        bus1Count: passengers.filter(p => p.bus === 1).length,
        bus2Count: passengers.filter(p => p.bus === 2).length,
        passengers: passengers
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = 'ركاب-المؤتمر-' + dateStr + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('تم حفظ النسخة الاحتياطية (' + passengers.length + ' راكب) ✅', 'success');
}

/* ============================================
   استيراد من ملف JSON
   ============================================ */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    processFile(file);
    event.target.value = '';
}

function processFile(file) {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
        showToast('الملف لازم يكون بصيغة JSON!', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let parsed = JSON.parse(content);

            let newData;
            let isBackupFormat = false;

            if (parsed.passengers && Array.isArray(parsed.passengers)) {
                newData = parsed.passengers;
                isBackupFormat = true;
            } else if (Array.isArray(parsed)) {
                newData = parsed;
            } else {
                throw new Error('صيغة الملف غير معروفة');
            }

            for (const item of newData) {
                if (!item.name || typeof item.name !== 'string') throw new Error('كل عنصر لازم فيه name');
                if (!item.bus || ![1, 2].includes(item.bus)) throw new Error('bus لازم يكون 1 أو 2');
                if (!item.seat || item.seat < 1 || item.seat > SEATS_PER_BUS) throw new Error('seat لازم يكون من 1 لـ ' + SEATS_PER_BUS);
            }

            let info = 'الملف فيه ' + newData.length + ' راكب';
            if (isBackupFormat && parsed.exportDateFormatted) {
                info += '\nتاريخ النسخة: ' + parsed.exportDateFormatted;
            }
            info += '\nأتوبيس 1: ' + newData.filter(p => p.bus === 1).length + ' راكب';
            info += '\nأتوبيس 2: ' + newData.filter(p => p.bus === 2).length + ' راكب';

            showConfirm(
                'استرداد البيانات',
                info + '<br><br>عايز تستبدل البيانات الموجودة ولا تضيف عليها؟<br>(الموجود حالياً: ' + passengers.length + ' راكب)',
                function() {
                    passengers = newData.map(p => ({ name: p.name, bus: p.bus, seat: p.seat }));
                    saveToStorage();
                    refreshAll();
                    showToast('تم استرداد ' + passengers.length + ' راكب بنجاح ✅', 'success');
                }
            );

        } catch (err) {
            showToast('خطأ في الملف: ' + err.message, 'error');
        }
    };
    reader.onerror = function() {
        showToast('مش قادر نقرأ الملف!', 'error');
    };
    reader.readAsText(file);
}

/* ============================================
   سحب وإفلات الملفات (Drag & Drop)
   ============================================ */
function initDragDrop() {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;

    ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');
        });
    });

    dropZone.addEventListener('drop', function(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    });
}

/* ============================================
   Toast رسائل
   ============================================ */
function showToast(msg, type) {
    type = type || 'info';
    const cls = 'toast-msg toast-' + type;
    const $toast = $('<div class="' + cls + '">' + msg + '</div>');
    $('body').append($toast);
    setTimeout(() => $toast.addClass('show'), 50);
    setTimeout(() => {
        $toast.removeClass('show');
        setTimeout(() => $toast.remove(), 400);
    }, 2500);
}

/* ============================================
   تحديث كل شيء
   ============================================ */
function refreshAll() {
    renderSeatsGrid();
    renderPassengerList();
    updateStats();
}

/* ============================================
   إغلاق النوافذ بالضغط على الخلفية أو Escape
   ============================================ */
$('.edit-overlay, .add-overlay, .confirm-overlay').on('click', function(e) {
    if (e.target === this) {
        $(this).removeClass('show');
    }
});

$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        $('.edit-overlay, .add-overlay, .confirm-overlay').removeClass('show');
    }
});

$('#addName').on('keypress', function(e) {
    if (e.which === 13) saveAddPassenger();
});
$('#editName').on('keypress', function(e) {
    if (e.which === 13) saveEdit();
});

/* ============================================
   تهيئة الصفحة
   الأولوية:
   1. localStorage (لو فيه بيانات محفوظة من تعديلات سابقة)
   2. script.js (الملف الأصلي فيه الأسماء)
   3. مصفوفة فاضية
   ============================================ */
$(document).ready(function() {
    // الخطوة 1: محاولة التحميل من localStorage أولاً
    const hasLocalData = loadFromStorage();

    if (hasLocalData && passengers.length > 0) {
        // فيه بيانات محفوظة محلياً - نستخدمها
        console.log('تم تحميل البيانات من localStorage:', passengers.length, 'راكب');
        refreshAll();
        initDragDrop();
        updateSaveIndicator();
    } else {
        // الخطوة 2: محاولة التحميل من script.js
        fetchOriginalScript().then(function(content) {
            if (content) {
                const parsedPassengers = parsePassengersFromScript(content);
                if (parsedPassengers.length > 0) {
                    passengers = parsedPassengers;
                    // حفظ في localStorage عشان المرة الجاية
                    saveToStorage();
                    console.log('تم تحميل البيانات من script.js:', passengers.length, 'راكب');
                } else {
                    console.log('لم يتم العثور على بيانات ركاب في script.js');
                }
            }
            refreshAll();
            initDragDrop();
            updateSaveIndicator();
        }).catch(function() {
            refreshAll();
            initDragDrop();
            updateSaveIndicator();
        });
    }

    // تحذير عند إغلاق الصفحة لو فيه تغييرات مش محفوظة
    window.addEventListener('beforeunload', function(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
});
