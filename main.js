const localStorageKey = 'localStorage'
const transaction = []

const incomeList = document.getElementById('incomeList')
const expenseList = document.getElementById('expenseList')

// Function

function setUsername() {
    userName = document.cookie
    nameHeader = document.getElementById('Username')
    nameHeader.innerHTML = `Halo, <strong>${userName}</strong>`
}

function generateCookie() {
    userNameInput = prompt('Masukkan nama anda :')
    document.cookie = `Username=${userNameInput}`
}

function generateId() {
    return +new Date()
}

function loadData() {
    const transactionData = JSON.parse(localStorage.getItem(localStorageKey))

    if (transactionData !== null) {
        transactionData.forEach((x) => {
            transaction.push(x)
        })
    }
}

function saveData() {
    localStorage.setItem(localStorageKey, JSON.stringify(transaction))
}

function findObject(objectId) {
    for (const x of transaction) {
        if (x.id === objectId) {
            return x
        }
    }
}

function findObjectIndex(objectId) {
    for (const x in transaction) {
        if (transaction[x].id === objectId) {
            return x
        }
    }
}

function generateElement(objectData) {
    const transactionTitle = document.createElement('h3')
    transactionTitle.setAttribute('data-testid', 'transactionItemTitle')
    transactionTitle.innerText = objectData.name
    const transactionAmount = document.createElement('P')
    transactionAmount.setAttribute('data-testid', 'transactionItemAmount')
    transactionAmount.innerText = "Nominal : " + objectData.amount.toLocaleString('id-ID')
    const transactionDate = document.createElement('P')
    transactionDate.setAttribute('data-testid', 'transactionItemDate')
    transactionDate.innerText = "Tanggal : " + objectData.date
    const transactionType = document.createElement('P')
    transactionType.setAttribute('data-testid', 'transactionItemType')
    transactionType.innerText = "Tipe : " + objectData.type

    const editTypeButton = document.createElement('button')
    editTypeButton.innerText = 'Ubah Tipe'
    editTypeButton.setAttribute('data-testid', 'transactionItemEditTypeButton')
    editTypeButton.addEventListener('click', () => {editTransactionType(objectData.id)})
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Hapus'
    deleteButton.setAttribute('class', 'deleteTransactionButton')
    deleteButton.setAttribute('data-testid', 'transactionItemDeleteButton')
    deleteButton.addEventListener('click', () => {deleteTransaction(objectData.id)})

    const buttonHeader = document.createElement('div')
    buttonHeader.append(editTypeButton, deleteButton)

    const transactionCard = document.createElement('div')
    transactionCard.setAttribute('data-testid', 'transactionItem')
    transactionCard.setAttribute('class', 'transactionCard')
    transactionCard.append(
        transactionTitle,
        transactionAmount,
        transactionDate,
        transactionType,
        buttonHeader
    )

    if (objectData.type === 'income') {
        incomeList.append(transactionCard)
    } else if (objectData.type === 'expense') {
        expenseList.append(transactionCard)
    }
}

function generateTransaction(transactionList = transaction) {
    incomeList.replaceChildren()
    expenseList.replaceChildren()

    transactionList.forEach((i) => {
        generateElement(i)
    })
}

function renderDashboard() {
    const balanceAmount = document.getElementById('balanceAmount')
    const incomeAmount = document.getElementById('incomeAmount')
    const expenseAmount = document.getElementById('expenseAmount')

    let incomeAmountValue = 0
    let expenseAmountValue = 0

    transaction.forEach((i) => {
        if (i.type === 'expense') {
            expenseAmountValue += i.amount
        } else if (i.type === 'income') {
            incomeAmountValue += i.amount
        }
    })

    const balanceAmountValue = incomeAmountValue - expenseAmountValue

    if (balanceAmountValue >= 0) {
        balanceAmount.innerText = `Rp ${balanceAmountValue.toLocaleString('id-ID')}`
    } else {
        balanceAmount.innerText = `-Rp ${Math.abs(balanceAmountValue).toLocaleString('id-ID')}`
    }

    incomeAmount.innerText = `Rp ${incomeAmountValue.toLocaleString('id-ID')}`
    expenseAmount.innerText = `Rp ${expenseAmountValue.toLocaleString('id-ID')}`

    generateTransaction()
}

function editTransactionType(transactionId) {
    const objectTarget = findObject(transactionId)

    if (objectTarget.type === 'income') {
        objectTarget.type = 'expense'
    } else if (objectTarget.type === 'expense') {
        objectTarget.type = 'income'
    }

    saveData()
    renderDashboard()
}

function deleteTransaction(transactionId) {
    const objectTargetIndex = findObjectIndex(transactionId)

    transaction.splice(objectTargetIndex, 1)

    saveData()
    renderDashboard()
}

function generateObject(id, name, amount, date, type) {
    return {
        id,
        name,
        amount,
        date,
        type
    }
}

function searchTransaction() {
    const searchTransactionInput = document.getElementById('searchTransactionFormTitleInput').value.toLowerCase()
    const suitableItem = []

    if (searchTransactionInput === '') {
        generateTransaction(transaction)
        return
    }

    transaction.forEach((i) => {
        if (i.name.toLowerCase().includes(searchTransactionInput)) {
            suitableItem.push(i)
        }
    })

    generateTransaction(suitableItem)
}

// Another Code

if (document.cookie === '') {
    generateCookie()
}

setUsername()

// Event

document.addEventListener('DOMContentLoaded', () => {
    if (typeof Storage === 'undefined') {
        alert('Browser Anda Tidak Mendukung Local Storage')
        return
    }

    loadData()
    renderDashboard()
})

document.getElementById('transactionForm').addEventListener('submit', (event) => {
    event.preventDefault()
    const transactionFormTitle = document.getElementById('transactionFormTitleInput').value
    const transactionFormAmount = Number(document.getElementById('transactionFormAmountInput').value)
    const transactionFormDate = document.getElementById('transactionFormDateInput').value
    const transactionFormType = document.getElementById('transactionFormTypeSelect').value

    if (transactionFormTitle === '') {
        alert('Keterangan Tidak Boleh Kosong')
        return
    } else if (transactionFormAmount < 1) {
        alert('Nominal Tidak boleh kosong atau lebih kecil dari 1')
        return
    }

    transaction.push(
        generateObject(
            generateId(),
            transactionFormTitle,
            transactionFormAmount,
            transactionFormDate,
            transactionFormType
        )
    )

    saveData()
    renderDashboard()
    document.getElementById('transactionForm').reset()
})

document.getElementById('searchTransactionForm').addEventListener('input', () => searchTransaction())

document.getElementById('searchTransactionForm').addEventListener('submit', (event) => {
    event.preventDefault()
    searchTransaction()
})
