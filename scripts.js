let allData = [];
let currentProject = null;

document.addEventListener('DOMContentLoaded', () => {
    fetch('links.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
        })
        .catch(error => console.error('Error loading links:', error));
});

function returnToLanding() {
    currentProject = null;
    document.getElementById('view-landing').classList.remove('hidden');
    document.getElementById('view-landing').classList.add('flex');
    document.getElementById('view-project').classList.add('hidden');
}

function selectProject(project) {
    currentProject = project;

    // Update UI elements
    document.getElementById('project-title-span').innerText = project;

    // Switch views
    document.getElementById('view-landing').classList.add('hidden');
    document.getElementById('view-landing').classList.remove('flex');
    document.getElementById('view-project').classList.remove('hidden');

    // Render sections for this project
    renderTopsideSection(project);
    renderListSection('sop', project, 'sop-list');
    renderListSection('special_studies', project, 'studies-list');

    // Default to topside tab
    switchProjectTab('topside');
}

function switchProjectTab(tab) {
    const viewTopside = document.getElementById('view-topside');
    const viewSop = document.getElementById('view-sop');
    const viewStudies = document.getElementById('view-studies');

    const btnTopside = document.getElementById('tab-topside');
    const btnSop = document.getElementById('tab-sop');
    const btnStudies = document.getElementById('tab-studies');

    // Reset all buttons
    [btnTopside, btnSop, btnStudies].forEach(btn => {
        btn.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100";
    });

    // Hide all views
    viewTopside.classList.add('hidden');
    viewSop.classList.add('hidden');
    viewStudies.classList.add('hidden');

    if (tab === 'topside') {
        viewTopside.classList.remove('hidden');
        btnTopside.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-brand-500 text-white shadow-md";
    } else if (tab === 'sop') {
        viewSop.classList.remove('hidden');
        btnSop.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-brand-500 text-white shadow-md";
    } else if (tab === 'studies') {
        viewStudies.classList.remove('hidden');
        btnStudies.className = "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-brand-500 text-white shadow-md";
    }
}

function renderTopsideSection(project) {
    const container = document.getElementById('topside-section');
    const wrapper = document.getElementById('topside-section-wrapper');

    container.innerHTML = ''; // Clear existing

    // Filter topside models that belong to the current project
    const topsideData = allData.topside || [];
    const filteredData = topsideData.filter(item => item.projects && item.projects[project]);

    if (filteredData.length > 0) {
        wrapper.classList.remove('hidden');
        filteredData.forEach(item => {
            const card = createTopsideCard(item, project);
            container.appendChild(card);
        });
    } else {
        wrapper.classList.add('hidden');
    }
}

function renderListSection(dataKey, project, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing

    const listData = allData[dataKey] || [];
    const filteredData = listData.filter(item => item.projects && item.projects[project]);

    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            const el = document.createElement('div');
            el.className = 'drill-down-item p-4 border-b border-slate-100 last:border-b-0 cursor-pointer flex items-center justify-between group';

            const url = item.projects[project].url || '#';

            el.onclick = () => window.open(url, '_blank');

            el.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                        <i class="fa-solid ${dataKey === 'sop' ? 'fa-file-lines' : 'fa-flask'}"></i>
                    </div>
                    <div>
                        <h4 class="text-sm font-bold text-slate-800 group-hover:text-brand-600 transition-colors">${item.title}</h4>
                        <p class="text-xs text-slate-500 line-clamp-1">${item.description || 'View document'}</p>
                    </div>
                </div>
                <div class="text-slate-400 group-hover:text-brand-500 transition-colors">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
            `;
            container.appendChild(el);
        });
    } else {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fa-solid fa-folder-open text-4xl text-slate-300 mb-3"></i>
                <p class="text-slate-500">No records found for ${project}</p>
            </div>
        `;
    }
}

function createTopsideCard(item, project) {
    const div = document.createElement('div');
    div.className = `model-card glass-card rounded-2xl overflow-hidden group relative flex flex-col min-h-[280px]`;

    const imagePath = item.filename ? `images/${item.filename}` : `images/${item.image || 'placeholder.png'}`;
    const projectData = item.projects[project] || {};

    div.innerHTML = `
        <!-- Image Container -->
        <div class="relative h-48 w-full overflow-hidden bg-slate-100 cursor-pointer rounded-t-2xl border-b border-slate-100" onclick="openModal('${item.title}', '${project}')">
            <img src="${imagePath}" alt="${item.title}"
                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 onerror="handleImageError(this)">

            <!-- Share Button -->
            <button onclick="handleShare(event, '${item.title}')" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-white hover:bg-brand-500 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 shadow-sm">
                <i class="fa-solid fa-share-nodes text-xs"></i>
            </button>
        </div>

        <!-- Content -->
        <div class="p-6 flex flex-col flex-grow cursor-pointer bg-white" onclick="openModal('${item.title}', '${project}')">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                    ${item.title}
                </h3>
                <span class="text-brand-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </span>
            </div>

            <p class="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
                ${item.description || '3D visualization and technical information.'}
            </p>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <div class="flex flex-col gap-1">
                    <span class="text-slate-500 uppercase tracking-wider font-bold">TOPSIDE</span>
                    <span class="text-slate-400 text-[10px] uppercase">${projectData.city || 'N/A'}</span>
                </div>
                <button class="px-3 py-1.5 rounded-md bg-brand-50 text-brand-600 font-bold border border-brand-100 hover:bg-brand-500 hover:text-white transition-colors duration-300">VIEW</button>
            </div>
        </div>
    `;

    return div;
}

