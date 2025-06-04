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

          const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        let posts = JSON.parse(localStorage.getItem('posts')) || [];

        console.log('Post ID from URL:', postId);
        console.log('Posts loaded:', posts);

        posts = posts.map(post => ({
            ...post,
            id: String(post.id),
            views: post.views || 0,
            password: post.password || ''
        }));
        localStorage.setItem('posts', JSON.stringify(posts));

        function loadPost() {
            if (!postId) {
                document.getElementById('post-details').innerHTML = '<p>잘못된 게시글 ID입니다.</p>';
                console.log('Error: No postId provided');
                return;
            }

            const post = posts.find(p => p.id === postId || p.id === String(postId));
            console.log('Found post:', post);

            if (!post) {
                document.getElementById('post-details').innerHTML = '<p>게시글을 찾을 수 없습니다. 게시글이 삭제되었거나 존재하지 않습니다.</p>';
                console.log('Error: Post not found for ID', postId);
                return;
            }

            post.views = (post.views || 0) + 1;
            localStorage.setItem('posts', JSON.stringify(posts));
            console.log('Updated post with views:', post);

            document.getElementById('post-details').innerHTML = `
                <label for="post-title">제목</label>
                <input type="text" id="post-title" value="${post.title || '제목 없음'}" readonly>
                <label for="post-author">작성자</label>
                <input type="text" id="post-author" value="${post.author || '익명'}" readonly>
                <label for="post-date">작성일</label>
                <input type="text" id="post-date" value="${new Date(post.createdAt).toLocaleDateString('ko-KR')}" readonly>
                <label for="post-views">조회수</label>
                <input type="text" id="post-views" value="${post.views || 0}" readonly>
                <label for="post-content">내용</label>
                <textarea id="post-content" readonly>${post.content || ''}</textarea>
            `;
        }

        function openDeleteAuth() {
            document.getElementById('modal-overlay').style.display = 'block';
            document.getElementById('delete-auth-panel').classList.add('open');
            document.getElementById('delete-password').value = '';
        }

        function closeDeleteAuth() {
            document.getElementById('modal-overlay').style.display = 'none';
            document.getElementById('delete-auth-panel').classList.remove('open');
        }

        function verifyAndDelete() {
            const inputPassword = document.getElementById('delete-password').value.trim();
            if (!inputPassword) {
                alert('암호를 입력해주세요.');
                return;
            }

            const post = posts.find(p => p.id === postId || p.id === String(postId));
            if (!post) {
                alert('게시글을 찾을 수 없습니다.');
                closeDeleteAuth();
                return;
            }

            if (post.password !== inputPassword) {
                alert('암호가 일치하지 않습니다.');
                return;
            }

            if (!confirm('게시글을 삭제하시겠습니까?')) return;

            posts = posts.filter(p => p.id !== postId && p.id !== String(postId));
            localStorage.setItem('posts', JSON.stringify(posts));
            console.log('Post deleted, remaining posts:', posts);
            alert('게시글이 삭제되었습니다.');
            closeDeleteAuth();
            location.href = '07_teamproj_board.html';
        }

        function closePost() {
            location.href = '07_teamproj_board.html';
        }

        loadPost();