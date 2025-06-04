const ADMIN_PASSWORD = 'admin123';

function saveAnnouncement() {
    const adminPassword = document.getElementById('admin-password').value.trim();
    const title = document.getElementById('announcement-title').value.trim();
    const author = document.getElementById('announcement-author').value.trim();
    const content = document.getElementById('announcement-content').value.trim();

    if (adminPassword !== ADMIN_PASSWORD) {
        alert('관리자 암호가 올바르지 않습니다.');
        return;
    }

    if (!title || !author || !content) {
        alert('제목, 작성자, 내용을 모두 입력해주세요.');
        return;
    }

    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const announcement = {
        id: Date.now().toString(),
        title,
        author,
        password: adminPassword,
        content,
        createdAt: new Date().toISOString(),
        views: 0
    };

    announcements.unshift(announcement);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    console.log('Announcement saved:', announcement);
    console.log('All announcements:', announcements);
    alert('공지사항이 작성되었습니다.');
    location.href = '07_teamproj_notice.html';
}

function cancelWrite() {
    const adminPassword = document.getElementById('admin-password').value;
    const title = document.getElementById('announcement-title').value;
    const author = document.getElementById('announcement-author').value;
    const content = document.getElementById('announcement-content').value;

    if (!adminPassword && !title && !author && !content) {
        window.location.href = './07_teamproj_notice.html';
    } else {
        if (confirm('입력한 내용이 저장되지 않습니다. 취소하고 이동하시겠습니까?')) {
            window.location.href = './07_teamproj_notice.html';
        }
    }
}