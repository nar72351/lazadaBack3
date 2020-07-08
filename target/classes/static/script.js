document.getElementById('seeNewOrders').addEventListener('click', seeNewOrders);
document.getElementById('ordersWithTime').addEventListener('click', ordersWithTime);

function ordersWithTime() {
    console.log("ordersWithTime()");

    document.getElementById('details').innerHTML = `
    <div class="date-picker1">
        <div class="selected-date1"></div>

    <div class="dates1">
        <div class="month1">
            <div class="arrows1 prev-mth1">&lt;</div>
            <div class="mth1"></div>
            <div class="arrows1 next-mth1">&gt;</div>
        </div>

        <div class="days1"></div>
     </div>
    </div>
    
    <div class="date-picker2">
    <div class="selected-date2"></div>

    <div class="dates2">
        <div class="month2">
            <div class="arrows2 prev-mth2">&lt;</div>
            <div class="mth2"></div>
            <div class="arrows2 next-mth2">&gt;</div>
        </div>

        <div class="days2"></div>
     </div>
    </div>

    <div>
       <a class="button-my" role="button" tabindex="0" >Show Orders</a>
    </div>

    <div class="invisible">      
    </div>

   `;

    button_my = document.querySelector('.button-my');
    button_my.addEventListener('click', showOrders);

    //////////////////////11
    date_picker_element1 = document.querySelector('.date-picker1');
    selected_date_element1 = document.querySelector('.date-picker1 .selected-date1');
    dates_element1 = document.querySelector('.date-picker1 .dates1');
    mth_element1 = document.querySelector('.date-picker1 .dates1 .month1 .mth1');
    next_mth_element1 = document.querySelector('.date-picker1 .dates1 .month1 .next-mth1');
    prev_mth_element1 = document.querySelector('.date-picker1 .dates1 .month1 .prev-mth1');
    days_element1 = document.querySelector('.date-picker1 .dates1 .days1');

    mth_element1.textContent = months1[month1] + ' ' + year1;

    selected_date_element1.textContent = 'Created before:   ' + formatDate(date1);
    selected_date_element1.dataset.value = selectedDate1;

    populateDates1();

    // EVENT LISTENERS
    date_picker_element1.addEventListener('click', toggleDatePicker1);
    next_mth_element1.addEventListener('click', goToNextMonth1);
    prev_mth_element1.addEventListener('click', goToPrevMonth1);

    //////////////////////22
    date_picker_element2 = document.querySelector('.date-picker2');
    selected_date_element2 = document.querySelector('.date-picker2 .selected-date2');
    dates_element2 = document.querySelector('.date-picker2 .dates2');
    mth_element2 = document.querySelector('.date-picker2 .dates2 .month2 .mth2');
    next_mth_element2 = document.querySelector('.date-picker2 .dates2 .month2 .next-mth2');
    prev_mth_element2 = document.querySelector('.date-picker2 .dates2 .month2 .prev-mth2');
    days_element2 = document.querySelector('.date-picker2 .dates2 .days2');

    mth_element2.textContent = months2[month2] + ' ' + year2;

    selected_date_element2.textContent = 'Created after:   ' + formatDate(date2);
    selected_date_element2.dataset.value = selectedDate2;

    populateDates2();

    // EVENT LISTENERS
    date_picker_element2.addEventListener('click', toggleDatePicker2);
    next_mth_element2.addEventListener('click', goToNextMonth2);
    prev_mth_element2.addEventListener('click', goToPrevMonth2);
}