// MODAL LOGIC
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalPanel = document.getElementById('modal-panel');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const modalFooter = document.getElementById('modal-footer');

function openModal(title, project) {
    const topsideData = allData.topside || [];
    const item = topsideData.find(d => d.title === title);
    if (!item) return;

    modal.classList.remove('hidden');

    // Animate in
    setTimeout(() => {
        modalBackdrop.classList.add('modal-show-backdrop');
        modalPanel.classList.add('modal-show-panel');
    }, 10);

    modalTitle.innerText = item.title;

    const imagePath = item.filename ? `images/${item.filename}` : `images/${item.image || 'placeholder.png'}`;
    const projectData = item.projects[project] || {};
    const loc = projectData.city ? `${projectData.city}, ${projectData.country || ''}` : 'Location N/A';

    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="aspect-video w-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner group">
                <img src="${imagePath}" class="w-full h-full object-cover"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="hidden absolute inset-0 items-center justify-center bg-slate-100">
                     <i class="fa-solid fa-cube text-6xl text-slate-300"></i>
                </div>

                <!-- 3D VIEWER READY OVERLAY -->
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onclick="window.open('${item.options?.[0]?.url || projectData.acc_url || '#'}', '_blank')" class="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300">
                        <i class="fa-solid fa-play text-xl ml-1"></i>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span class="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Technical Description</span>
                    <p class="text-sm text-slate-700 leading-relaxed">
                        ${item.description || '3D visualization and technical information.'}
                    </p>
                </div>
                <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span class="block text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Project Details</span>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">${project}</div>
                            <div class="text-xs">
                                <span class="text-slate-500 block">Construction Site</span>
                                <span class="text-slate-800 font-medium">${loc}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-4">
                <i class="fa-solid fa-circle-info text-amber-500 mt-1"></i>
                <div>
                    <h4 class="text-sm font-bold text-amber-800 mb-1 font-display">Information & Access</h4>
                    <p class="text-xs text-amber-700 leading-relaxed mb-1">
                        ${item.disclaimer || 'Access may require Autodesk Construction Cloud license.'}
                    </p>
                </div>
            </div>
        </div>
    `;

    let buttonsHtml = '';

    // Add ACC button if exists
    if (projectData.acc_url) {
        buttonsHtml += `
            <a href="${projectData.acc_url}" target="_blank" class="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-indigo-500 sm:ml-3 sm:w-auto transition-all active:scale-95 uppercase tracking-wide">
                <i class="fa-solid fa-cloud mr-2 mt-0.5"></i> ACC
            </a>
        `;
    }

    // Add Fusion button if exists
    if (projectData.fusion_url) {
        buttonsHtml += `
            <a href="${projectData.fusion_url}" target="_blank" class="inline-flex w-full justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-500 sm:ml-3 sm:w-auto transition-all active:scale-95 uppercase tracking-wide">
                <i class="fa-solid fa-play mr-2 mt-0.5"></i> Play 3D (Fusion)
            </a>
        `;
    }

    // Fallback options
    if (buttonsHtml === '' && item.options && item.options.length > 0) {
        item.options.forEach(opt => {
            buttonsHtml += `
                <a href="${opt.url}" target="_blank" class="inline-flex w-full justify-center rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-brand-500 sm:ml-3 sm:w-auto transition-all active:scale-95 uppercase tracking-wide">
                    ${opt.label === 'Fusion 360' ? '<i class="fa-solid fa-play mr-2 mt-0.5"></i> Play 3D' : opt.label}
                </a>
            `;
        });
    }

    modalFooter.innerHTML = `
        <div class="flex flex-col sm:flex-row-reverse w-full gap-2 sm:gap-0">
            ${buttonsHtml}
            <button type="button" onclick="closeModal()" class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-all uppercase tracking-wide">
                Close
            </button>
        </div>
    `;
}

function closeModal() {
    modalBackdrop.classList.remove('modal-show-backdrop');
    modalPanel.classList.remove('modal-show-panel');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

modalBackdrop.addEventListener('click', closeModal);

function handleImageError(img) {
    const container = img.parentElement;
    container.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
            <i class="fa-solid fa-cube text-4xl mb-2"></i>
            <span class="text-[10px] uppercase tracking-widest opacity-70 font-bold">Preview Unavailable</span>
        </div>
    `;
}

// SHARE LOGIC
function handleShare(event, title) {
    event.stopPropagation();
    const shareUrl = window.location.origin + window.location.pathname + '#' + encodeURIComponent(title);

    if (navigator.share) {
        navigator.share({
            title: '3D Model - ' + title,
            url: shareUrl
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}
