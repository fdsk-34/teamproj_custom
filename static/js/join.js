   function initAutocomplete() {
            const autocomplete = new google.maps.places.Autocomplete(
                document.getElementById('address-input'),
                { types: ['address'], componentRestrictions: { country: 'kr' } }
            );
        }

        document.addEventListener('DOMContentLoaded', () => {
            initAutocomplete();
            document.getElementById('register-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const data = {
                    name: form.name.value,
                    email: form.email.value,
                    password: form.password.value,
                    phone: form.phone.value,
                    address: form.address.value
                };
                sessionStorage.setItem('latestRegistration', JSON.stringify(data));
                document.getElementById('register-confirm').textContent = '회원가입이 완료되었습니다!';
                form.reset();
            });
        });