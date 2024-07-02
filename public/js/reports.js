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

async function getDailyExpense(e) {
    try {
        e.preventDefault();
        const date = document.getElementById("date").value;

        const token = localStorage.getItem("token");

        const res = await axios.post("http://localhost:3000/premium/getdailyexpense", { date: date }, { headers: { "Authorization": token } })

        if (res.status === 201) {
            if (res.data.length == 0) {
                alert("No Data Found!!");
                window.location.reload();
                return;
            }

            const daily_report = document.getElementById("daily_report");
            const daily_result = document.getElementById("daily_result");

            daily_report.innerHTML = "";
            daily_result.innerHTML = "";

            let sum = 0;

            res.data.forEach((expense) => {
                sum += expense.amount;
            })

            res.data.forEach((expense) => {
                daily_report.innerHTML += `
                <tr>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>&#8377; ${expense.amount}</td>
                </tr>
            `
            })

            daily_result.innerHTML = `
                <tr class="result">
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>&#8377; ${sum}</td>
                </tr>
            `
            document.getElementById("date").value = "";
        } else {
            alert("No data found");
        }

    } catch (error) {
        alert(error.message);
    }
}


const show_daily_btn = document.getElementById("show-daily");

show_daily_btn.addEventListener("click", getDailyExpense);


async function getMonthlyExpense(e) {
    try {
        e.preventDefault();
        const month = document.getElementById("month").value;

        const editedMonth = month.split("-").pop();

        const token = localStorage.getItem("token");

        const res = await axios.post("http://localhost:3000/premium/getmonthlyexpense", { month: editedMonth }, { headers: { "Authorization": token } })

        if (res.status === 201) {

            if (res.data.length == 0) {
                alert("No Data Found!!");
                window.location.reload();
                return;
            }

            const month_report = document.getElementById("month_report");
            const month_result = document.getElementById("month_result");

            month_report.innerHTML = "";
            month_result.innerHTML = "";

            let sum = 0;

            res.data.forEach((expense) => {
                sum += expense.amount;
            })

            res.data.forEach((expense) => {
                month_report.innerHTML += `
                <tr>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>&#8377; ${expense.amount}</td>
                </tr>
            `
            })

            month_result.innerHTML = `
                <tr class="result">
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>&#8377; ${sum}</td>
                </tr>
            `
            document.getElementById("month").value = "";
        } else {
            alert("No data found");
        }
    } catch (error) {
        alert(error.message);
    }
}

const show_monthly_btn = document.getElementById("show-monthly");

show_monthly_btn.addEventListener("click", getMonthlyExpense);


async function getYearlyExpense(e) {
    try {
        e.preventDefault();

        const year = document.getElementById("year-input").value;

        const token = localStorage.getItem("token");

        const res = await axios.post("http://localhost:3000/premium/getyearlyexpense", { year: year }, { headers: { "Authorization": token } })

        if (res.status === 201) {

            if (res.data.length == 0) {
                alert("No Data Found!!");
                window.location.reload();
                return;
            }

            const year_report = document.getElementById("year_report");
            const year_result = document.getElementById("year_result");

            year_report.innerHTML = "";
            year_result.innerHTML = "";

            let sum = 0;

            res.data.forEach((expense) => {
                sum += expense.amount;
            })

            res.data.forEach((expense) => {
                year_report.innerHTML += `
                <tr>
                    <td>${expense.date}</td>
                    <td>${expense.category}</td>
                    <td>${expense.description}</td>
                    <td>&#8377; ${expense.amount}</td>
                </tr>
            `
            })

            year_result.innerHTML = `
                <tr class="result">
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>&#8377; ${sum}</td>
                </tr>
            `

            document.getElementById("month").value = "";
        } else {
            alert("No data found");
        }

    } catch (error) {
        alert(error.message);
    }
}

const show_yearly_btn = document.getElementById("show-yearly");

show_yearly_btn.addEventListener("click", getYearlyExpense);


async function download() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get('http://localhost:3000/user/download', { headers: { "Authorization": token } });

        if (res.status === 200) {
            const a = document.createElement('a');
            a.href = res.data.fileurl;
            a.download = 'expense.csv';
            a.click();
        } else {
            throw new Error(res.data.message);
        }
    } catch (error) {
        alert(error.message);
    }
}