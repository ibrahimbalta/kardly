/* ==========================================================================
   ProCard Enterprise - Complete Management & Digital Business Card Engine
   ========================================================================== */

const STORAGE_KEY = 'procard_enterprise_state';

// Default State Seed
const DEFAULT_STATE = {
    settings: {
        companyName: 'Eren Yapı Dekorasyon',
        companyWebsite: 'https://erenyapi.com',
        offboardMode: 'message', // 'message', 'redirect_website', 'hr_contact'
        logoUrl: 'images/logo.png',
        lang: 'tr'
    },
    departments: [
        { id: 'dept-1', name: 'Yönetim', primaryColor: '#0f2b48', accentColor: '#d97706', badge: 'Executive Dark' },
        { id: 'dept-2', name: 'Satış & Pazarlama', primaryColor: '#d97706', accentColor: '#f59e0b', badge: 'Vibrant Gold' },
        { id: 'dept-3', name: 'Mühendislik & Proje', primaryColor: '#047857', accentColor: '#10b981', badge: 'Tech Emerald' },
        { id: 'dept-4', name: 'İnsan Kaynakları', primaryColor: '#6d28d9', accentColor: '#8b5cf6', badge: 'Warm Violet' }
    ],
    employees: [
        {
            id: 'emp-101',
            name: 'Ahmet Yılmaz',
            title: 'Genel Müdür & Kurucu',
            dept: 'Yönetim',
            phone: '+90 532 111 2233',
            email: 'ahmet@erenyapi.com',
            nfcUid: 'NFC-EREN-101',
            status: 'active', // 'active' or 'inactive'
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
            bio: 'Anahtar teslim mimari tasarımlar ve kurumsal iç dekorasyon yönetimi.',
            views: 142,
            downloads: 48
        },
        {
            id: 'emp-102',
            name: 'Zeynep Demir',
            title: 'Kurumsal Satış Müdürü',
            dept: 'Satış & Pazarlama',
            phone: '+90 533 444 5566',
            email: 'zeynep@erenyapi.com',
            nfcUid: 'NFC-EREN-102',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
            bio: 'B2B proje teklifleri, gayrimenkul dekorasyon projeleri satış yönetimi.',
            views: 98,
            downloads: 35
        },
        {
            id: 'emp-103',
            name: 'Caner Şahin',
            title: 'Kıdemli İç Mimar',
            dept: 'Mühendislik & Proje',
            phone: '+90 535 777 8899',
            email: 'caner@erenyapi.com',
            nfcUid: 'NFC-EREN-103',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
            bio: '3D görselleştirme, asma tavan & alçıpan teknik uygulama uzmanı.',
            views: 74,
            downloads: 19
        },
        {
            id: 'emp-104',
            name: 'Elif Aksoy',
            title: 'Eski Satış Temsilcisi (İşten Ayrıldı)',
            dept: 'Satış & Pazarlama',
            phone: '+90 536 000 1122',
            email: 'elif@erenyapi.com',
            nfcUid: 'NFC-EREN-104',
            status: 'inactive', // Offboarded employee demo
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
            bio: 'Satış departmanı eski çalışanı.',
            views: 31,
            downloads: 4
        }
    ],
    leads: [
        {
            id: 'lead-1',
            date: '2026-07-19 14:30',
            name: 'Kaan Öztürk',
            phone: '0530 999 8877',
            email: 'kaan@holding.com',
            empId: 'emp-102',
            empName: 'Zeynep Demir',
            note: 'Fuar standında tanışıldı, plaza tadilatı için teklif istiyor.'
        }
    ]
};

class EnterpriseStore {
    constructor() {
        this.state = this.loadState();
        this.selectedEmpId = this.state.employees[0] ? this.state.employees[0].id : null;
        this.activeDeptFilter = 'all';
    }

