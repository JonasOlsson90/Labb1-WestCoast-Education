// Constants

const courses = [];
const cart = [];

// Classes

class Course {
    constructor(object) {
        this.courseNum = object.courseNum;
        this.image = object.image;
        this.altImage = object.altImage;
        this.title = object.title;
        this.info = object.info;
        this.length = object.length;
        this.buttonText = object.buttonText;
        this.price = object.price;
        this.orders = object.orders;
    }
}

// Navigation

onload = function () {
    navigate('pages/start.html');
    loadCourses();
}

async function navigate(path, callback1 = null, callback2 = null) {
    await fetch(path)
    .then(data => data.text())
    .then(html => document.getElementById('contentArea').innerHTML = html);
    
    if (callback1 !== null) {
        callback1();
    }
    if (callback2 !== null) {
        callback2();
    }
}

// Logic

async function loadCourses() {
    let response = await fetch('json/courses.json');

    if (response.ok) {
        let json = await response.json();
        addCourses(json);
    } else {
    alert("HTTP-Error: " + response.status);
    }
}

function addCourses(json) {
    for (i = 0; i < json.length; i++){
        courses.push(new Course(json[i]));
    }
}

function createFrontCards() {
    // Skapa kort och gör grejer
    let tempCourses = courses.sort(function(a, b) { return b.orders - a.orders }).slice(0, 3);
    let html = `<div id="carouselExampleIndicators" class="d-block d-lg-none carousel slide p-5" data-bs-ride="carousel">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
            aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
            aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
            aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">`;

    let isActive = true;
    for (let i = 0; i < tempCourses.length; i++) {
        let element = tempCourses[i];
        html += `<div class="carousel-item ${isActive ? 'active' : ''}">`;
        html += ` <div class="d-flex justify-content-center">`;
        html += createFrontCard(element);
        html += `</div></div>`;
        isActive = false;
    }
    html += `    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
</div>
<div class="d-none d-lg-flex justify-content-center">`;
    
    for (let i = 0; i < tempCourses.length; i++) {
        let element = tempCourses[i];        
        html += createFrontCard(element);
    }
    
    html += `</div>`;
    
    document.getElementById('frontCards').innerHTML = html;
}

function createRegularCards() {
    let tempCourses = courses.sort(function (a, b) { return b.title < a.title ? 1 : -1 });
    let html = `<div class="course-cards">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 p-0 justify-content-around">`;
    for (let i = 0; i < tempCourses.length; i++) {
        let element = tempCourses[i];
        html += createRegularCard(element);
    }
    html += `</div></div>`;
    document.getElementById('allCards').innerHTML = html;
}

function createFrontCard(course) {
    return `
        <div class="card custom-card mx-4">
            <img src="${course.image}" class="card-img-top" alt="${course.imageAlt}">
            <div class="card-body bg-dark text-center">
                <h5 class="card-title text-light">${course.title}</h5>
                <p class="card-text text-light">${course.info}</p>
                <a onclick="addToCart(${course.courseNum})" class="btn btn-primary mt-auto">${course.buttonText}</a>
            </div>
        </div>`;
}


function createRegularCard(course) {
    return ` <div class="col">    
            <div class="card custom-sub-card p-0 mx-auto mb-5">
                <img src="${course.image}" class="card-img-top" alt="${course.imageAlt}">
                <div class="card-body bg-dark text-center">
                    <h5 class="card-title text-light">${course.title}</h5>
                    <p class="card-text text-light">${course.info}</p>
                    <a onclick="addToCart(${course.courseNum})" class="btn btn-primary mt-auto">${course.buttonText}</a>
                    <p class="card-text text-light mt-1 mb-0">${course.price} SEK</p>
                </div>
            </div>
        </div>`;
}

function addToCart(id) {
    if (cart.includes(id)) {
        alert("Kursen äfinns redan i din varukorg. SLUTA TRYCKA!")
        return;
    }
    cart.push(id);
}

function createCartItems() {
    let tempCourses = courses.sort(function (a, b) { return b.title < a.title ? 1 : -1 });
    let html = `<ol class="list-group bg-dark">`;
    let sum = 0;
    for (let i = 0; i < tempCourses.length; i++) {
        let element = tempCourses[i];
        if (cart.includes(element.courseNum)) {
            html += ` <li class="d-flex justify-content-between list-group-item bg-dark text-light p-3">
            <div>${element.title}</div> <div>${element.price}SEK &emsp;
            <button onClick="removeCourseFromCart(${element.courseNum})" class="btn bg-light float-end">Ta bort</button></li></div>`;
            sum += element.price;
        }
    }
    html += `<li class="d-flex justify-content-between list-group-item bg-dark text-light p-3">
            <div>SUMMA</div> <div>${sum}SEK &emsp;
            <button onClick="checkOut()" class="btn bg-success float-end">Köp</button></li></div>`;
    html += `</ol>`;

    if (cart.length === 0) {
        html = `<h2 class="text-light">Kundvagnen är tom</h2>`
    }

    document.getElementById('displayCart').innerHTML = html;
}

function removeCourseFromCart(id) {
    let index = cart.indexOf(id);
    if (index != -1) {
        cart.splice(index, 1);
    }
    createCartItems();
}

function checkOut() {
    cart.splice(0, cart.length)
    createCartItems();
    alert("Köp genomfört!")
}


function createNewCourse() {
    let courseNum = document.getElementById("courseNum").value;
    let courseTitle = document.getElementById("courseTitle").value;    
    let courseDescription = document.getElementById("courseDescription").value;
    let courseLength = document.getElementById("courseLength").value;
    let courseImage = document.getElementById("courseImage").value;
    let courseImageAlt = document.getElementById("courseImageAlt").value;
    let coursePrice = document.getElementById("coursePrice").value;
    
    if (courseNum.length < 1) {
        alert('Kursen måste ha ett nummer.');
        return;
    }
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        if (course.courseNum === courseNum) {
            alert('Kursnumret Måste vara unikt.');
            return;
        }
    }
    if (courseTitle.length < 1) {
        alert('Kursen måste ha en titel.');
        return;
    }
    if (courseDescription.length < 1) {
        alert('Kursen måste ha en beskrivning.');
        return;
    }
    if (courseDescription.length > 120) {
        alert('Beskrivningen är för lång. Uttryck dig mer kortfattat.');
        return;
    }
    if (courseLength.length < 1) {
        alert('Kursen måste ha en längd.');
        return;
    }
    if (courseImage.length > 0) {
        if (courseImageAlt.length < 1) {
            alert('Kursen måste ha en bildtext när den har en bild.')
            return;
        }
    } else {
        courseImage = 'https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
        courseImageAlt = 'Default Image, matrix code';
    }
    if (coursePrice.length < 1) {
        alert('Kursen måste ha ett pris.');
        return;
    }

    courses.push(new Course({
        "courseNum": parseInt(courseNum, 10),
        "title": courseTitle,
        "info": courseDescription,
        "length": parseInt(courseLength, 10),
        "image": courseImage,
        "imageAlt": courseImageAlt,
        "buttonText": "Lägg till",
        "price": parseInt(coursePrice, 10),
        "orders": 0
    }));
}