function showOrders() {
    console.log("showOrders()");

    let created_before = document.querySelector(".selected-date1").textContent;
    let created_after = document.querySelector(".selected-date2").textContent;

    created_before = created_before.replace("Created before:", "").trim();
    created_after = created_after.replace("Created after:", "").trim();

    let D1 = created_before.split("-");
    created_before = D1[2] + "-" + D1[1] + "-" + D1[0];

    let D2 = created_after.split("-");
    created_after = D2[2] + "-" + D2[1] + "-" + D2[0];

    console.log(created_before);
    console.log(created_after);

    //https://www.oksender.co/2020-06-24/2020-01-10
    let reqUrl = `https://www.oksender.co/${created_before}/${created_after}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res => showOutput1(res))
        .catch(err => console.error(err));
}


function seeNewOrders() {
    console.log("seeNewOrders()");

    axios.get('https://www.oksender.co/orders', {
        headers: { "Access-Control-Allow-Origin": "*" }
    })
        .then(res => showOutput1(res))
        .catch(err => console.error(err));
}


// Show output in browser
function showOutput1(res) {
    console.log(res);

    document.getElementById('details').innerHTML = `
        <table id="table" class="table">
          <thead>
           <tr>
              <th>Options</th>
              <th>Account</th>
              <th>OrderId</th>
              <th>Date</th>
              <th>Price ฿</th>
              <th>Ship ฿</th>
              <th>Payment</th>
              <th>Count</th>
              <th>Status</th>
              <th>Warehouse</th>
           </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      `;

    let jsonArray = res.data;
    console.log(`jsonArray: ${jsonArray.length}`);

    for (let e = 0; e < jsonArray.length; e++) {
        let eachJson = jsonArray[e];

        let email_address = eachJson.email_address;
        let dataObj = eachJson.data;
        let ordersArray = dataObj.orders;
        console.log(`length: ${ordersArray.length}`);

        for (let i = 0; i < ordersArray.length; i++) {
            let eachObj = ordersArray[i];

            let order_number = eachObj.order_number;
            let created_at = eachObj.created_at;
            var createDate = created_at.slice(0, 20);
            let price = eachObj.price;
            let payment_method = eachObj.payment_method;
            let shipping_fee = eachObj.shipping_fee;
            let items_count = eachObj.items_count;
            let status = eachObj.statuses[0];
            let warehouse_code = eachObj.warehouse_code;

            if (status === "delivered" || status === "canceled") {
                continue;
            }

            document.querySelector('.details tbody').innerHTML += `
            <tr>
              <td> 	 
                 <div class="dropdown">
                    <button class="dropbutton"> Select <i class="fas fa-caret-down"></i></button>
                    <div class="dropdown-content">
                           <div>
                               <input type="text" class="textbox_reason" placeholder="Type the reason here.">
                               <a role="button" tabindex="0" id="cancelTheOrder"> Cancel the order</a>
                           </div>
                           <div>
                               <input type="text"  class="textbox_invoice" placeholder="Type the invoice number here.">
                               <a role="button" tabindex="0" id="setInvoiceNumber"> Set Invoice Number</a>
                           </div>
                           <div>
                               <input type="text" class="textbox_shipment1" placeholder="Type the shipment provider here.">
                               <a role="button" tabindex="0" id="markPacked">Mark as being packed</a>
                           </div>
                           <div>
                               <input type="text" class="textbox_message" placeholder="Type the delivery message here.">
                               <a role="button" tabindex="0" id="markDelivered">Mark as being delivered</a>
                           </div>
                           <div class="input-container">
                               <div>
                                   <input type="text" class="textbox_shipment2" placeholder="Type the shipment provider here.">
                                   <input type="text" class="textbox_tracking" placeholder="Type the tracking number here.">
                               </div>
                               <a role="button" tabindex="0" id="markReadyToShip">Mark as being ready to ship</a>
                           </div>
                    </div>
                 </div> 
              </td>
              <td>${email_address}</td>
              <td>${order_number}</td>
              <td>${createDate}</td>
              <td>${price}</td>
              <td>${shipping_fee}</td>
              <td>${payment_method}</td>        
              <td>${items_count}</td>
              <td>${status}</td>
              <td>${warehouse_code}</td>
           </tr>
      `;
        }
    }

    document.querySelectorAll('#cancelTheOrder').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();

            //let inputValue = document.getElementById('textbox_reason').value;

            let inputValue = event.target.parentElement.querySelector('․textbox_reason').value;

            cancelTheOrder(id, email, inputValue);
        })
    })

    document.querySelectorAll('#setInvoiceNumber').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();

            let inputValue = event.target.parentElement.querySelector('․textbox_invoice').value;

            setInvoiceNumber(id, email, inputValue);
        })
    })

    document.querySelectorAll('#markPacked').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();

            let inputValue = event.target.parentElement.querySelector('․textbox_shipment1').value;

            markPacked(id, email, inputValue);
        })
    })

    document.querySelectorAll('#markDelivered').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();

            let inputValue = event.target.parentElement.querySelector('․textbox_message').value;

            markDelivered(id, email, inputValue);
        })
    })

    document.querySelectorAll('#markReadyToShip').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();

            let inputValue1 = event.target.parentElement.querySelector('․textbox_shipment2').value;
            let inputValue2 = event.target.parentElement.querySelector('․textbox_tracking').value;

            markReadyToShip(id, email, inputValue1, inputValue2);
        })
    })
}

function cancelTheOrder(id, email, inputValue) {
    //https://www.oksender.co/cancel?id=123-1&email=email1&value=text1
    let reqUrl = `https://www.oksender.co/cancel?id=${id}&email=${email}&value=${inputValue}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(function (res) {
            let dataObj = res.data;
            let message = dataObj.message;

            if (typeof message === "undefined") {
                console.log("SUCCESS");
            } else {
                console.log("FAILURE");
                alert(message);
            }
        })
        .catch(err => console.error(err));
}

