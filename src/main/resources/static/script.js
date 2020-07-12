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
        // timeout: 1000 * 180,
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
              <th>&nbsp; Select</th>
              <th>Account</th>
              <th>OrderId</th>
              <th>Date</th>
              <th>Price฿</th>
              <th>Ship฿</th>
              <th>Payment</th>
              <th>Count</th>
              <th>Status</th>
              <th>Warehouse</th>
              <th>Export</th>
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
               <button class="dropbutton" data-modal-target="#modal">Details</button>
                <div class="modal" id="modal">
                  <div class="modal-header">
                    <div class="title">Order Item Details</div>
                    <button data-close-button class="close-button">&times;</button>
                  </div>
                  <div class="modal-body">
                  </div>
                </div>
              <div id="overlay"></div>
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
              <td><button class="dropbutton" data-excel-button="#excel">Excel</button></td>
           </tr>
      `;
        }
    }

    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget)
            modal.classList.add('active')
            let innerText = event.target.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();
            overlay.classList.add('active')
            getOrderItems(modal, id, email);
        })
    })

    document.querySelectorAll('[data-close-button]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal')
            modal.classList.remove('active')
            overlay.classList.remove('active')
        })
    })

    document.querySelectorAll('[data-excel-button]').forEach(button => {
        button.addEventListener('click', () => {
            let innerText = event.target.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let email = tdList[2].replace("</td>", "").trim();
            let id = tdList[3].replace("</td>", "").trim();
            generateExcel(id, email);
        })
    })

    const overlay = document.getElementById('overlay')

}

function generateExcel(id, email) {
    //////////////////////////////////////////getOrder
    let orderJson;
    //https://www.oksender.co/getorder?id=309231430723018&email=adventuretimelzd1@thairiches.com
    let reqUrl1 = `https://www.oksender.co/getorder?id=${id}&email=${email}`;
    console.log(reqUrl1)

    axios.get(reqUrl1, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res1 => orderJson = res1)
        .catch(err1 => console.error(err1));
    console.log(orderJson)

    //////////////////////////////////////////getOrderItems
    let orderItemsJson;
    //https://www.oksender.co/getorderitems?id=309231430723018&email=adventuretimelzd1@thairiches.com
    let reqUrl2 = `https://www.oksender.co/getorderitems?id=${id}&email=${email}`;
    console.log(reqUrl2)

    axios.get(reqUrl2, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res2 => orderItemsJson = res2)
        .catch(err2 => console.error(err2));
    console.log(orderItemsJson)

    //////////////////////////////////////////createJSONFOREXCEL
    const data = {
        "student": id,
        "object": email,
        "passes": [
            {
                "N": 5,
                "date": "2018-09-17T00:00:00.000Z",
                "topic": "Сжатый пересказ (Изложение).  Развитие речи.",
                "homework": "Изложение",
                "control": "Ур.",
                "teacher": "Быкова Елена Николаевна"
            },
            {
                "N": 6,
                "date": "2018-09-17T00:00:00.000Z",
                "topic": "Орфограммы в корнях слов. Повторительно-обобщающий урок.",
                "homework": "Карточки",
                "control": "Тест",
                "teacher": "Быкова Елена Николаевна"
            }
        ]
    }

    //////////////////////////////////////////exportExcel
    var today = getTodaysDate();

    let wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "SheetJS Tutorial",
        Subject: "Test file",
        Author: "Red Stapler",
        CreatedDate: new Date(Date.now())
    };
    wb.SheetNames.push(today);
    let ws_data = converToArray(data);
    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets[today] = ws;

    let wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

    saveAs(new Blob([s2ab(wbOut)], { type: "application/octet-stream" }), `order-list-export-${today}.xlsx`)

}
function getOrderItems(modal, id, email) {

    //https://www.oksender.co/getorderitems?id=311458148649838&email=prai@psselection.com
    let reqUrl = `https://www.oksender.co/getorderitems?id=${id}&email=${email}`;
    console.log(reqUrl)

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res => showOrderItems(res, modal, email))
        .catch(err => console.error(err));
}

