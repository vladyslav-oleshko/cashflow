const StorageController = (() => {

    const storageKey = 'transactionsInStorage';

    return {
        save: (data) => localStorage.setItem(storageKey, JSON.stringify(data)),
        get: () => JSON.parse(localStorage.getItem(storageKey))
    }

})();

export default StorageController;