// import AOS from 'aos';
import VanillaTilt from 'vanilla-tilt';
import mapUkraine from "./region.js";

// AOS.init()


const svg = document.querySelectorAll('.map>svg g')

mapUkraine.forEach(item => {
    svg.forEach(element => {
        element.addEventListener('click', (e) => {
            const elemId = parseInt(element.getAttribute('id'))
            if (item.id === elemId) {
                let regions = document.querySelector('.regions')
                if (regions !== null) {
                    regions.remove();
                }
                element.classList.add('active')
                document.querySelector('main').insertAdjacentHTML('beforeend', `
                <div class="regions">
                    <button class="regions_close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g id="close">
                        <path id="x" d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"/>
                    </g>
                </svg></button>
                    <div class="regions_container">
                        <div class="region_left">
                            <h3> ${item.title}</h3>
                            <div class="region_description"> ${item.decription}</div>
                            <p class="region_center">Region center: <span>${item.center}</span></p>
                            <div class="region_coordinates">
                                <p>Latitude: <span>${item.coordinates.latitude}</span></p>
                                <p>Longitude: <span>${item.coordinates.longitude}</span></p>
                            </div>
                            <a href="${item.link}" target="_blank">Read on Wiki</a>
                        </div>
                        <div class="region_right" data-tilt>
                            ${item.image}
                        </div>
                    </div>
                </div>
                `)

                regions = document.querySelector('.regions')
                regions.classList.add('active')

                const closeBtn = document.querySelector('.regions_close')
                if (closeBtn !== null) {
                    closeBtn.addEventListener('click', () => {
                        regions.remove()
                        element.classList.remove('active')
                    })
                    document.addEventListener('keydown', function (e) {
                        if (e.keyCode === 27) regions.remove()
                        element.classList.remove('active')
                    });
                    const rightTilt = document.querySelector(".region_right");
                    VanillaTilt.init(rightTilt);
                    const regionCityBtn = document.querySelector('.region_center span')
                    const regionCity = document.querySelector('.region_city')
                    if(regionCity){
                        regionCityBtn.addEventListener('click', ()=>{
                            regionCityBtn.classList.toggle('active')
                            regionCity.classList.toggle('active')
                        })
                    }
                }
            }
        })
    });

});


