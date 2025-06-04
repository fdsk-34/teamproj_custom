  document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('login-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const email = form.email.value;
                const password = form.password.value;
                const confirmDiv = document.getElementById('login-confirm');
                const storedData = JSON.parse(sessionStorage.getItem('latestRegistration') || '{}');
                
                if (storedData.email === email && storedData.password === password) {
                    confirmDiv.textContent = '로그인 성공!';
                    confirmDiv.className = 'success';
                } else {
                    confirmDiv.textContent = '이메일 또는 비밀번호가 잘못되었습니다.';
                    confirmDiv.className = 'error';
                }
                form.reset();
            });
        });