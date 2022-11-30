document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('time').forEach(time => {
    const datetime = luxon.DateTime.fromISO(time.getAttribute('datetime'))
    time.innerText = datetime.toRelative()
  });
}, false);