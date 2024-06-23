
async function resetpassword(event){
    try {
        event.preventDefault();
        const email = event.target.email.value;

        const res = await axios.post("http://localhost:3000/password/sendmail" , { email : email});

        if(res.status === 200){
            console.log(res.data.message);
            alert(res.data.message);
            event.target.email.value = "";
        }else{
            alert('There are some issue when reseting your password');
        }
    } catch (error) {
        alert(error.message);
    }
}