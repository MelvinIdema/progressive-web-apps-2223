if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((reg) => {
                console.log('Service worker registered within scope:', reg.scope);
            })
            .catch((err) => {
                console.log('Service worker registration failed.', err);
            })
    })
}