import BudgetController from './budget.controller.js';
import UIController from './ui.controller.js';
import StorageController from './storage.controller.js';

const Controller = ((BudgetCtrl, UICtrl, StorageCtrl) => {

    const isInputValid = (inputData) => inputData.description && !isNaN(inputData.value) && isFinite(inputData.value) && inputData.value;

    const updatePercentages = () => {
        let percentages;

        BudgetCtrl.calculatePercentages();
        percentages = BudgetCtrl.getPercentages();
        UICtrl.displayPercentages(percentages);
    }

    const updateBudget = () => {
        let budget;

        BudgetCtrl.calculateBudget();
        budget = BudgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    }

    const addItem = () => {
        let inputData, newTransaction;

        inputData = UICtrl.getInput();

        if (isInputValid(inputData)) {
            newTransaction = BudgetCtrl.addItem(inputData);

            UICtrl.addItemToList(newTransaction, inputData.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    }

    const deleteItem = (event) => {
        let domId, id, type;

        // Same as parentNode x4
        domId = event.path[4].id;

        if (domId) {
            [type, id] = [domId.split('-')[0], Number(domId.split('-')[1])];
            BudgetCtrl.deleteItem(type, id);
            UICtrl.deleteItemFromList(domId);
            updateBudget();
            updatePercentages();
        }
    }

    // Fetch data from localStorage and if it exists - calculate and display information.
    const initializeExistingData = () => {
        const data = StorageCtrl.get();

        if (data) {
            data.transactions.income.forEach(i => UICtrl.addItemToList(i, 'income'));
            data.transactions.expense.forEach(e => UICtrl.addItemToList(e, 'expense'));
            updateBudget();
            updatePercentages();
        }
    }

    const setupEventListeners = () => {
        const DOM = UICtrl.getDOM();

        document.getElementsByClassName(DOM.inputButton)[0].addEventListener('click', addItem);
        document.addEventListener('keypress', (event) => event.keyCode === 13 ? addItem() : null);
        document.getElementsByClassName(DOM.container)[0].addEventListener('click', (event) => deleteItem(event));
        document.getElementsByClassName(DOM.inputType)[0].addEventListener('change', UICtrl.typeChanged);
        document.getElementsByClassName(DOM.inputValue)[0].addEventListener('input', (event) => UICtrl.validateValue(event));
    }

    return {
        initialize: () => {
            UICtrl.displayDate();
            initializeExistingData();
            setupEventListeners();
        }
    }

})(BudgetController, UIController, StorageController);

export default Controller;