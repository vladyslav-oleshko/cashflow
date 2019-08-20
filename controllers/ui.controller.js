const UIController = (() => {

    let parentElement, DOM;

    DOM = {
        inputType: 'add__type',
        inputDescription: 'add__description',
        inputValue: 'add__value',
        inputButton: 'add__btn',
        incomeContainer: 'income__list',
        expenseContainer: 'expenses__list',
        budgetLabel: 'budget__value',
        incomeLabel: 'budget__income--value',
        expenseLabel: 'budget__expenses--value',
        percentageLabel: 'budget__expenses--percentage',
        container: 'container',
        expensePercentageLabel: 'item__percentage',
        dateLabel: 'budget__title--month'
    };

    const getItemHTML = (type) => {
        if (type === 'income') {
            parentElement = DOM.incomeContainer;
            return `<div class="item clearfix" id="income-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
        } else if (type === 'expense') {
            parentElement = DOM.expenseContainer;
            return `<div class="item clearfix" id="expense-%id%">
                        <div class="item__description">%description%</div>
                        <div class="right clearfix">
                            <div class="item__value">%value%</div>
                            <div class="item__percentage"></div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>`
        } 
    };

    const formatNumber = (number, type) => {
        let transactionSign, splittedNumber;

        splittedNumber = Math.abs(number).toFixed(2).split('.');

        if (number !== 0) {
            transactionSign = type === 'income' ? '+' : '-';
        } else {
            transactionSign = '';
        }

        // Return formatted number. Example: 1500.5 => 1,500.50
        return `${transactionSign} ${Number(splittedNumber[0]).toLocaleString()}.${splittedNumber[1]}`;
    };

    return {

        getInput: () => {
            return {
                type: document.getElementsByClassName(DOM.inputType)[0].value,
                description: document.getElementsByClassName(DOM.inputDescription)[0].value,
                value: parseFloat(document.getElementsByClassName(DOM.inputValue)[0].value)
            }
        },

        addItemToList: (item, type) => {
            let transactionTemplate;

            transactionTemplate = getItemHTML(type).replace('%id%', item.id);
            transactionTemplate = transactionTemplate.replace('%description%', item.description);
            transactionTemplate = transactionTemplate.replace('%value%', formatNumber(item.value, type));

            document.getElementsByClassName(parentElement)[0].insertAdjacentHTML('beforeend', transactionTemplate);
        },

        clearFields: () => {
            let fieldsArray;

            fieldsArray = [...document.querySelectorAll(`.${DOM.inputDescription}, .${DOM.inputValue}`)];
            fieldsArray.forEach(f => f.value = '');
            fieldsArray[0].focus();
        },

        displayBudget: ({ budget, totalIncome, totalExpense, percentage }) => {
            const type = budget > 0 ? 'income' : 'expense';

            document.getElementsByClassName(DOM.budgetLabel)[0].textContent = formatNumber(budget, type);
            document.getElementsByClassName(DOM.incomeLabel)[0].textContent = formatNumber(totalIncome, 'income');
            document.getElementsByClassName(DOM.expenseLabel)[0].textContent = formatNumber(totalExpense, 'expense');
            document.getElementsByClassName(DOM.percentageLabel)[0].textContent = percentage > 0 ? `${percentage}%`: '---';
        },

        displayPercentages: (percentages) => {
            let expenses = [...document.getElementsByClassName(DOM.expensePercentageLabel)];

            expenses.forEach((e, i) => e.textContent = percentages[i] > 0 ? `${percentages[i]} %` : '---');
        },

        typeChanged: () => {
            let fields;

            fields = [...document.querySelectorAll(`.${DOM.inputType}, .${DOM.inputDescription}, .${DOM.inputValue}`)];
            fields.forEach(f => f.classList.toggle('red-focus'));

            document.getElementsByClassName(DOM.inputButton)[0].classList.toggle('red');
        },

        validateValue: (event) => event.target.value = event.target.value.slice(0, event.target.maxLength),

        deleteItemFromList: (selectorId) => document.getElementById(selectorId).parentNode.removeChild(document.getElementById(selectorId)),

        displayDate: () => document.getElementsByClassName(DOM.dateLabel)[0].textContent = `${(new Date()).toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,

        getDOM: () => DOM,
    }
})();

export default UIController;