    loadState() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : JSON.parse(JSON.stringify(DEFAULT_STATE));
        } catch (e) {
            console.error('Failed to load state from localStorage', e);
            return JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    }

    saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save state to localStorage', e);
        }
    }

    getEmployees() { return this.state.employees; }
    getSettings() { return this.state.settings; }
    getDepartments() { return this.state.departments; }
    getLeads() { return this.state.leads; }

    getSelectedEmployee() {
        return this.state.employees.find(e => e.id === this.selectedEmpId) || this.state.employees[0];
    }

    setSelectedEmpId(id) {
        this.selectedEmpId = id;
    }

    toggleEmployeeStatus(id) {
        const emp = this.state.employees.find(e => e.id === id);
        if (emp) {
            emp.status = emp.status === 'active' ? 'inactive' : 'active';
            this.saveState();
        }
    }

    addOrUpdateEmployee(empData) {
        if (empData.id) {
            const index = this.state.employees.findIndex(e => e.id === empData.id);
            if (index !== -1) {
                this.state.employees[index] = { ...this.state.employees[index], ...empData };
            }
        } else {
            const newEmp = {
                id: 'emp-' + Date.now(),
                views: 0,
                downloads: 0,
                status: empData.status || 'active',
                nfcUid: empData.nfcUid || 'NFC-EREN-' + Math.floor(100 + Math.random() * 900),
                avatar: empData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
                ...empData
            };
            this.state.employees.push(newEmp);
        }
        this.saveState();
    }

    deleteEmployee(id) {
        this.state.employees = this.state.employees.filter(e => e.id !== id);
        if (this.selectedEmpId === id && this.state.employees.length > 0) {
            this.selectedEmpId = this.state.employees[0].id;
        }
        this.saveState();
    }

    addLead(leadData) {
        const newLead = {
            id: 'lead-' + Date.now(),
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            ...leadData
        };
        this.state.leads.unshift(newLead);
        this.saveState();
    }

    deleteLead(id) {
        this.state.leads = this.state.leads.filter(l => l.id !== id);
        this.saveState();
    }

    incrementEmpStat(id, type) {
        const emp = this.state.employees.find(e => e.id === id);
        if (emp) {
            if (type === 'views') emp.views = (emp.views || 0) + 1;
            if (type === 'downloads') emp.downloads = (emp.downloads || 0) + 1;
            this.saveState();
        }
    }

    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        this.saveState();
    }

    batchGenerateNfc(prefix) {
        this.state.employees.forEach((emp, i) => {
            emp.nfcUid = `${prefix}${(101 + i)}`;
        });
        this.saveState();
    }
}

// Global Store Instance
const store = new EnterpriseStore();

document.addEventListener('DOMContentLoaded', () => {
    initViewSwitchers();
    initPublicCardView();
    initAdminDashboard();
    initModals();
});

/* ==========================================================================
   1. VIEW SWITCHER & TOPBAR LOGIC
   ========================================================================== */