function setInvoiceNumber(id, email, inputValue) {
    //https://www.oksender.co/invoice?id=123-2&email=email2&value=text2
    let reqUrl = `https://www.oksender.co/invoice?id=${id}&email=${email}&value=${inputValue}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(function (res) {
            let dataObj = res.data;
            let message = dataObj.message;

            if (typeof message === "undefined") {
                console.log("SUCCESS");
            } else {
                console.log("FAILURE");
                alert(message);
            }
        })
        .catch(err => console.error(err));
}

function markPacked(id, email, inputValue) {
    //https://www.oksender.co/packed?id=123-3&email=email3&value=text3
    let reqUrl = `https://www.oksender.co/packed?id=${id}&email=${email}&value=${inputValue}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(function (res) {
            let dataObj = res.data;
            let message = dataObj.message;

            if (typeof message === "undefined") {
                console.log("SUCCESS");
            } else {
                console.log("FAILURE");
                alert(message);
            }
        })
        .catch(err => console.error(err));
}

function markDelivered(id, email, inputValue) {
    //https://www.oksender.co/delivered?id=123-4&email=email4&value=text4
    let reqUrl = `https://www.oksender.co/delivered?id=${id}&email=${email}&value=${inputValue}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(function (res) {
            let dataObj = res.data;
            let message = dataObj.message;

            if (typeof message === "undefined") {
                console.log("SUCCESS");
            } else {
                console.log("FAILURE");
                alert(message);
            }
        })
        .catch(err => console.error(err));
}

function markReadyToShip(id, email, inputValue1, inputValue2) {
    //https://www.oksender.co/ship?id=123-5&email=email5&value1=text1&value2=text2
    let reqUrl = `https://www.oksender.co/ship?id=${id}&email=${email}&value1=${inputValue1}&value2=${inputValue2}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(function (res) {
            let dataObj = res.data;
            let message = dataObj.message;

            if (typeof message === "undefined") {
                console.log("SUCCESS");
            } else {
                console.log("FAILURE");
                alert(message);
            }
        })
        .catch(err => console.error(err));
}

let button_my
///////////////////////////////////////////////Calendar1111
let date_picker_element1
let selected_date_element1
let dates_element1
let mth_element1
let next_mth_element1
let prev_mth_element1
let days_element1

const months1 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date1 = new Date();
let day1 = date1.getDate();
let month1 = date1.getMonth();
let year1 = date1.getFullYear();

let selectedDate1 = date1;
let selectedDay1 = day1;
let selectedMonth1 = month1;
let selectedYear1 = year1;

// FUNCTIONS
function toggleDatePicker1(e) {
    if (!checkEventPathForClass(e.path, 'dates1')) {
        dates_element1.classList.toggle('active');
    }
}

function goToNextMonth1(e) {
    month1++;
    if (month1 > 11) {
        month1 = 0;
        year1++;
    }
    mth_element1.textContent = months1[month1] + ' ' + year1;
    populateDates1();
}

