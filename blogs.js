//for the navigation
const nav = document.querySelector('.nav')
const scrollWatcher = document.createElement('div');
svg
scrollWatcher.setAttribute('data-scroll-watcher', '');
nav.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries) =>{
    nav.classList.toggle('sticking', !entries[0].isIntersecting)
});

navObserver.observe(scrollWatcher)


function reorderSections() {
    const container = document.querySelector('.container-1');
    const sections = Array.from(container.querySelectorAll('section'));

    if (window.innerWidth <= 900) {
      sections.sort((a, b) => {
        const aOrder = parseInt(a.id.replace('section-', ''));
        const bOrder = parseInt(b.id.replace('section-', ''));
        return aOrder - bOrder;
      });

      sections.forEach((section) => {
        container.appendChild(section);
      });
    } else {
      sections.forEach((section) => {
        container.insertBefore(section, container.firstChild);
      });
    }
  }

  window.addEventListener('load', reorderSections);
  window.addEventListener('resize', reorderSections);