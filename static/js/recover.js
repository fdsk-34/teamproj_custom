
        function recoverAccount() {
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const resultDiv = document.getElementById('recoverResult');
            const storedData = JSON.parse(sessionStorage.getItem('latestRegistration') || '{}');

            if (!name || !phone) {
                resultDiv.textContent = '모든 필드를 입력해주세요.';
                resultDiv.className = 'recover-result error';
                return;
            }

            if (storedData.name === name && storedData.phone === phone) {
                resultDiv.textContent = `아이디: ${storedData.email} (비밀번호 재설정 링크가 이메일로 전송되었습니다.)`;
                resultDiv.className = 'recover-result success';
            } else {
                resultDiv.textContent = '일치하는 회원 정보가 없습니다.';
                resultDiv.className = 'recover-result error';
            }

            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Clear result on page load
            document.getElementById('recoverResult').textContent = '';
        });
   