function goToPrevMonth1(e) {
    month1--;
    if (month1 < 0) {
        month1 = 11;
        year1--;
    }
    mth_element1.textContent = months1[month1] + ' ' + year1;
    populateDates1();
}

function populateDates1(e) {
    days_element1.innerHTML = '';
    let amount_days1 = 31;

    if (month1 == 1) {
        amount_days1 = 29;
    }
    if (month1 == 3 || month1 == 5 || month1 == 8 || month1 == 10) {
        amount_days1 = 30;
    }

    for (let i = 0; i < amount_days1; i++) {
        const day_element1 = document.createElement('div');
        day_element1.classList.add('day1');
        day_element1.textContent = i + 1;

        if (selectedDay1 == (i + 1) && selectedYear1 == year1 && selectedMonth1 == month1) {
            day_element1.classList.add('selected');
        }

        day_element1.addEventListener('click', function () {
            selectedDate1 = new Date(year1 + '-' + (month1 + 1) + '-' + (i + 1));
            selectedDay1 = (i + 1);
            selectedMonth1 = month1;
            selectedYear1 = year1;

            selected_date_element1.textContent = 'Created before:   ' + formatDate(selectedDate1);
            selected_date_element1.dataset.value = selectedDate1;

            populateDates1();
        });

        days_element1.appendChild(day_element1);
    }
    //console.log(formatDate(selectedDate))
}


///////////////////////////////////////////////Calendar2222
let date_picker_element2
let selected_date_element2
let dates_element2
let mth_element2
let next_mth_element2
let prev_mth_element2
let days_element2

const months2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let date2 = new Date();
let day2 = date2.getDate();
let month2 = date2.getMonth();
let year2 = date2.getFullYear();

let selectedDate2 = date2;
let selectedDay2 = day2;
let selectedMonth2 = month2;
let selectedYear2 = year2;

// FUNCTIONS
function toggleDatePicker2(e) {
    if (!checkEventPathForClass(e.path, 'dates2')) {
        dates_element2.classList.toggle('active');
    }
}

function goToNextMonth2(e) {
    month1++;
    if (month1 > 11) {
        month1 = 0;
        year1++;
    }
    mth_element2.textContent = months2[month2] + ' ' + year2;
    populateDates2();
}

function goToPrevMonth2(e) {
    month2--;
    if (month2 < 0) {
        month2 = 11;
        year2--;
    }
    mth_element2.textContent = months2[month2] + ' ' + year2;
    populateDates2();
}

function populateDates2(e) {
    days_element2.innerHTML = '';
    let amount_days2 = 31;

    if (month2 == 1) {
        amount_days2 = 29;
    }
    if (month2 == 3 || month2 == 5 || month2 == 8 || month2 == 10) {
        amount_days2 = 30;
    }

    for (let i = 0; i < amount_days2; i++) {
        const day_element2 = document.createElement('div');
        day_element2.classList.add('day2');
        day_element2.textContent = i + 1;

        if (selectedDay2 == (i + 1) && selectedYear2 == year2 && selectedMonth2 == month2) {
            day_element2.classList.add('selected');
        }

        day_element2.addEventListener('click', function () {
            selectedDate2 = new Date(year2 + '-' + (month2 + 1) + '-' + (i + 1));
            selectedDay2 = (i + 1);
            selectedMonth2 = month2;
            selectedYear2 = year2;

            selected_date_element2.textContent = 'Created after:   ' + formatDate(selectedDate2);
            selected_date_element2.dataset.value = selectedDate2;

            populateDates2();
        });

        days_element2.appendChild(day_element2);
    }
    //console.log(formatDate(selectedDate))
}


// HELPER FUNCTIONS
function checkEventPathForClass(path, selector) {
    for (let i = 0; i < path.length; i++) {
        if (path[i].classList && path[i].classList.contains(selector)) {
            return true;
        }
    }
    return false;
}

function formatDate(d) {
    let day = d.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    let month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    let year = d.getFullYear();

    return day + '-' + month + '-' + year;
}

function refreshPage() {
    window.location.reload();
}

