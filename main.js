/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []
// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
*/

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
*/

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
*/

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

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
