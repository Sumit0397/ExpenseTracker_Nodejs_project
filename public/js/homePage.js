const hamburger = document.querySelector(".hamburger");
const mobile_nav_section = document.querySelector(".mobile-nav-section");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobile_nav_section.classList.toggle("show");
})

async function logout() {
    try {
        localStorage.clear();
        window.location.href = "/";
    } catch (error) {
        alert(error.message);
    }
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

            window.location.reload();
        }
    } catch (error) {
        console.log(error.message);
    }
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
    window.location.reload();
}


const premiumBtn = document.getElementById("buyPremiumBtn");
const reportsLink = document.getElementById("reportsLink");
const leaderBoardLink = document.getElementById("leaderBoardLink");

const mobilePremiumBtn = document.getElementById("buyPremiumBtnmobile");
const reportsLinkMobile = document.getElementById("reportsLinkmobile");
const leaderBoardLinkMobile = document.getElementById("leaderboardLinkmobile");

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

            window.location.reload();
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
mobilePremiumBtn.addEventListener("click", buyPremium);

async function isPremiumUser() {
    const token = localStorage.getItem('token');
    const res = await axios.get("http://localhost:3000/user/ispremiumuser", {
        headers: { "Authorization": token }
    });
    if (res.data.isPremiumUser) {
        premiumBtn.innerHTML = "You are a Premium User";
        premiumBtn.disabled = true;
        mobilePremiumBtn.innerHTML = "You are a Premium User";
        mobilePremiumBtn.disabled = true;
        premiumBtn.style.fontSize = '12px';
        premiumBtn.style.width = "fit-content";
        premiumBtn.style.paddingLeft = "5px";
        premiumBtn.style.paddingRight = "5px";
        reportsLink.removeAttribute("onclick");
        leaderBoardLink.removeAttribute("onclick");
        reportsLinkMobile.removeAttribute("onclick");
        leaderBoardLinkMobile.removeAttribute("onclick");
        leaderBoardLink.setAttribute("href", "/premium/getleaderboardpage");
        leaderBoardLinkMobile.setAttribute("href", "/premium/getleaderboardpage");
        reportsLink.setAttribute("href", "/premium/getreportpage");
        reportsLinkMobile.setAttribute("href", "/premium/getreportpage");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    getallexpense();
    isPremiumUser();
    document.getElementById('record').addEventListener('change', handleRecordChange);
});

async function handleRecordChange() {
    const selectedLimit = document.getElementById('record').value;
    await getallexpense(1, selectedLimit); // Fetch data for the first page with the selected limit
}

async function getallexpense(page = 1, limit = 5) {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/expense/allexpense/${page}?limit=${limit}`, { headers: { "Authorization": token } });

        if (res.status === 200) {
            // Clear existing expenses and pagination
            const expense_table = document.getElementById("expense_table");
            expense_table.innerHTML = "";

            const pagination = document.getElementById("pagination");
            pagination.innerHTML = "";

            // Append new expenses
            res.data.expenses.forEach((expense) => {
                addExpensetoUi(expense);
            });

            // Append new pagination buttons
            for (let i = 1; i <= res.data.totalPages; i++) {
                const button = document.createElement('button');
                button.setAttribute('class', "page-btn");
                button.appendChild(document.createTextNode(i));
                if(i === page){
                    button.classList.add("active");
                }
                pagination.appendChild(button);
                button.addEventListener("click", () => paginationBtn(i, limit));
            }
        }
    } catch (error) {
        alert(error.message);
    }
}

async function paginationBtn(page, limit) {
    await getallexpense(page, limit);
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
                <button class="delete-btn" onclick='deleteExpense(event , ${expense.id})'>Delete</button>
                <button class="delete-btn-mobile" onclick='deleteExpense(event , ${expense.id})'>🚮</button>
            </td>
        </tr>
    `;
}



