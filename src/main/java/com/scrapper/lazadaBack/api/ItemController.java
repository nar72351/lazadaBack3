package com.scrapper.lazadaBack.api;

import com.scrapper.lazadaBack.model.Globals;
import com.scrapper.lazadaBack.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class ItemController {

  @Autowired
  ItemService itemService;

  @EventListener(ApplicationReadyEvent.class)
  public void doSomethingAfterStartup() {
    Globals.initTokens();
  }


//  @RequestMapping("/")
//  public void getCode1(@RequestParam("code") String code) {
//    System.out.println("1-CODE: " + code);
//    itemService.writeCode(code);
//  }
//
//  @RequestMapping("/{code}")
//  public void getCode2(@PathVariable("code") String code) {
//    System.out.println("2-CODE: " + code);
//    itemService.writeCode(code);
//  }

  //http://localhost:8080/orders
  @CrossOrigin(origins = "*")
  @GetMapping("/orders")
  @ResponseBody
  public String getOrders() {
    System.out.println("ItemController: getOrders()");
    //System.out.println(itemService.isExpired());
    return itemService.getOrders();
  }

  //http://localhost:8080/2020-06-24/2020-01-10
  //https://www.oksender.co/2020-06-24/2020-01-10
  @CrossOrigin(origins = "*")
  @GetMapping(value = "/{created_before}/{created_after}")
  @ResponseBody
  public String getOrdersForGivenTime(@PathVariable("created_before") String created_before, @PathVariable("created_after") String created_after) {
    System.out.println("ItemController: GetOrdersForGivenTime()");
    return itemService.getOrdersForGivenTime(created_before, created_after);
  }

  //http://localhost:8080/cancel?id=123-1&email=email1&value=text1
  @CrossOrigin(origins = "*")
  @RequestMapping("/cancel")
  @ResponseBody
  public String cancelTheOrder(@RequestParam String id, @RequestParam String email, @RequestParam String value) {
    System.out.println("ItemController: cancelTheOrder()");
    System.out.println("Resp: " + id + " - " + email + " - " + value);
    return itemService.cancelTheOrder(id, email, value);
  }

  //http://localhost:8080/invoice?id=123-2&email=email1&value=text2
  @CrossOrigin(origins = "*")
  @RequestMapping("/invoice")
  @ResponseBody
  public String setInvoiceNumber(@RequestParam String id, @RequestParam String email, @RequestParam String value) {
    System.out.println("ItemController: setInvoiceNumber()");
    System.out.println("Resp: " + id + " - " + email + " - " + value);
    return itemService.setInvoiceNumber(id, email, value);
  }

  //http://localhost:8080/packed?id=123-3&email=email1&value=text3
  @CrossOrigin(origins = "*")
  @RequestMapping("/packed")
  @ResponseBody
  public String markPacked(@RequestParam String id, @RequestParam String email, @RequestParam String value) {
    System.out.println("ItemController: markPacked()");
    System.out.println("Resp: " + id + " - " + email + " - " + value);
    return itemService.markPacked(id, email, value);
  }

  //http://localhost:8080/delivered?id=123-4&email=email1&value=text4
  @CrossOrigin(origins = "*")
  @RequestMapping("/delivered")
  @ResponseBody
  public String markDelivered(@RequestParam String id, @RequestParam String email, @RequestParam String value) {
    System.out.println("ItemController: markDelivered()");
    System.out.println("Resp: " + id + " - " + email + " - " + value);
    return itemService.markDelivered(id, email, value);
  }

  //http://localhost:8080/ship?id=123-5&email=email1&value1=text1&value2=text2
  @CrossOrigin(origins = "*")
  @RequestMapping("/ship")
  @ResponseBody
  public String markReadyToShip(@RequestParam String id, @RequestParam String email, @RequestParam String value1, @RequestParam String value2) {
    System.out.println("ItemController: markReadyToShip()");
    System.out.println("Resp: " + id + " - " + email + " - " + value1 + " - " + value2);
    return itemService.markReadyToShip(id, email, value1, value2);
  }

  //http://localhost:8080/getorderitems?id=123-1&email=email1
  // http://localhost:8080/getorderitems?id=311458148649838&email=prai@psselection.com
  @CrossOrigin(origins = "*")
  @RequestMapping("/getorderitems")
  @ResponseBody
  public String getOrderItems(@RequestParam String id, @RequestParam String email) {
    System.out.println("ItemController: getOrderItems()");
    System.out.println("Resp: " + id + " - " + email);
    return itemService.getOrderItems(id, email);
  }

  //http://localhost:8080/
  @CrossOrigin(origins = "*")
  @RequestMapping("/")
  public String showIndex() {
    return "index";
  }

}

