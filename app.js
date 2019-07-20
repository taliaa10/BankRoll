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


    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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

        testing: () => {
            console.log(data)
        }
    }

})()


// UI CONTROLLER
let UIController = (() => {

    // Object for private variables 
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
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

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id)
            newHTML = newHTML.replace('%description%', obj.description)
            newHTML = newHTML.replace('%value%', obj.value)
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML)

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

        document.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem()
            }
        })
    }

    let updateBudget = () => {

        // 1. Calculate the budget

        // 2. Return the budget

        // 3. Display the budget on the UI
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

    return {
        init: () => {
            console.log("the application has started")
            setUpEventListeners()
        }
    }

})(budgetController, UIController)

controller.init()