function initViewSwitchers() {
    const btnPublic = document.getElementById('btnViewPublic');
    const btnAdmin = document.getElementById('btnViewAdmin');
    const publicView = document.getElementById('publicCardView');
    const adminView = document.getElementById('adminDashboard');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginError = document.getElementById('adminLoginError');

    let isAdminAuthenticated = false;

    const btnGoHomeLogo = document.getElementById('btnGoHomeLogo');
    const btnGoHomeText = document.getElementById('btnGoHomeText');
    const btnDashboardIsletmeBadge = document.getElementById('btnDashboardIsletmeBadge');
    const btnOpenEnterpriseDashboardTop = document.getElementById('btnOpenEnterpriseDashboardTop');

    const handleGoHome = (e) => {
        if (e) e.preventDefault();
        btnPublic.classList.add('active');
        btnAdmin.classList.remove('active');
        publicView.classList.add('active-view');
        adminView.classList.remove('active-view');
        renderPublicCard();
    };

    const handleOpenAdmin = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!isAdminAuthenticated) {
            if (adminLoginModal) adminLoginModal.style.display = 'flex';
        } else {
            switchToAdminView();
        }
    };

    if (btnPublic) btnPublic.addEventListener('click', handleGoHome);
    if (btnGoHomeLogo) btnGoHomeLogo.addEventListener('click', handleGoHome);
    if (btnGoHomeText) btnGoHomeText.addEventListener('click', handleGoHome);

    if (btnAdmin) btnAdmin.addEventListener('click', handleOpenAdmin);
    if (btnDashboardIsletmeBadge) btnDashboardIsletmeBadge.addEventListener('click', handleOpenAdmin);
    if (btnOpenEnterpriseDashboardTop) btnOpenEnterpriseDashboardTop.addEventListener('click', handleOpenAdmin);

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('adminPasswordInput').value.trim();
            // Default Demo Admin Password
            if (pass === 'admin123' || pass === 'admin' || pass === '1234') {
                isAdminAuthenticated = true;
                if (adminLoginModal) adminLoginModal.style.display = 'none';
                if (adminLoginError) adminLoginError.style.display = 'none';
                switchToAdminView();
            } else {
                if (adminLoginError) {
                    adminLoginError.style.display = 'block';
                    adminLoginError.textContent = '❌ Geçersiz lisans şifresi! (Demo Şifre: admin123)';
                }
            }
        });
    }

    const btnCloseLogin = document.getElementById('btnCloseAdminLogin');
    const btnCancelLogin = document.getElementById('btnCancelAdminLogin');
    if (btnCloseLogin) btnCloseLogin.onclick = () => { if (adminLoginModal) adminLoginModal.style.display = 'none'; };
    if (btnCancelLogin) btnCancelLogin.onclick = () => { if (adminLoginModal) adminLoginModal.style.display = 'none'; };

    function switchToAdminView() {
        btnAdmin.classList.add('active');
        btnPublic.classList.remove('active');
        adminView.classList.add('active-view');
        publicView.classList.remove('active-view');
        renderAdminDashboard();
    }

    // Language Toggle
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const lang = this.dataset.lang;
            store.updateSettings({ lang });
            alert(lang === 'en' ? 'Language switched to English (Simulation)' : 'Dil Türkçe olarak ayarlandı.');
        });
    });
}

/* ==========================================================================
   2. PUBLIC CARD ENGINE
   ========================================================================== */
function initPublicCardView() {
    populateEmployeeDropdown();
    renderPublicCard();

    const dropdown = document.getElementById('employeeSelectDropdown');
    if (dropdown) {
        dropdown.addEventListener('change', (e) => {
            store.setSelectedEmpId(e.target.value);
            renderPublicCard();
        });
    }

    const btnRandom = document.getElementById('btnRandomEmployee');
    if (btnRandom) {
        btnRandom.addEventListener('click', () => {
            const emps = store.getEmployees();
            if (emps.length === 0) return;
            const randomIndex = Math.floor(Math.random() * emps.length);
            store.setSelectedEmpId(emps[randomIndex].id);
            dropdown.value = emps[randomIndex].id;
            renderPublicCard();
        });
    }
}

function populateEmployeeDropdown() {
    const dropdown = document.getElementById('employeeSelectDropdown');
    const nfcSimSelect = document.getElementById('nfcSimSelectEmp');
    const badgeSelect = document.getElementById('badgeSelectEmp');

    if (!dropdown) return;

    const emps = store.getEmployees();
    let optionsHtml = '';

    emps.forEach(emp => {
        const statusBadge = emp.status === 'active' ? '🟢' : '🔴 [Pasif]';
        optionsHtml += `<option value="${emp.id}">${statusBadge} ${emp.name} - ${emp.dept}</option>`;
    });

    dropdown.innerHTML = optionsHtml;
    if (nfcSimSelect) nfcSimSelect.innerHTML = optionsHtml;
    if (badgeSelect) badgeSelect.innerHTML = optionsHtml;

    dropdown.value = store.getSelectedEmployee()?.id || '';
}

