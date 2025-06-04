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
    const title = document.getElementById('post-title').value;
    const author = document.getElementById('post-author').value;
    const password = document.getElementById('post-password').value;
    const content = document.getElementById('post-content').value;

    // 모든 입력 필드가 비어있는지 확인
    if (!title && !author && !password && !content) {
        window.location.href = './07_teamproj_board.html';
    } else {
        // 입력된 데이터가 있을 경우 확인 메시지 표시
        if (confirm('입력한 내용이 저장되지 않습니다. 취소하고 이동하시겠습니까?')) {
            window.location.href = './07_teamproj_board.html';
        }
    }
}         