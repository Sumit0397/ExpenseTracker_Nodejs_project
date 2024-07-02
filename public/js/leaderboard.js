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

async function premiumLeaders() {
    try {
        const res = await axios.get("http://localhost:3000/premium/getpremiumleaders");

        // console.log(res.data);
        res.data.forEach((leader, index) => {
            addLedaertoUi(leader , index);
        })

    } catch (error) {
        console.log(error);
    }
}

function addLedaertoUi(leader, index) {
    const leader_table = document.getElementById('leader_table');
    const leader_id = `leader-${leader.id}`;

    leader_table.innerHTML += `
                <tr id=${leader_id}>
                    <td>${index+1}</td>
                    <td>${leader.name.toUpperCase()}</td>
                    <td>&#8377; ${leader.totalExpense}</td>
                </tr>
    `

}

window.addEventListener("DOMContentLoaded", premiumLeaders);