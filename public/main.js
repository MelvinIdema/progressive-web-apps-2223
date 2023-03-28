if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered within scope:', reg.scope);
                reg.update()
            })
            .catch((err) => {
                console.log('Service worker registration failed.', err);
            })
    })
}

function updateOfflineMessage() {
    const offlineMessage = document.getElementById('noInternetMsg');
    if (!navigator.onLine) {
        offlineMessage.classList.remove('hidden');
    } else {
        offlineMessage.classList.add('hidden');
    }
}

window.addEventListener('load', updateOfflineMessage);
window.addEventListener('online', updateOfflineMessage);
window.addEventListener('offline', updateOfflineMessage);

document.querySelector('#noInternetMsg button').addEventListener('click', () => {
    document.getElementById('noInternetMsg').classList.add('hidden');
})