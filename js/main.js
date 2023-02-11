/* Mohamad Albar Dicoding Submision */

// inisialisasi
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

// load content dom
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        submitForm.reset();
        swal.fire("Berhasil", "data berhasil di masukan", "success");
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

// membuat function adBook untuk menampung data buku dari form input
function addBook() {
    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYear = document.getElementById('inputBookYear').value;
    const isCompleted = isCompletedChecked();

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, inputTitle, inputAuthor, inputYear, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// generate id
function generateId() {
    return +new Date();
}

// checkbox
function isCompletedChecked() {
    const isCheckComplete = document.getElementById("inputBookIsComplete");
    if (isCheckComplete.checked) {
        return true;
    }
    return false;
}

// change button input form tittle
inputBookIsComplete.addEventListener('change', function () {
    const bookSubmit = document.querySelector('#bookSubmit>span')
    if (inputBookIsComplete.checked) {
        bookSubmit.innerText = 'Selesai Dibaca'
    } else {
        bookSubmit.innerText = 'Belum Selesai Dibaca'
    }
})

// generate book object
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

// function makeBook to create element html
function makeBook(bookObject) {
    const textInputTitle = document.createElement('h3');
    textInputTitle.innerText = bookObject.title;

    const textInputAuthor = document.createElement('p');
    textInputAuthor.innerText = bookObject.author;

    const textInputYear = document.createElement('p');
    textInputYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textInputTitle, textInputAuthor, textInputYear);

    const container = document.createElement('div');
    container.classList.add('item', 'card');
    container.append(textContainer);
    container.setAttribute('id', `book=${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTitleFromCompleted(bookObject.id);

            swal.fire("Berhasil", "data berhasil dipindahkan", "success");
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            swal.fire({
                title: 'Apakah anda Yakin?',
                text: "Anda tidak bisa mengembalikan kembali!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, hapus!'
            }).then((result) => {
                if (result.isConfirmed) {
                    swal.fire(
                        'Deleted!',
                        'Data buku berhasil dihapus.',
                        'success'
                    )
                    removeTitleFromCompleted(bookObject.id);
                }
            })

        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function () {
            addTitleToCompleted(bookObject.id);
            swal.fire("Berhasil", "data berhasil di pindahkan", "success");
        });

        const trashButtons = document.createElement('button');
        trashButtons.classList.add('trash-button');

        trashButtons.addEventListener('click', function () {
            swal.fire({
                title: 'Apakah anda Yakin?',
                text: "Anda tidak bisa mengembalikan kembali!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, hapus!'
            }).then((result) => {
                if (result.isConfirmed) {
                    swal.fire(
                        'Deleted!',
                        'Data buku berhasil dihapus.',
                        'success'
                    )
                    removeTitleFromCompleted(bookObject.id);
                }
            })
        })
        container.append(checkButton, trashButtons);
    }
    return container;
}

function addTitleToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTitleFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTitleFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

// function web storage save data
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// cek web storage support
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('browser kamu tidak mendukung local storage');
        return false
    }
    return true;
}

// load data dari storage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList')
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    // mark
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        }
        else {
            completedBOOKList.append(bookElement);
        }

    }
});

// search bar
searchSubmit.addEventListener('click', function (event) {
    event.preventDefault()

    const searchTitle = document.querySelector('#search-txt');
    const searchResult = document.querySelector('#search>.BookCard');

    searchResult.innerHTML = '';
    searchResult.innerHTML += `<p> Hasil pencarian judul buku <b>${searchTitle.value}</b></p>`;

    console.log(searchResult);

    for (const bookItem of books) {
        if (bookItem.title.toLowerCase().includes(searchTitle.value.toLowerCase())) {
            if (bookItem.isCompleted === true) {

                const textInputTitle = document.createElement('h3');
                textInputTitle.innerText = bookItem.title;

                const textInputAuthor = document.createElement('p');
                textInputAuthor.innerText = bookItem.author;

                const textInputYear = document.createElement('p');
                textInputYear.innerText = bookItem.year;

                const status = document.createElement('div');
                status.classList.add('status', 'complete');
                status.innerText = 'selesai';

                const undoButton = document.createElement('button');
                undoButton.classList.add('undo-button');

                undoButton.addEventListener('click', function () {
                    undoTitleFromCompleted(bookItem.id);
                    swal.fire("Berhasil", "data berhasil dipindahkan", "success");
                });

                const trashButton = document.createElement('button');
                trashButton.classList.add('trash-button');

                trashButton.addEventListener('click', function () {
                    swal.fire({
                        title: 'Apakah anda Yakin?',
                        text: "Anda tidak bisa mengembalikan kembali!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, hapus!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            swal.fire(
                                'Deleted!',
                                'Data buku berhasil di hapus.',
                                'success'
                            )
                            removeTitleFromCompleted(bookItem.id);
                        }
                    })
                });

                const textContainer = document.createElement('div');
                textContainer.classList.add('inner');
                textContainer.append(textInputTitle, textInputAuthor, textInputYear, status, undoButton, trashButton);


                const container = document.createElement('div');
                container.classList.add('item', 'card');
                container.append(textContainer);

                searchResult.append(container);
            } else {
                const textInputTitle = document.createElement('h3');
                textInputTitle.innerText = bookItem.title;

                const textInputAuthor = document.createElement('p');
                textInputAuthor.innerText = bookItem.author;

                const textInputYear = document.createElement('p');
                textInputYear.innerText = bookItem.year;

                const status = document.createElement('div');
                status.classList.add('status', 'incomplete');
                status.innerText = 'belum selesai';

                const checkButton = document.createElement('button');
                checkButton.classList.add('check-button');

                checkButton.addEventListener('click', function () {
                    undoTitleFromCompleted(bookItem.id);
                    swal.fire("Berhasil", "data berhasil dipindahkan", "success");
                });

                const trashButton = document.createElement('button');
                trashButton.classList.add('trash-button');

                trashButton.addEventListener('click', function () {
                    swal.fire({
                        title: 'Apakah anda Yakin?',
                        text: "Anda tidak bisa mengembalikan kembali!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, hapus!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            swal.fire(
                                'Deleted!',
                                'Data buku berhasil dihapus.',
                                'success'
                            )
                            removeTitleFromCompleted(bookItem.id);
                        }
                    })
                });

                const textContainer = document.createElement('div');
                textContainer.classList.add('inner');
                textContainer.append(textInputTitle, textInputAuthor, textInputYear, status, checkButton, trashButton);

                const container = document.createElement('div');
                container.classList.add('item', 'card');
                container.append(textContainer);

                searchResult.append(container);
            }
        }
    }
});
// end of search bar
