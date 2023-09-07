const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navBarLinks = document.getElementsByClassName('navItems')[0]
const navi = document.getElementsByClassName('nav')[0]


toggleButton.addEventListener('click', () => {
    navBarLinks.classList.toggle('activated');
    navi.classList.toggle('activated');
  });