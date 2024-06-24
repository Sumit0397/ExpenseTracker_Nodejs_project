

async function updatepassword(event){
    try {
        event.preventDefault();
        const newpassword = event.target.password.value;

        const resetpasswordid = window.location.pathname.split("/").pop();

        const res = await axios.put(`http://localhost:3000/password/updatepassword/${resetpasswordid}` , { newpassword : newpassword});

        if(res.status === 201){
            console.log(res.data.message);
            alert(res.data.message);
            window.location.href = "/";
        }else{
            alert('There are some issue when reseting your password');
        }
    } catch (error) {
        alert(error.message);
    }
}