function renderPublicCard() {
    const emp = store.getSelectedEmployee();
    const settings = store.getSettings();
    if (!emp) return;

    // Increment View Counter
    store.incrementEmpStat(emp.id, 'views');

    // Branding Update
    document.getElementById('displayCompanyName').textContent = settings.companyName;
    document.getElementById('cardEmpName').textContent = emp.name;
    document.getElementById('cardEmpTitle').textContent = emp.title;
    document.getElementById('cardEmpBio').textContent = emp.bio || '';
    document.getElementById('cardDeptPill').textContent = emp.dept;
    document.getElementById('cardAvatarImg').src = emp.avatar;
    document.getElementById('cardNfcUidDisplay').textContent = emp.nfcUid;

    // Direct Action Links
    const cleanPhone = emp.phone.replace(/[^0-9+]/g, '');
    document.getElementById('cardLinkPhone').href = `tel:${cleanPhone}`;
    document.getElementById('cardSubPhone').textContent = emp.phone;

    document.getElementById('cardLinkEmail').href = `mailto:${emp.email}`;
    document.getElementById('cardSubEmail').textContent = emp.email;

    const whatsappMsg = encodeURIComponent(`Merhaba ${emp.name}, ${settings.companyName} dijital kartvizitiniz üzerinden ulaşıyorum.`);
    document.getElementById('cardLinkWhatsapp').href = `https://wa.me/${cleanPhone.replace('+', '')}?text=${whatsappMsg}`;
    document.getElementById('cardSubWhatsapp').textContent = `${emp.phone} - Anında Mesaj`;

    // vCard Download (.vcf)
    const btnVcard = document.getElementById('chipVcard');
    btnVcard.onclick = (e) => {
        e.preventDefault();
        downloadVcard(emp, settings);
    };

    // Social Links
    const socialContainer = document.getElementById('cardSocialIcons');
    socialContainer.innerHTML = `
        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a href="mailto:${emp.email}" aria-label="E-posta">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </a>
    `;

    // SMART OFFBOARDING LOGIC (Inactive Card Check)
    const inactiveOverlay = document.getElementById('inactiveOverlay');
    const inactiveReason = document.getElementById('inactiveReasonText');
    const btnRedirect = document.getElementById('btnInactiveRedirect');

    if (emp.status === 'inactive') {
        inactiveOverlay.style.display = 'flex';
        
        if (settings.offboardMode === 'redirect_website') {
            inactiveReason.textContent = 'Bu çalışan şirketimizden ayrılmıştır. Otomatik olarak şirket ana sayfasına yönlendiriliyorsunuz...';
            setTimeout(() => {
                window.location.href = settings.companyWebsite;
            }, 2500);
        } else if (settings.offboardMode === 'hr_contact') {
            inactiveReason.textContent = 'Bu personel kurumumuzdan ayrılmıştır. Bilgi almak için İnsan Kaynakları ile iletişime geçebilirsiniz.';
        } else {
            inactiveReason.textContent = 'Bu çalışanın dijital kartviziti şirket yönetimi tarafından pasife alınmıştır.';
        }
        btnRedirect.href = settings.companyWebsite;
    } else {
        inactiveOverlay.style.display = 'none';
    }
}

