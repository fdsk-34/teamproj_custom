let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
let currentPage = 1;
const announcementsPerPage = 10;

announcements = announcements.map(announcement => ({
    ...announcement,
    id: String(announcement.id),
    views: announcement.views || 0,
    title: announcement.title || '제목 없음',
    author: announcement.author || '관리자',
    createdAt: announcement.createdAt || new Date().toISOString()
}));
localStorage.setItem('announcements', JSON.stringify(announcements));
console.log('Announcements loaded:', announcements);

function displayAnnouncements(filteredAnnouncements = announcements) {
    const tbody = document.getElementById('announcement-body');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * announcementsPerPage;
    const end = start + announcementsPerPage;
    const paginatedAnnouncements = filteredAnnouncements.slice(start, end);

    paginatedAnnouncements.forEach((announcement, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td><a href="07_teamproj_notice_view.html?id=${encodeURIComponent(announcement.id)}">${announcement.title}</a></td>
            <td>${announcement.author}</td>
            <td>${new Date(announcement.createdAt).toLocaleDateString('ko-KR')}</td>
            <td>${announcement.views || 0}</td>
        `;
        tbody.appendChild(row);
    });

    updatePagination(filteredAnnouncements.length);
    console.log('Displayed announcements:', paginatedAnnouncements);
}

function updatePagination(totalAnnouncements) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalAnnouncements / announcementsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === currentPage;
        button.onclick = () => {
            currentPage = i;
            displayAnnouncements();
        };
        pagination.appendChild(button);
    }
    console.log('Pagination updated, total pages:', totalPages);
}

function searchAnnouncements() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const filteredAnnouncements = announcements.filter(announcement =>
        (announcement.title || '').toLowerCase().includes(query) ||
        (announcement.author || '').toLowerCase().includes(query)
    );
    currentPage = 1;
    displayAnnouncements(filteredAnnouncements);
    console.log('Search query:', query, 'Filtered announcements:', filteredAnnouncements);
}

document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchAnnouncements();
    }
});

displayAnnouncements();