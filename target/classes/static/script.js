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
    button_my.addEventListener('click', showOrdersTime);

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

function showOrdersTime() {
    console.log("showOrdersTime()");

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

    document.getElementById('details').classList.add("spinner-1");

    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res => showOutputSecond(res))
        .catch(err => console.error(err));
}

function seeNewOrders() {
    console.log("seeNewOrders()");

    document.getElementById('details').classList.add("spinner-1");

    axios.get('https://www.oksender.co/orders', {
        // timeout: 1000 * 180,
        headers: { "Access-Control-Allow-Origin": "*" }
    })
        .then(res => showOutputFirst(res))
        .catch(err => console.error(err));
}
// Show output in browser First
function showOutputFirst(res) {

    console.log(res);

    document.getElementById('details').innerHTML = `
        <table id="table" class="table">
          <thead>
           <tr>
              <th>&nbsp; Select</th>
              <th>Account</th>
              <th>OrderId</th>
              <th>Create_Date</th>
              <th>Price฿</th>
              <th>Ship฿</th>
              <th>Payment</th>
              <th>Count</th>
              <th>Status</th>        
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
        //console.log(`length: ${ordersArray.length}`);

        if (undefined !== ordersArray && ordersArray.length) {
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

                //Possible values are unpaid, pending, canceled, ready_to_ship, delivered, returned, shipped and failed.
                // if (status === "delivered" || status === "canceled" || status === "returned" || status === "failed") {
                //     continue;
                // }

                let statusShort = status;
                if (statusShort.length > 20) {
                    statusShort = statusShort.slice(0, 20) + '...'
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
              <td>${statusShort}</td>
              <td><button class="dropbutton" data-excel-button="#excel">Excel</button></td>
           </tr>
      `;
            }
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
            generateExcelStep1(id, email);
        })
    })

    const overlay = document.getElementById('overlay')

    document.getElementById('details').classList.remove("spinner-1");
}

function generateExcelStep1(id, email) {
    let reqUrl = `https://www.oksender.co/getorder?id=${id}&email=${email}`;
    console.log(reqUrl)
    axios.get(reqUrl, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res1 => generateExcelStep2(id, email, res1))
        .catch(err => console.error(err));
}

function generateExcelStep2(id, email, res1) {
    let reqUrl2 = `https://www.oksender.co/getorderitems?id=${id}&email=${email}`;
    console.log(reqUrl2)

    axios.get(reqUrl2, { headers: { "Access-Control-Allow-Origin": "*" } })
        .then(res2 => generateExcelStep3(id, email, res1, res2))
        .catch(err => console.error(err));
}

