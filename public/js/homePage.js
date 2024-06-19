const hamburger = document.querySelector(".hamburger");
const mobile_nav_section = document.querySelector(".mobile-nav-section");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobile_nav_section.classList.toggle("show");
})

function logout() {
    window.location.href = "/";
}

async function addexpense(event) {
    try {
        event.preventDefault();

        const token = localStorage.getItem('token');

        const expensedetails = {
            date: event.target.date.value,
            category: event.target.category.value,
            description: event.target.description.value,
            amount: parseInt(event.target.amount.value)
        }

        const res = await axios.post("http://localhost:3000/expense/addexpense", expensedetails, { headers: { "Authorization": token } });

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
        const token = localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/expense/allexpense", { headers: { "Authorization": token } });

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
        const token = localStorage.getItem('token');
        const res = await axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`, { headers: { "Authorization": token } })

        if (res.status === 200) {

            removeExpenseFromUi(expenseid);
        } else {
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


const premiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderBoardLink = document.getElementById("leaderBoardLink");

async function buyPremium(e) {
    const token = localStorage.getItem("token");
    const res = await axios.get(
        "http://localhost:3000/purchase/premiummembership",
        { headers: { "Authorization": token } }
    );
    var options = {
        key: res.data.key_id, // Enter the Key ID generated from the Dashboard
        order_id: res.data.order.id, // For one time payment
        // This handler function will handle the success payment
        handler: async function (response) {
            const res = await axios.post(
                "http://localhost:3000/purchase/updatetransactionstatus",
                {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                },
                { headers: { "Authorization": token } }
            );

            alert(
                "Welcome to our Premium Membership, You have now access to Reports and LeaderBoard"
            );
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        console.log(response)
        alert('Something went wrong')
    });
}

premiumBtn.addEventListener("click", buyPremium);

async function isPremiumUser() {
    const token = localStorage.getItem('token');
    const res = await axios.get("http://localhost:3000/user/ispremiumuser", {
        headers: { "Authorization": token }
    });
    if(res.data.isPremiumUser){
        premiumBtn.innerHTML = "Premium Member &#128081";
        premiumBtn.disabled = true;
        reportsLink.removeAttribute("onclick");
        leaderBoardLink.removeAttribute("onclick");
    }
}


// window.addEventListener("DOMContentLoaded", getallexpense , isPremiumUser);
window.addEventListener("DOMContentLoaded", () => {
    getallexpense();
    isPremiumUser();
});
