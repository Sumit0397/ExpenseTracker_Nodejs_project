const hamburger = document.querySelector(".hamburger");
const mobile_nav_section = document.querySelector(".mobile-nav-section");

hamburger.addEventListener("click" , () => {
    hamburger.classList.toggle("active");
    mobile_nav_section.classList.toggle("show");
    // console.log(hamburger);
})

function logout() {
    window.location.href = "/";
}

async function addexpense(event) {
    try {
        event.preventDefault();

        const expensedetails = {
            date: event.target.date.value,
            category: event.target.category.value,
            description: event.target.description.value,
            amount: parseInt(event.target.amount.value)
        }

        const res = await axios.post("http://localhost:3000/expense/addexpense", expensedetails);

        if (res.status === 200) {
            
            addExpensetoUi(res.data);

            event.target.date.value = "";
            event.target.category.value = "";
            event.target.description.value = "";
            event.target.amount.value = "";
        }
    } catch (error) {
        console.log(error.message);
    }
}


async function getallexpense() {
    try {
        const res = await axios.get("http://localhost:3000/expense/allexpense");

        if (res.status === 200) {

            res.data.forEach((expense) => {
                addExpensetoUi(expense);
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


function addExpensetoUi(expense) {
    const expense_table = document.getElementById("expense_table");
    const expenseElemId = `expense-${expense.id}`;

    expense_table.innerHTML += `
                <tr id=${expenseElemId}>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>&#8377; ${expense.amount}</td>
                    <td>
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn" onclick='deleteExpense(event , ${expense.id})'>Delete</button>

                        <button class="edit-btn-mobile">🖊️</button>
                        <button class="delete-btn-mobile" onclick='deleteExpense(event , ${expense.id})'>🚮</button>
                    </td>
                </tr>
    `
}

async function deleteExpense(e, expenseid) {
    try {

        const res = await axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`)

        if (res.status === 200) {

            removeExpenseFromUi(expenseid);
        }else{
            throw new Error('Failed to delete')
        }

    } catch (error) {
        console.log(error.message);
    }
}


function removeExpenseFromUi(expenseid) {
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}


window.addEventListener("DOMContentLoaded", getallexpense);