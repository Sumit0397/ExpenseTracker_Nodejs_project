const hamburger = document.querySelector(".hamburger");
const mobile_nav_section = document.querySelector(".mobile-nav-section");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobile_nav_section.classList.toggle("show");
})

function logout() {
    window.location.href = "/";
}

async function premiumLeaders(){
    try {
        const res = await axios.get("http://localhost:3000/premium/getpremiumleaders");

        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("DOMContentLoaded" , premiumLeaders);