function generateExcelStep3(id, email, res1, res2) {
    console.log("step3")

    let data = { "items": [] }

    let res1AsObject = res1.data.data;
    let res2AsArray = res2.data.data;

    let voucher = res1AsObject.voucher
    let warehouse_code = res1AsObject.warehouse_code
    let order_number = res1AsObject.order_number
    let voucher_code = res1AsObject.voucher_code
    let gift_option = res1AsObject.gift_option
    let customer_last_name = res1AsObject.customer_last_name
    let price = res1AsObject.price
    let national_registration_number = res1AsObject.national_registration_number
    let payment_method = res1AsObject.payment_method
    let customer_first_name = res1AsObject.customer_first_name
    let shipping_fee = res1AsObject.shipping_fee
    let items_count = res1AsObject.items_count
    let delivery_info = res1AsObject.delivery_info
    let order_id = res1AsObject.order_id

    let address_billing = res1AsObject.address_billing
    let countryBIL = address_billing.country
    let address3BIL = address_billing.address3
    let address2BIL = address_billing.address2
    let cityBIL = address_billing.city
    let phoneBIL = address_billing.phone
    let address1BIL = address_billing.address1
    let post_codeBIL = address_billing.post_code
    let phone2BIL = address_billing.phone2
    let last_nameBIL = address_billing.last_name
    let address5BIL = address_billing.address5
    let address4BIL = address_billing.address4
    let first_nameBIL = address_billing.first_name

    let extra_attributes = res1AsObject.extra_attributes

    let address_shipping = res1AsObject.address_shipping
    let countrySHIP = address_shipping.country
    let address3SHIP = address_shipping.address3
    let address2SHIP = address_shipping.address2
    let citySHIP = address_shipping.city
    let phoneSHIP = address_shipping.phone
    let address1SHIP = address_shipping.address1
    let post_codeSHIP = address_shipping.post_code
    let phone2SHIP = address_shipping.phone2
    let last_nameSHIP = address_shipping.last_name
    let address5SHIP = address_shipping.address5
    let address4SHIP = address_shipping.address4
    let first_nameSHIP = address_shipping.first_name

    for (let i = 0; i < res2AsArray.length; i++) {
        let eachObj = res2AsArray[i];

        let paid_price = eachObj.paid_price
        let product_main_image = eachObj.product_main_image
        let tax_amount = eachObj.tax_amount
        let voucher_platform = eachObj.voucher_platform
        let reason = eachObj.reason
        let sla_time_stamp = eachObj.sla_time_stamp
        let product_detail_url = eachObj.product_detail_url
        let promised_shipping_time = eachObj.promised_shipping_time
        let warehouse_code = eachObj.warehouse_code
        let purchase_order_id = eachObj.purchase_order_id
        let voucher_seller = eachObj.voucher_seller
        let shipping_type = eachObj.shipping_type
        let created_at = eachObj.created_at
        let voucher_code = eachObj.voucher_code
        let package_id = eachObj.package_id
        let variation = eachObj.variation
        let updated_at = eachObj.updated_at
        let purchase_order_number = eachObj.purchase_order_number
        let currency = eachObj.currency
        let shipping_provider_type = eachObj.shipping_provider_type
        let sku = eachObj.sku
        let invoice_number = eachObj.invoice_number
        let order_type = eachObj.order_type
        let cancel_return_initiator = eachObj.cancel_return_initiator
        let shop_sku = eachObj.shop_sku
        let is_digital = eachObj.is_digital
        let item_price = eachObj.item_price
        let shipping_service_cost = eachObj.shipping_service_cost
        let stage_pay_status = eachObj.stage_pay_status
        let tracking_code_pre = eachObj.tracking_code_pre
        let tracking_code = eachObj.tracking_code
        let shipping_amount = eachObj.shipping_amount
        let order_item_id = eachObj.order_item_id
        let reason_detail = eachObj.reason_detail
        let shop_id = eachObj.shop_id
        let order_flag = eachObj.order_flag
        let return_status = eachObj.return_status
        let name = eachObj.name
        let shipment_provider = eachObj.shipment_provider
        let voucher_amount = eachObj.voucher_amount
        let digital_delivery_info = eachObj.digital_delivery_info
        let extra_attributes = eachObj.extra_attributes
        let order_id = eachObj.order_id
        let status = eachObj.status

        let SellerSKU = ' '
        let InvoiceRequired = ' '
        let CustomerEmail = ' '
        let ShippingRegion = ' '
        let TaxCode = ' '
        let BranchNumber = ' '
        let WalletCredits = ' '
        let CDShippingProvider = ' '
        let CDTrackingCode = ' '
        let TrackingURL = ' '
        let ShippingProviderfirstmile = ' '
        let TrackingCodefirstmile = ' '
        let TrackingURLfirstmile = ' '
        let Premium = ' '
        let Editor = ' '
        let BundleID = ' '
        let BundleDiscount = ' '
        let RefundAmount = ' '

        //////////////////////////////////////////createJSONFOREXCEL
        var eachItem = {
            order_item_id: order_item_id,
            order_type: order_type,
            order_flag: order_flag,
            shop_id: shop_id,
            SellerSKU: SellerSKU,
            shop_sku: shop_sku,
            created_at: created_at,
            updated_at: updated_at,
            order_number: order_number,
            InvoiceRequired: InvoiceRequired,
            customer_first_name: customer_first_name,
            CustomerEmail: CustomerEmail,
            national_registration_number: national_registration_number,
            first_nameSHIP: first_nameSHIP,
            address1SHIP: address1SHIP,
            address2SHIP: address2SHIP,
            address3SHIP: address3SHIP,
            address4SHIP: address4SHIP,
            address5SHIP: address5SHIP,
            phoneSHIP: phoneSHIP,
            phone2SHIP: phone2SHIP,
            citySHIP: citySHIP,
            post_codeSHIP: post_codeSHIP,
            countrySHIP: countrySHIP,
            ShippingRegion: ShippingRegion,
            first_nameBIL: first_nameBIL,
            address1BIL: address1BIL,
            address2BIL: address2BIL,
            address3BIL: address3BIL,
            address4BIL: address4BIL,
            address5BIL: address5BIL,
            phoneBIL: phoneBIL,
            phone2BIL: phone2BIL,
            cityBIL: cityBIL,
            post_codeBIL: post_codeBIL,
            countryBIL: countryBIL,
            TaxCode: TaxCode,
            BranchNumber: BranchNumber,
            extra_attributes: extra_attributes,
            payment_method: payment_method,
            paid_price: paid_price,
            item_price: item_price,
            shipping_fee: shipping_fee,
            WalletCredits: WalletCredits,
            name: name,
            variation: variation,
            CDShippingProvider: CDShippingProvider,
            shipment_provider: shipment_provider,
            shipping_type: shipping_type,
            shipping_provider_type: shipping_provider_type,
            CDTrackingCode: CDTrackingCode,
            tracking_code: tracking_code,
            TrackingURL: TrackingURL,
            ShippingProviderfirstmile: ShippingProviderfirstmile,
            TrackingCodefirstmile: TrackingCodefirstmile,
            TrackingURLfirstmile: TrackingURLfirstmile,
            promised_shipping_time: promised_shipping_time,
            Premium: Premium,
            status: status,
            cancel_return_initiator: cancel_return_initiator,
            reason: reason,
            reason_detail: reason_detail,
            Editor: Editor,
            BundleID: BundleID,
            BundleDiscount: BundleDiscount,
            RefundAmount: RefundAmount
        };

        data.items.push(eachItem);
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
// Show output in browser Second
function showOutputSecond(res) {
    console.log(res);

    document.getElementById('details').innerHTML = `
        <table id="table" class="table">
          <thead>
           <tr>
              <th>&nbsp; Select</th>
              <th>Account</th>
              <th>OrderId</th>
              <th>Create_Date</th>
              <th>Price฿</th>
              <th>Ship฿</th>
              <th>Payment</th>
              <th>Count</th>
              <th>Status</th>
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
        //console.log(`length: ${ordersArray.length}`);

        if (undefined !== ordersArray && ordersArray.length) {
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

                // if (status === "delivered" || status === "canceled") {
                //     continue;
                // }

                let statusShort = status;
                if (statusShort.length > 20) {
                    statusShort = statusShort.slice(0, 20) + '...'
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
                 <td>${statusShort}</td>
                 <td><button class="dropbutton" data-excel-button="#excel">Excel</button></td>
              </tr>
              `;
            }
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
            generateExcelStep1(id, email);
        })
    })

    const overlay = document.getElementById('overlay')
    document.getElementById('details').classList.remove("spinner-1");
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

        let statusShort = status;
        if (statusShort.length > 20) {
            statusShort = statusShort.slice(0, 20) + '...'
        }

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
                    <td>${statusShort}</td>
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
    // let ws_data = [
    //     [
    //         'Order Item Id',
    //         'Order Type',
    //         'Order Flag',
    //         'Lazada Id',
    //         'Seller SKU',
    //         'Lazada SKU'
    //     ],
    //     [
    //         data.items[0].order_item_id,
    //         data.items[0].order_type,
    //         data.items[0].order_flag,
    //         data.items[0].shop_id,
    //         data.items[0].shop_sku
    //     ],
    // ];

    let ws_data = [
        [
            'Order Item Id',
            'Order Type',
            'Order Flag',
            'Shop Id',
            'Seller SKU',
            'Shop SKU',
            'Created at',
            'Updated at',
            'Order Number',
            'Invoice Required',
            'Customer Name',
            'Customer Email',
            'National Registration Number',
            'Shipping Name',
            'Shipping Address',
            'Shipping Address2',
            'Shipping Address3',
            'Shipping Address4',
            'Shipping Address5',
            'Shipping Phone Number',
            'Shipping Phone Number2',
            'Shipping City',
            'Shipping Postcode',
            'Shipping Country',
            'Shipping Region',
            'Billing Name',
            'Billing Address',
            'Billing Address2',
            'Billing Address3',
            'Billing Address4',
            'Billing Address5',
            'Billing Phone Number',
            'Billing Phone Number2',
            'Billing City',
            'Billing Postcode',
            'Billing Country',
            'Tax Code',
            'Branch Number',
            'Extra Attributes',
            'Payment Method',
            'Paid Price',
            'Unit Price',
            'Shipping Fee',
            'Wallet Credits',
            'Item Name',
            'Variation',
            'CD Shipping Provider',
            'Shipping Provider',
            'Shipment Type Name',
            'Shipping Provider Type',
            'CD Tracking Code',
            'Tracking Code',
            'Tracking URL',
            'Shipping Provider (first mile)',
            'Tracking Code (first mile)',
            'Tracking URL (first mile)',
            'Promised shipping time',
            'Premium',
            'Status',
            'Cancel / Return Initiator',
            'Reason',
            'Reason Detail',
            'Editor',
            'Bundle ID',
            'Bundle Discount',
            'Refund Amount'
        ]
    ];

    for (let e = 0; e < 10; e++) {
        try {
            let each = []
            each.push(data.items[e].order_item_id)
            each.push(data.items[e].order_type)
            each.push(data.items[e].order_flag)
            each.push(data.items[e].shop_id)
            each.push(data.items[e].SellerSKU)
            each.push(data.items[e].shop_sku)
            each.push(data.items[e].created_at)
            each.push(data.items[e].updated_at)
            each.push(data.items[e].order_number)
            each.push(data.items[e].InvoiceRequired)
            each.push(data.items[e].customer_first_name)
            each.push(data.items[e].CustomerEmail)
            each.push(data.items[e].national_registration_number)
            each.push(data.items[e].first_nameSHIP)
            each.push(data.items[e].address1SHIP)
            each.push(data.items[e].address2SHIP)
            each.push(data.items[e].address3SHIP)
            each.push(data.items[e].address4SHIP)
            each.push(data.items[e].address5SHIP)
            each.push(data.items[e].phoneSHIP)
            each.push(data.items[e].phone2SHIP)
            each.push(data.items[e].citySHIP)
            each.push(data.items[e].post_codeSHIP)
            each.push(data.items[e].countrySHIP)
            each.push(data.items[e].ShippingRegion)
            each.push(data.items[e].first_nameBIL)
            each.push(data.items[e].address1BIL)
            each.push(data.items[e].address2BIL)
            each.push(data.items[e].address3BIL)
            each.push(data.items[e].address4BIL)
            each.push(data.items[e].address5BIL)
            each.push(data.items[e].phoneBIL)
            each.push(data.items[e].phone2BIL)
            each.push(data.items[e].cityBIL)
            each.push(data.items[e].post_codeBIL)
            each.push(data.items[e].countryBIL)
            each.push(data.items[e].TaxCode)
            each.push(data.items[e].BranchNumber)
            each.push(data.items[e].extra_attributes)
            each.push(data.items[e].payment_method)
            each.push(data.items[e].paid_price)
            each.push(data.items[e].item_price)
            each.push(data.items[e].shipping_fee)
            each.push(data.items[e].WalletCredits)
            each.push(data.items[e].name)
            each.push(data.items[e].variation)
            each.push(data.items[e].CDShippingProvider)
            each.push(data.items[e].shipment_provider)
            each.push(data.items[e].shipping_type)
            each.push(data.items[e].shipping_provider_type)
            each.push(data.items[e].CDTrackingCode)
            each.push(data.items[e].tracking_code)
            each.push(data.items[e].TrackingURL)
            each.push(data.items[e].ShippingProviderfirstmile)
            each.push(data.items[e].TrackingCodefirstmile)
            each.push(data.items[e].TrackingURLfirstmile)
            each.push(data.items[e].promised_shipping_time)
            each.push(data.items[e].Premium)
            each.push(data.items[e].status)
            each.push(data.items[e].cancel_return_initiator)
            each.push(data.items[e].reason)
            each.push(data.items[e].reason_detail)
            each.push(data.items[e].Editor)
            each.push(data.items[e].BundleID)
            each.push(data.items[e].BundleDiscount)
            each.push(data.items[e].RefundAmount)

            ws_data.push(each);
        }
        catch (err) {
            console.log(err)
        }
    }

    return ws_data
}