function downloadVcard(emp, settings) {
    store.incrementEmpStat(emp.id, 'downloads');
    const vcardContent = 
`BEGIN:VCARD
VERSION:3.0
FN:${emp.name}
ORG:${settings.companyName}
TITLE:${emp.title}
TEL;TYPE=CELL:${emp.phone}
EMAIL;TYPE=INTERNET:${emp.email}
NOTE:NFC Tag UID: ${emp.nfcUid} - ProCard Enterprise
END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${emp.name.replace(/\s+/g, '_')}_vCard.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================================================
   3. ADMIN DASHBOARD ENGINE
   ========================================================================== */
function initAdminDashboard() {
    initAdminTabs();
    renderAdminDashboard();

    // Add Employee Button Handler
    const btnAddEmp = document.getElementById('btnOpenAddEmployee');
    if (btnAddEmp) {
        btnAddEmp.addEventListener('click', () => {
            openEmployeeModal();
        });
    }

    // Search and Department Filter Handlers
    const searchInput = document.getElementById('empSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderEmployeesTable();
        });
    }

    const deptFilterGroup = document.getElementById('deptFilterGroup');
    if (deptFilterGroup) {
        const deptChips = deptFilterGroup.querySelectorAll('.dept-chip');
        deptChips.forEach(chip => {
            chip.addEventListener('click', function() {
                deptChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                store.activeDeptFilter = this.dataset.dept;
                renderEmployeesTable();
            });
        });
    }

    // Batch NFC Generation
    const btnBatchNfc = document.getElementById('btnGenerateBatchNfc');
    if (btnBatchNfc) {
        btnBatchNfc.addEventListener('click', () => {
            const prefix = document.getElementById('nfcPrefixInput').value.trim() || 'NFC-EREN-';
            store.batchGenerateNfc(prefix);
            renderEmployeesTable();
            populateEmployeeDropdown();
            alert('✅ Tüm çalışanlara yeni sıralı NFC Tag ID atandı!');
        });
    }

    // Export All vCards
    const btnExportAll = document.getElementById('btnExportAllVcards');
    if (btnExportAll) {
        btnExportAll.addEventListener('click', () => {
            const emps = store.getEmployees();
            const settings = store.getSettings();
            let allVcards = '';
            emps.forEach(emp => {
                allVcards += `BEGIN:VCARD\nVERSION:3.0\nFN:${emp.name}\nORG:${settings.companyName}\nTITLE:${emp.title}\nTEL:${emp.phone}\nEMAIL:${emp.email}\nEND:VCARD\n\n`;
            });
            const blob = new Blob([allVcards], { type: 'text/vcard;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', `Tum_Calisanlar_vCards.vcf`);
            link.click();
        });
    }

    // Export Leads CSV
    const btnExportCsv = document.getElementById('btnExportLeadsCsv');
    if (btnExportCsv) {
        btnExportCsv.addEventListener('click', () => {
            const leads = store.getLeads();
            let csv = 'Tarih,Musteri Ad Soyad,Telefon,E-posta,Ilgili Calisan,Not\n';
            leads.forEach(l => {
                csv += `"${l.date}","${l.name}","${l.phone}","${l.email}","${l.empName}","${l.note}"\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'Gelen_Musteri_Adaylari.csv');
            link.click();
        });
    }

    // Reset Stats
    const btnResetStats = document.getElementById('btnResetStats');
    if (btnResetStats) {
        btnResetStats.addEventListener('click', () => {
            if (confirm('Tüm görüntüleme ve vCard okutma sayılarını sıfırlamak istediğinize emin misiniz?')) {
                store.getEmployees().forEach(e => { e.views = 0; e.downloads = 0; });
                store.saveState();
                renderAnalyticsTab();
                alert('İstatistikler sıfırlandı.');
            }
        });
    }

    // Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const companyName = document.getElementById('settingCompanyName').value.trim();
            const companyWebsite = document.getElementById('settingCompanyWebsite').value.trim();
            const offboardMode = document.getElementById('settingOffboardMode').value;
            const logoUrl = document.getElementById('settingLogoUrl').value.trim() || 'images/logo.png';

            store.updateSettings({ companyName, companyWebsite, offboardMode, logoUrl });
            renderPublicCard();
            alert('⚙️ Kurumsal ayarlar başarıyla kaydedildi!');
        });
    }
}

function initAdminTabs() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const tabPanes = document.querySelectorAll('.admin-main-body .tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            this.classList.add('active');
            const targetTab = document.getElementById(this.dataset.tab);
            if (targetTab) targetTab.classList.add('active');
        });
    });
}

function renderAdminDashboard() {
    renderAnalyticsTab();
    renderEmployeesTable();
    renderLeadsTable();
    renderTemplatesTab();

    // Badges update
    const emps = store.getEmployees();
    const leads = store.getLeads();
    document.getElementById('badgeTotalEmp').textContent = emps.length;
    document.getElementById('badgeTotalLeads').textContent = leads.length;
}

