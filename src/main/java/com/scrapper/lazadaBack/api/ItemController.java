package com.scrapper.lazadaBack.api;

import com.scrapper.lazadaBack.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;



@Controller
public class ItemController {

  //https://www.lazada.com/?code=0_tryzThknf4684883sd5c1d5
  //http://localhost:8080/?code=0_tryzThknf4684883sd5c1d5

  @Autowired
  ItemService itemService;

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
  public String GetOrdersForGivenTime(@PathVariable("created_before") String created_before, @PathVariable("created_after") String created_after) {
    System.out.println("ItemController: GetOrdersForGivenTime()");
    return itemService.getOrdersForGivenTime(created_before, created_after);
  }

  //http://localhost:8080/
  @CrossOrigin(origins = "*")
  @RequestMapping("/")
  public String showIndex() {
    return "index";
  }

}

