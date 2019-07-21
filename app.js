// DATA & BUDGET CONTROLLER
let budgetController = (() => {

    let Expense = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    let Income = function(id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    let calculateTotal = (type) => {
        let sum = 0
        data.allItems[type].forEach((cur) => {
            sum += cur.value
        })
        data.totals[type] = sum
    }

    // Global data structure
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function(type, des, val) {
            let newItem

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1
            } else {
                ID = 0
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            }
            

            data.allItems[type].push(newItem)
            return newItem

        },

        deleteItem: (type, id) => {
            let ids, index

            ids = data.allItems[type].map((current) => {
                return current.id
            })

            index = ids.indexOf(id)

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: () => {
            
            // calculate total income and expenses    
            calculateTotal('exp')
            calculateTotal('inc')

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
            } else {
                data.percentage = -1
            }
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: () => {
            console.log(data)
        }

    }

})()


// UI CONTROLLER
let UIController = (() => {

    // Object for private DOM variables 
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    return {
        getinput: () => {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type) {
            let html, newHTML
            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', obj.value)
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)

        },

        deleteListItem: (selectorID) => {
            let el = document.getElementById(selectorID)

            el.parentNode.removeChild(el)

        },

        clearFields: () => {
            let fields, fieldsArr

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)

            fieldsArr = Array.prototype.slice.call(fields)

            fieldsArr.forEach((current, index, array) => {
                current.value = ''
            })

            fieldsArr[0].focus()
        },

        displayBudget: (obj) => {

            document.querySelector(DOMstrings.budgetLabel).textContent = '$' + obj.budget
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },

        getDOMstrings: () => {
            return DOMstrings
        }
    }

})()


// GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {

    let setUpEventListeners = () => {

        let DOM = UICtrl.getDOMstrings()

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem()
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    let updateBudget = () => {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget()

        // 2. Return the budget
        let budget = budgetCtrl.getBudget()

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget)
    }

    let ctrlAddItem = () => {
        let input, newItem

        // 1. Get the field input data
        input = UICtrl.getinput()
        // console.log(input)
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value)

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type)
            
            // 4. clear the fields
            UICtrl.clearFields()

            // 5. Calulate and update budget
            updateBudget()
        }
    }

    let ctrlDeleteItem = (e) => {
        let itemID, splitID, type, ID

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

        if (itemID) {

            splitID = itemID.split('-')
            type = splitID[0]
            ID = parseInt(splitID[1])

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID)

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID)

            // 3. Update and show the new budget
            updateBudget()
        }

    }

    return {
        init: () => {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setUpEventListeners()
        }
    }

})(budgetController, UIController)

controller.init()