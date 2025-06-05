var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
    return cell !== '' && cell != null;
}
function loadFileData(filename) {
    if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
        try {
            var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];

            // Convert sheet to JSON to filter blank rows
            var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
            // Filter out blank rows (rows where all cells are empty, null, or undefined)
            var filteredData = jsonData.filter(row => row.some(filledCell));

            // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
            var headerRowIndex = filteredData.findIndex((row, index) =>
                row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
            );
            // Fallback
            if (headerRowIndex === -1 || headerRowIndex > 25) {
                headerRowIndex = 0;
            }

            // Convert filtered JSON back to CSV
            var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
            csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
            return csv;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    return gk_fileData[filename] || "";
}

let posts = JSON.parse(localStorage.getItem('posts')) || [];
let currentPage = 1;
const postsPerPage = 10;

// posts의 views 기본값 설정 및 데이터 검증
posts = posts.map(post => ({
    ...post,
    id: String(post.id), // ID를 문자열로 보장
    views: post.views || 0,
    title: post.title || '제목 없음',
    author: post.author || '익명',
    createdAt: post.createdAt || new Date().toISOString()
}));
localStorage.setItem('posts', JSON.stringify(posts));
console.log('Posts loaded:', posts); // 디버깅: 초기 posts 데이터

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
                <td><a href="07_teamproj_board_view.html?id=${encodeURIComponent(post.id)}">${post.title}</a></td>
                <td>${post.author}</td>
                <td>${new Date(post.createdAt).toLocaleDateString('ko-KR')}</td>
                <td>${post.views || 0}</td>
            `;
        tbody.appendChild(row);
    });

    updatePagination(filteredPosts.length);
    console.log('Displayed posts:', paginatedPosts); // 디버깅: 표시된 게시글
}

function updatePagination(totalPosts) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === currentPage;
        button.onclick = () => {
            currentPage = i;
            displayPosts();
        };
        pagination.appendChild(button);
    }
    console.log('Pagination updated, total pages:', totalPages); // 디버깅: 페이지네이션
}

function searchPosts() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    const filteredPosts = posts.filter(post =>
        (post.title || '').toLowerCase().includes(query) ||
        (post.author || '').toLowerCase().includes(query)
    );
    currentPage = 1;
    displayPosts(filteredPosts);
    console.log('Search query:', query, 'Filtered posts:', filteredPosts); // 디버깅: 검색 결과
}

// Enter 키로 검색
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchPosts();
    }
});

// 초기 게시글 표시
displayPosts();

function savePost() {
    const title = document.getElementById('post-title').value.trim();
    const author = document.getElementById('post-author').value.trim();
    const password = document.getElementById('post-password').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (!title || !author || !password || !content) {
        alert('제목, 작성자, 삭제 암호, 내용을 모두 입력해주세요.');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = {
        id: Date.now().toString(),
        title,
        author,
        password, // 암호 저장
        content,
        createdAt: new Date().toISOString(),
        views: 0
    };

    posts.unshift(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    console.log('Post saved:', post);
    console.log('All posts:', posts);
    alert('게시글이 작성되었습니다.');
    location.href = '07_teamproj_board.html';
}

function cancelWrite() {
    location.href = '07_teamproj_board.html';
}