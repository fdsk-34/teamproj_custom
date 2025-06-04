   let map, service, markers = [];
            function initMap() {
                map = new google.maps.Map(document.getElementById('map'), { center: { lat: 37.5665, lng: 126.9780 }, zoom: 13 });
                service = new google.maps.places.PlacesService(map);
            }

            document.getElementById('address-input').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') document.getElementById('search-btn').click();
            });


            function clearMarkers() { markers.forEach(m => m.setMap(null)); markers = []; }
            document.getElementById('search-btn').addEventListener('click', () => {
                const q = document.getElementById('address-input').value;
                clearMarkers();
                service.textSearch({ query: q + ' 카페' }, (res, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) displayStores(res);
                });
            });
            function displayStores(places) {
                const bounds = new google.maps.LatLngBounds();
                const listEl = document.getElementById('store-list'); listEl.innerHTML = '';
                places.forEach(p => {
                    const m = new google.maps.Marker({ map, position: p.geometry.location }); markers.push(m);
                    bounds.extend(m.getPosition());
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${p.name}</strong><br>${p.formatted_address}`;
                    li.onclick = () => map.panTo(m.getPosition());
                    listEl.appendChild(li);
                });
                map.fitBounds(bounds);
            }
            window.initMap = initMap;