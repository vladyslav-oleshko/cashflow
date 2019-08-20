
import StorageController from './storage.controller.js';

const BudgetController = ((StorageCtrl) => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = 0;
        }

        calculatePercentage = (totalIncome) => this.percentage = totalIncome > 0 ? Math.round((this.value / totalIncome) * 100) : 0;
        getPercentage = () => this.percentage;
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    let data = {
        transactions: {
            expense: [],
            income: []
        },
        total: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: 0
    }

    const saveDataToStorage = () => StorageCtrl.save(data);

    // Calculate total income/expense.
    const calculateTotal = (type) => data.total[type] = data.transactions[type].reduce((previous, current) => previous + current.value, 0);

    return {

        addItem: ({ type, description, value }) => {
            let newTransaction, newId;

            // Calculate transaction's id.
            newId = data.transactions[type].length > 0 ? data.transactions[type][data.transactions[type].length - 1].id + 1 : 0;
            newTransaction = type === 'income' ? new Income(newId, description, value) : new Expense(newId, description, value);
            data.transactions[type].push(newTransaction);

            saveDataToStorage();

            return newTransaction;
        },

        calculateBudget: () => {
            const existingData = StorageCtrl.get();

            if (existingData) {
                existingData.transactions.income = existingData.transactions.income.map(i => new Income(i.id, i.description, i.value));
                existingData.transactions.expense = existingData.transactions.expense.map(e => new Expense(e.id, e.description, e.value));
                // Copy existing data (from localStorage) to the current.
                data = existingData;
            }

            calculateTotal('income');
            calculateTotal('expense');

            data.budget = Math.abs(data.total.income) - Math.abs(data.total.expense);
            data.percentage = data.transactions.income.length ? Math.round((data.total.expense / data.total.income) * 100) : '---';
        },

        getBudget: () => {
            return { budget: data.budget, totalIncome: data.total.income, totalExpense: data.total.expense, percentage: data.percentage }
        },

        deleteItem: (type, id) => {
            const index = data.transactions[type].findIndex(t => t.id === id);

            data.transactions[type].splice(index, 1);

            // Re-write existing data.
            StorageCtrl.save(data);
        },

        calculatePercentages: () => data.transactions.expense.forEach(e => e.calculatePercentage(data.total.income)),

        getPercentages: () => data.transactions.expense.map(e => e.getPercentage())
        
    }

})(StorageController);

export default BudgetController;