//for the navigation
const nav = document.querySelector('.nav')
const scrollWatcher = document.createElement('div');


scrollWatcher.setAttribute('data-scroll-watcher', '');
nav.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries) =>{
    nav.classList.toggle('sticking', !entries[0].isIntersecting)
});

navObserver.observe(scrollWatcher)

