(function(){

})()
document.getElementById('copyright').innerHTML = '&copy; ' + new Date().getFullYear();
const submitBtn = document.querySelector('.btn');
const inputs = document.querySelectorAll('input');

const basicEmailCheck = (email) => {
    let result = false;
    let regex = new RegExp('[a-zA-Z0-9]+@[a-zA-Z09]{3,}.(com|net|org|edu|gov|uk|au|us|info|me|co)$');
    regex.test(email) && (result = true);
    return result;
};

const isFormReady = () => {
    let result = false;
    const regex = new RegExp('[a-zA-Z0-9]+@[a-zA-Z09]{3,}.(com|net|org|edu|gov|uk|au|us|info|me|co)$');
    const formData = getFormData();
    const emailReady = basicEmailCheck(formData.email);
    const passwordReady = formData.password.length > 6;
    emailReady && passwordReady && (result = true);
    return result;
};

const getFormData = () => {
    return {
        email: document.querySelector('input[name="email"]').value,
        password: document.querySelector('input[name="password"]').value,
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', (e) => {
        isFormReady() ? submitBtn.disabled = false : submitBtn.disabled = true;
    })
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let body = {};
    let headers = {
        "Content-type": "application/json",
    }
    if (isFormReady()) {
        body = getFormData();
        fetch('/login', {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        }).then((res) => {
            if (res.status !== 200) {
                window.alert("Problem logging in \n" + res.statusText);
            } else {
                window.location.href = '/dashboard';
            }
        }).catch((error) => {
            console.log(error)
        })
    } else {
        window.alert("Forms need filled out fields!")
    }

})