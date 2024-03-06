document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('time:not(.dt-start):not(.dt-end)').forEach(time => {
    const datetime = luxon.DateTime.fromISO(time.getAttribute('datetime'))
    time.innerText = datetime.toRelative()
  });
}, false);