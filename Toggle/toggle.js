let active = {};

function toggle(toggle) {
    active[toggle.id] = !active[toggle.id];
    toggle.classList.toggle('active');
    console.log(`Toggle ${toggle.id} is ${active[toggle.id] ? 'ON' : 'OFF'}`);
}