function showOrderItems(res, modal, email_address) {
    console.log(res);

    modal.parentElement.querySelector('.modal-body').innerHTML = `
        <table id="table" class="table">
          <thead>
           <tr>
              <th>Options</th>
              <th>See items</th>
              <th>Account</th>
              <th>Item Id</th>   
              <th>Item SKU</th>         
              <th>Price/PaidPrice ฿</th>
              <th>Tax ฿</th>
              <th>Date</th>
              <th>Status</th>
             </tr>
          </thead>
          <tbody>
        
          </tbody>
        </table>
      `;

    let jsonArray = res.data.data;
    console.log(`jsonArray2: ${jsonArray.length}`);

    for (let i = 0; i < jsonArray.length; i++) {
        let eachObj = jsonArray[i];

        let product_detail_url = eachObj.product_detail_url;
        let item_price = eachObj.item_price;
        let paid_price = eachObj.paid_price;
        let tax_amount = eachObj.tax_amount;
        let shipping_type = eachObj.shipping_type;
        let created_at = eachObj.created_at;
        var createDate = created_at.slice(0, 20);
        let package_id = eachObj.package_id;
        let sku = eachObj.sku;
        let invoice_number = eachObj.invoice_number;
        let tracking_code = eachObj.tracking_code;
        let order_item_id = eachObj.order_item_id;
        let shop_id = eachObj.shop_id;
        let name = eachObj.name;
        let status = eachObj.status;

        modal.parentElement.querySelector('.modal-body tbody').innerHTML += `
                <tr>
                    <td> 	 
                       <div class="dropdown">
                          <button class="dropbutton"> Select <i class="fas fa-caret-down"></i></button>
                          <div class="dropdown-content">
                                 <div>
                                     <input type="text" class="textbox_reason" placeholder="Type the reason here.">
                                     <a role="button" tabindex="0" id="cancelTheOrder"> Cancel the Item</a>
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
                    <td> <a class="item-page-btn" href="${product_detail_url}" target="_blank">Item page <i class="fas fa-caret-right"></i></a> </td>
                    <td>${email_address}</td>
                    <td>${order_item_id}</td> 
                    <td>${sku}</td>           
                    <td>${item_price} / ${paid_price}</td>
                    <td>${tax_amount}</td>
                    <td>${createDate}</td>
                    <td>${status}</td>
 
                 </tr>
            `;
    }

    document.querySelectorAll('#cancelTheOrder').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let id = tdList[4].replace("</td>", "").trim();
            let inputValue = event.target.parentElement.querySelector('.textbox_reason').value;

            cancelTheOrder(id, email_address, inputValue);
        })
    })

    document.querySelectorAll('#setInvoiceNumber').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let id = tdList[4].replace("</td>", "").trim();

            let inputValue = event.target.parentElement.querySelector('.textbox_invoice').value;

            setInvoiceNumber(id, email_address, inputValue);
        })
    })

    document.querySelectorAll('#markPacked').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let id = tdList[4].replace("</td>", "").trim();

            let inputValue = event.target.parentElement.querySelector('.textbox_shipment1').value;

            markPacked(id, email_address, inputValue);
        })
    })

    document.querySelectorAll('#markDelivered').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let id = tdList[4].replace("</td>", "").trim();

            let inputValue = event.target.parentElement.querySelector('.textbox_message').value;

            markDelivered(id, email_address, inputValue);
        })
    })

    document.querySelectorAll('#markReadyToShip').forEach(item => {
        item.addEventListener('click', event => {
            let innerText = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML;
            let tdList = innerText.split("<td>");
            let id = tdList[4].replace("</td>", "").trim();

            let inputValue1 = event.target.parentElement.querySelector('.textbox_shipment2').value;
            let inputValue2 = event.target.parentElement.querySelector('.textbox_tracking').value;

            markReadyToShip(id, email_address, inputValue1, inputValue2);
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

function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    return today;
}

function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF
    }
    return buf;
}


function converToArray(data) {
    let ws_data = [
        ['', '', '', '', data.student],
        ['', '', '', '', data.object],
        ['N', 'date', 'topic', 'homework', 'control', 'teacher'],
        [data.passes[0].N, data.passes[0].date, data.passes[0].topic, data.passes[0].homework, data.passes[0].control, data.passes[0].teacher],
        [data.passes[1].N, data.passes[1].date, data.passes[1].topic, data.passes[1].homework, data.passes[1].control, data.passes[1].teacher],
    ];
    return ws_data
}