function renderAnalyticsTab() {
    const emps = store.getEmployees();
    const leads = store.getLeads();

    const activeCount = emps.filter(e => e.status === 'active').length;
    const inactiveCount = emps.filter(e => e.status === 'inactive').length;
    const totalViews = emps.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalDownloads = emps.reduce((acc, curr) => acc + (curr.downloads || 0), 0);

    document.getElementById('statTotalEmp').textContent = emps.length;
    document.getElementById('statActiveEmp').textContent = activeCount;
    document.getElementById('statInactiveEmp').textContent = inactiveCount;
    document.getElementById('statTotalViews').textContent = totalViews;
    document.getElementById('statTotalDownloads').textContent = totalDownloads;
    document.getElementById('statTotalLeadCount').textContent = leads.length;

    // Leaderboard
    const leaderboardBody = document.getElementById('analyticsLeaderboardBody');
    if (!leaderboardBody) return;

    const sortedEmps = [...emps].sort((a, b) => (b.views + b.downloads) - (a.views + a.downloads));

    let html = '';
    sortedEmps.forEach((emp, index) => {
        const rankMedal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
        const statusBadge = emp.status === 'active' 
            ? '<span class="status-badge status-active">Aktif</span>'
            : '<span class="status-badge status-inactive">Pasif</span>';

        html += `
            <tr>
                <td><strong>${rankMedal}</strong></td>
                <td>
                    <div class="emp-table-user">
                        <img src="${emp.avatar}" class="table-avatar" alt="${emp.name}">
                        <div>
                            <div class="emp-name-text">${emp.name}</div>
                            <div class="emp-email-text">${emp.title}</div>
                        </div>
                    </div>
                </td>
                <td><span class="dept-pill">${emp.dept}</span></td>
                <td><strong>${emp.views || 0}</strong> okuma</td>
                <td><strong>${emp.downloads || 0}</strong> vCard</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
    leaderboardBody.innerHTML = html;
}

/* 4. EMPLOYEES TABLE WITH 1-CLICK ACTIVE/INACTIVE TOGGLE SWITCH */
function renderEmployeesTable() {
    const tbody = document.getElementById('employeesTableBody');
    if (!tbody) return;

    const query = (document.getElementById('empSearchInput')?.value || '').toLowerCase();
    const deptFilter = store.activeDeptFilter;

    let emps = store.getEmployees();

    if (deptFilter !== 'all') {
        emps = emps.filter(e => e.dept === deptFilter);
    }

    if (query) {
        emps = emps.filter(e => 
            e.name.toLowerCase().includes(query) || 
            e.title.toLowerCase().includes(query) || 
            e.nfcUid.toLowerCase().includes(query)
        );
    }

    let html = '';
    emps.forEach(emp => {
        const isChecked = emp.status === 'active' ? 'checked' : '';
        const statusText = emp.status === 'active' ? 'Aktif' : 'Pasif (Ayrıldı)';

        html += `
            <tr>
                <td>
                    <div class="emp-table-user">
                        <img src="${emp.avatar}" class="table-avatar" alt="${emp.name}">
                        <div>
                            <div class="emp-name-text">${emp.name}</div>
                            <div class="emp-email-text">${emp.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <strong>${emp.title}</strong><br>
                    <span class="dept-pill">${emp.dept}</span>
                </td>
                <td>${emp.phone}</td>
                <td><code>${emp.nfcUid}</code></td>
                <td>
                    <!-- 1-CLICK TOGGLE SWITCH FOR OFFBOARDING -->
                    <div class="status-toggle-wrapper">
                        <label class="toggle-switch">
                            <input type="checkbox" ${isChecked} onchange="handleStatusToggle('${emp.id}')">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="status-badge ${emp.status === 'active' ? 'status-active' : 'status-inactive'}">
                            ${statusText}
                        </span>
                    </div>
                </td>
                <td style="text-align: right;">
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline" onclick="previewEmployeeCard('${emp.id}')" title="Canlı Kartını Gör">👁️</button>
                        <button class="btn btn-sm btn-outline" onclick="editEmployee('${emp.id}')" title="Düzenle">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee('${emp.id}')" title="Sil">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html || '<tr><td colspan="6" class="text-center">Kayıtlı çalışan bulunamadı.</td></tr>';
}

window.handleStatusToggle = function(empId) {
    store.toggleEmployeeStatus(empId);
    renderEmployeesTable();
    renderAnalyticsTab();
    populateEmployeeDropdown();
    if (store.getSelectedEmployee()?.id === empId) {
        renderPublicCard();
    }
};

window.previewEmployeeCard = function(empId) {
    store.setSelectedEmpId(empId);
    document.getElementById('btnViewPublic').click();
};

window.editEmployee = function(empId) {
    const emp = store.getEmployees().find(e => e.id === empId);
    if (!emp) return;
    openEmployeeModal(emp);
};

window.deleteEmployee = function(empId) {
    if (confirm('Bu çalışanı silmek istediğinize emin misiniz?')) {
        store.deleteEmployee(empId);
        renderEmployeesTable();
        renderAnalyticsTab();
        populateEmployeeDropdown();
    }
};

/* LEADS CRM TABLE */
function renderLeadsTable() {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    const leads = store.getLeads();

    let html = '';
    leads.forEach(lead => {
        html += `
            <tr>
                <td>${lead.date}</td>
                <td><strong>${lead.name}</strong></td>
                <td>${lead.phone}<br><span class="text-sm">${lead.email || '-'}</span></td>
                <td><span class="dept-pill">${lead.empName}</span></td>
                <td>${lead.note || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteLead('${lead.id}')">Sil</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html || '<tr><td colspan="6" class="text-center">Henüz toplanan müşteri adayı bulunmuyor.</td></tr>';
}

window.deleteLead = function(leadId) {
    store.deleteLead(leadId);
    renderLeadsTable();
};

/* TEMPLATES TAB */
function renderTemplatesTab() {
    const grid = document.getElementById('templatesGrid');
    if (!grid) return;

    const depts = store.getDepartments();

    let html = '';
    depts.forEach(d => {
        html += `
            <div class="template-card">
                <div class="template-preview-header" style="background: linear-gradient(135deg, ${d.primaryColor}, ${d.accentColor});">
                    <span class="badge-dept-tag" style="background: #fff; color: ${d.primaryColor};">${d.name}</span>
                    <h3>${d.badge} Şablonu</h3>
                </div>
                <div class="template-body">
                    <p class="text-sm">Bu departmana atanan tüm kartvizitlerde bu renk paleti uygulanır.</p>
                    <div class="color-swatch-group">
                        <span class="color-swatch" style="background: ${d.primaryColor};" title="Ana Renk"></span>
                        <span class="color-swatch" style="background: ${d.accentColor};" title="Vurgu Renk"></span>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

/* ==========================================================================
   4. MODALS & FORMS HANDLERS
   ========================================================================== */
function initModals() {
    // Employee Modal Form
    const empForm = document.getElementById('employeeForm');
    if (empForm) {
        empForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const empData = {
                id: document.getElementById('empFormId').value,
                name: document.getElementById('empFormName').value.trim(),
                title: document.getElementById('empFormTitle').value.trim(),
                dept: document.getElementById('empFormDept').value,
                nfcUid: document.getElementById('empFormNfc').value.trim(),
                phone: document.getElementById('empFormPhone').value.trim(),
                email: document.getElementById('empFormEmail').value.trim(),
                avatar: document.getElementById('empFormAvatar').value.trim(),
                bio: document.getElementById('empFormBio').value.trim(),
                status: document.getElementById('empFormStatus').value
            };

            store.addOrUpdateEmployee(empData);
            closeModal('employeeModal');
            renderEmployeesTable();
            renderAnalyticsTab();
            populateEmployeeDropdown();
            renderPublicCard();
        });
    }

    // Lead Capture Form
    const btnOpenLead = document.getElementById('btnOpenLeadForm');
    const chipShareLead = document.getElementById('chipShareLead');
    
    if (btnOpenLead) btnOpenLead.onclick = () => openModal('leadCaptureModal');
    if (chipShareLead) chipShareLead.onclick = () => openModal('leadCaptureModal');

    const leadForm = document.getElementById('leadCaptureForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentEmp = store.getSelectedEmployee();
            const leadData = {
                name: document.getElementById('leadName').value.trim(),
                phone: document.getElementById('leadPhone').value.trim(),
                email: document.getElementById('leadEmail').value.trim(),
                note: document.getElementById('leadNote').value.trim(),
                empId: currentEmp ? currentEmp.id : 'emp-101',
                empName: currentEmp ? currentEmp.name : 'Genel'
            };

            store.addLead(leadData);

            const feedback = document.getElementById('leadFormFeedback');
            feedback.className = 'form-message success';
            feedback.textContent = '✅ Bilgileriniz başarıyla gönderildi! Teşekkür ederiz.';
            feedback.style.display = 'block';

            setTimeout(() => {
                leadForm.reset();
                feedback.style.display = 'none';
                closeModal('leadCaptureModal');
                renderLeadsTable();
            }, 1800);
        });
    }

    // NFC Simulator Trigger Modal
    const btnNfcSim = document.getElementById('btnNfcSimulator');
    if (btnNfcSim) btnNfcSim.onclick = () => openModal('nfcScanModal');

    const btnTriggerNfc = document.getElementById('btnTriggerNfcTap');
    if (btnTriggerNfc) {
        btnTriggerNfc.onclick = () => {
            const selectId = document.getElementById('nfcSimSelectEmp').value;
            store.setSelectedEmpId(selectId);
            closeModal('nfcScanModal');
            document.getElementById('btnViewPublic').click();
            alert('📲 NFC Kart Okutuldu! Çalışan Kartviziti Açılıyor...');
        };
    }

    // Printable Badge Modal Trigger
    const btnPreviewBadge = document.getElementById('btnPreviewBadgeModal');
    if (btnPreviewBadge) {
        btnPreviewBadge.onclick = () => {
            const empId = document.getElementById('badgeSelectEmp').value;
            const emp = store.getEmployees().find(e => e.id === empId) || store.getSelectedEmployee();
            const settings = store.getSettings();

            document.getElementById('badgeCompTitle').textContent = settings.companyName.toUpperCase();
            document.getElementById('badgeName').textContent = emp.name;
            document.getElementById('badgeTitle').textContent = emp.title;
            document.getElementById('badgeDept').textContent = emp.dept.toUpperCase();
            document.getElementById('badgeNfcCode').textContent = emp.nfcUid;
            document.getElementById('badgePhoto').src = emp.avatar;

            openModal('badgePrintModal');
        };
    }

    // Modal Close Buttons
    document.querySelectorAll('.modal-close, #btnCancelEmpModal, #btnCancelLeadModal, #btnCloseNfcModal, #btnCancelBadgeModal')
        .forEach(btn => {
            btn.onclick = (e) => {
                const modal = e.target.closest('.modal-backdrop');
                if (modal) modal.style.display = 'none';
            };
        });
}

function openEmployeeModal(emp = null) {
    document.getElementById('empModalTitle').textContent = emp ? 'Çalışan Bilgilerini Düzenle' : 'Yeni Çalışan Ekle';
    document.getElementById('empFormId').value = emp ? emp.id : '';
    document.getElementById('empFormName').value = emp ? emp.name : '';
    document.getElementById('empFormTitle').value = emp ? emp.title : '';
    document.getElementById('empFormDept').value = emp ? emp.dept : 'Yönetim';
    document.getElementById('empFormNfc').value = emp ? emp.nfcUid : '';
    document.getElementById('empFormPhone').value = emp ? emp.phone : '';
    document.getElementById('empFormEmail').value = emp ? emp.email : '';
    document.getElementById('empFormAvatar').value = emp ? emp.avatar : '';
    document.getElementById('empFormBio').value = emp ? emp.bio || '' : '';
    document.getElementById('empFormStatus').value = emp ? emp.status : 'active';

    openModal('employeeModal');
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}
