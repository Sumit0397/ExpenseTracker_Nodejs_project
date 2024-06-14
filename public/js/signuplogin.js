const sign_up_btn = document.querySelector("#sign-up-btn");
const sign_in_btn = document.querySelector("#sign-in-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
})

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
})


async function signup(event) {
    try {

        event.preventDefault();

        const userdetails = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value
        }

        const res = await axios.post("http://localhost:3000/user/signup", userdetails);

        if (res.status == 200) {
            alert('user registered succesfully!!');
            container.classList.remove("sign-up-mode");
        }

    } catch (error) {
        if (error.response && error.response.status === 409) {
            alert(error.response.data.message);
        } else {
            document.body.innerHTML += `<div style="color: red;">${error}</div>`;
        }
    }
}