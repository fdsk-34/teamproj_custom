
// 전역 변수
let currentPage = 1;
const postsPerPage = 3; // 기존 HTML/CSS와 일치하도록 3으로 설정

// localStorage에서 게시글 로드 및 기본값 설정
let posts = JSON.parse(localStorage.getItem('posts')) || [];
posts = posts.map(post => ({
    id: String(post.id || Date.now()), // ID 보장
    title: post.title || '제목 없음',
    author: post.author || '익명',
    content: post.content || '',
    password: post.password || '',
    createdAt: post.createdAt || new Date().toISOString(),
    views: post.views || 0
}));
localStorage.setItem('posts', JSON.stringify(posts));

// 게시글 표시
function displayPosts(filteredPosts = posts) {
    const tbody = document.getElementById('board-body');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, end);

    paginatedPosts.forEach((post, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td><a href="board_view.html?id=${encodeURIComponent(post.id)}">${post.title}</a></td>
            <td>${post.author}</td>
            <td>${new Date(post.createdAt).toLocaleDateString('ko-KR')}</td>
            <td>${post.views || 0}</td>
        `;
        tbody.appendChild(row);
    });

    updatePagination(filteredPosts.length);
}

// 페이지네이션 업데이트
function updatePagination(totalPosts) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalPosts / postsPerPage);

    // 이전 버튼
    const prevButton = document.createElement('button');
    prevButton.textContent = '이전';
    prevButton.id = 'prev-btn';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = prevPage;
    pagination.appendChild(prevButton);

    // 현재 페이지 버튼
    const currentButton = document.createElement('button');
    currentButton.textContent = currentPage;
    currentButton.className = 'current-page';
    currentButton.disabled = true;
    pagination.appendChild(currentButton);

    // 다음 버튼
    const nextButton = document.createElement('button');
    nextButton.textContent = '다음';
    nextButton.id = 'next-btn';
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.onclick = nextPage;
    pagination.appendChild(nextButton);
}

// 페이지 이동
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
}

function nextPage() {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
        currentPage++;
        displayPosts();
    }
}

// 검색 기능 (제목, 작성자, 내용 검색)
function searchPosts() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const filteredPosts = posts.filter(post =>
        (post.title || '').toLowerCase().includes(query) ||
        (post.author || '').toLowerCase().includes(query) ||
        (post.content || '').toLowerCase().includes(query)
    );
    currentPage = 1;
    displayPosts(filteredPosts);
}

// Enter 키로 검색
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchPosts();
    }
});

// 글쓰기 저장
function savePost() {
    const title = document.getElementById('post-title').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const password = document.getElementById('post-password').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (!title || !author || !password || !content) {
        alert('제목, 작성자, 삭제 암호, 내용을 모두 입력해주세요.');
        return;
    }

    const post = {
        id: Date.now().toString(),
        title,
        author,
        password,
        content,
        createdAt: new Date().toISOString(),
        views: 0
    };

    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    alert('게시글이 작성되었습니다.');
    location.href = 'board.html';
}

// 글쓰기 취소
function cancelWrite() {
    location.href = 'board.html';
}

// 초기 게시글 표시
displayPosts();

/* XLSX 관련 코드(현재 사용되지 않음, 필요 시 활성화)
function filledCell(cell) {
}

function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            var filteredData = jsonData.filter(row => row.some(filledCell));
            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }
            var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });/return csv;} catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}*/
