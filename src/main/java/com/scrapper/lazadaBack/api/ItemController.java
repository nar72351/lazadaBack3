package com.scrapper.lazadaBack.api;


import com.scrapper.lazadaBack.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
public class ItemController {
  //https://www.lazada.com/?code=0_tryzThknf4684883sd5c1d5
  //http://localhost:8080/?code=0_tryzThknf4684883sd5c1d5

  @Autowired
  ItemService itemService;

  @RequestMapping("/")
  public void getCode1(@RequestParam("code") String code) {
    System.out.println("1-CODE: " + code);
    itemService.writeCode(code);
  }

  @RequestMapping("/{code}")
  public void getCode2(@PathVariable("code") String code) {
    System.out.println("2-CODE: " + code);
    itemService.writeCode(code);
  }

}

