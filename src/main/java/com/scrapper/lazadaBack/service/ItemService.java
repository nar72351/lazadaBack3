package com.scrapper.lazadaBack.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.lazada.lazop.api.LazopClient;
import com.lazada.lazop.api.LazopRequest;
import com.lazada.lazop.api.LazopResponse;
import com.scrapper.lazadaBack.model.Globals;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@org.springframework.stereotype.Service

public class ItemService {
  private static FileWriter fileWriter;
  private String fileName = "code.txt";


  public String getOrdersForGivenTime(String created_before, String created_after) {
    String ordersForGivenTime = "No new ordersForGivenTime yet...";
    System.out.println("getOrdersForGivenTime");
    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);

      String access_token = gerRefreshedAccessToken(refresh_token);
      System.out.println("access_token: " + access_token);

      created_before = created_before + "T09:00:00+08:00";
      created_after = created_after + "T09:00:00+08:00";

      ordersForGivenTime = GetOrdersForGivenTime(access_token, created_before, created_after);
    } catch (Exception e) {
      //e.printStackTrace();
      ordersForGivenTime = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in getOrdersForGivenTime()");
    }

    return ordersForGivenTime;
  }

  private String GetOrdersForGivenTime(String access_token, String created_before, String created_after) {
    String ordersForGivenTime = "";
    try {
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/orders/get");
      request.setHttpMethod("GET");

      request.addApiParameter("created_before", created_before);
      request.addApiParameter("created_after", created_after);
//      request.addApiParameter("update_before", update_before);
//      request.addApiParameter("update_after", update_after);
      //request.addApiParameter("limit", limit);

      ///////////////////////////////////////////////
      request.addApiParameter("offset", "0");
//      request.addApiParameter("status", "shipped");
      request.addApiParameter("sort_direction", "DESC");
      //request.addApiParameter("sort_by", "updated_at");
      LazopResponse response = client.execute(request, access_token);
      ordersForGivenTime = response.getBody();
      Thread.sleep(10);
    } catch (Exception e) {
      ordersForGivenTime = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in GetOrdersForGivenTime()");
    }
    return ordersForGivenTime;
  }


  public String getOrders() {
    String orders = "No new orders yet...";
    System.out.println("getOrders");
    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);

      String access_token = gerRefreshedAccessToken(refresh_token);
      System.out.println("access_token: " + access_token);

      orders = GetOrders(access_token);
    } catch (Exception e) {
      orders = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in getOrders()");
    }

    return orders;
  }

  private String GetOrders(String access_token) {
    String orders = "No new orders yet...";
    try {
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/orders/get");
      request.setHttpMethod("GET");
//      request.addApiParameter("created_before", "2020-02-10T16:00:00+08:00");
      request.addApiParameter("created_after", "2020-05-10T09:00:00+08:00");
//      request.addApiParameter("status", "shipped");
//      request.addApiParameter("update_before", "2012-02-10T16:00:00+08:00");
//      request.addApiParameter("sort_direction", "DESC");
      request.addApiParameter("offset", "0");
      request.addApiParameter("limit", "10");
//      request.addApiParameter("update_after", "2017-02-10T09:00:00+08:00");
//      request.addApiParameter("sort_by", "updated_at");
      LazopResponse response = client.execute(request, access_token);
      //System.out.println(response.getBody());
      orders = response.getBody();
      Thread.sleep(10);
    } catch (Exception e) {
      orders = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in GetOrders()");
    }
    return orders;
  }


  private String gerRefreshedAccessToken(String refresh_token) {
    String access_token = "";
    try {
      LazopClient client = new LazopClient("https://auth.lazada.com/rest", Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest("/auth/token/refresh");
      request.addApiParameter("refresh_token", refresh_token);
      LazopResponse response = client.execute(request);
      String body = response.getBody();
      access_token = getAccessTokenFromJson(body);
    } catch (Exception e) {
      access_token = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in gerRefreshedAccessToken()");
    }
    return access_token;
  }

  private String getAccessTokenFromJson(String jsonContent) {
    String access_token = "";
    try {
      JsonParser jsonParser = new JsonParser();
      JsonElement jsonElement;
      JsonObject jsonObject;

      jsonElement = jsonParser.parse(jsonContent);
      jsonObject = jsonElement.getAsJsonObject();

      access_token = getSTRING(jsonObject, "access_token");
    } catch (Exception e) {
      access_token = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in gerRefreshedAccessToken()");
    }
    return access_token;
  }


  public String CancelTheOrder(String id, String value) {
    String responseStr = "";

    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);
      String accessToken = gerRefreshedAccessToken(refresh_token);
      System.out.println("accessToken: " + accessToken);

      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/cancel");
      request.addApiParameter("reason_detail", value);
      request.addApiParameter("reason_id", "15");
      request.addApiParameter("order_item_id", id);
      LazopResponse response = client.execute(request, accessToken);
      responseStr = response.getBody();

      Thread.sleep(10);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in CancelTheOrder()");
    }

    return responseStr;
  }

  public String setInvoiceNumber(String id, String value) {
    String responseStr = "";

    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);
      String accessToken = gerRefreshedAccessToken(refresh_token);
      System.out.println("accessToken: " + accessToken);

      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/invoice_number/set");
      request.addApiParameter("order_item_id", id);
      request.addApiParameter("invoice_number", value);
      LazopResponse response = client.execute(request, accessToken);
      responseStr = response.getBody();

      Thread.sleep(10);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in setInvoiceNumber()");
    }

    return responseStr;
  }

  public String markPacked(String id, String value) {
    String responseStr = "";
    String order_item_ids = "[" + id + "]";
    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);
      String accessToken = gerRefreshedAccessToken(refresh_token);
      System.out.println("accessToken: " + accessToken);

      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/pack");
      request.addApiParameter("shipping_provider", value);
      request.addApiParameter("delivery_type", "dropship");
      request.addApiParameter("order_item_ids", order_item_ids);
      LazopResponse response = client.execute(request, accessToken);
      responseStr = response.getBody();

      Thread.sleep(10);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in markPacked()");
    }

    return responseStr;
  }

  public String markDelivered(String id, String value) {
    String responseStr = "";

    String order_item_ids = "[" + id + "]";
    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);
      String accessToken = gerRefreshedAccessToken(refresh_token);
      System.out.println("accessToken: " + accessToken);

      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/sof/delivered");
      request.addApiParameter("order_item_ids", order_item_ids);
      LazopResponse response = client.execute(request, accessToken);
      responseStr = response.getBody();

      Thread.sleep(10);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in markDelivered()");
    }

    return responseStr;
  }

  public String markReadyToShip(String id, String value1, String value2) {
    String responseStr = "";

    String order_item_ids = "[" + id + "]";
    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();
      System.out.println("refresh_token: " + refresh_token);
      String accessToken = gerRefreshedAccessToken(refresh_token);
      System.out.println("accessToken: " + accessToken);

      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/rts");
      request.addApiParameter("delivery_type", "dropship");
      request.addApiParameter("order_item_ids", order_item_ids);
      request.addApiParameter("shipment_provider", value1);
      request.addApiParameter("tracking_number", value2);
      LazopResponse response = client.execute(request, accessToken);
      responseStr = response.getBody();

      Thread.sleep(10);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in markReadyToShip()");
    }

    return responseStr;
  }

  private String getSTRING(JsonObject Obj, String str) {
    String result = "";
    if (Obj.get(str) != null && !Obj.get(str).isJsonNull()) {
      result = Obj.get(str).getAsString();
    }
    return result;
  }

  private static List readFile(File file) {
    List<String> lines = new ArrayList<String>();
    Scanner scanner = null;
    try {
      scanner = new Scanner(file);
      while (scanner.hasNext()) {
        String line = scanner.nextLine();
        lines.add(line);
      }
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    }
    return lines;
  }
//  public boolean writeCode(String code) {
//    boolean itFinished = false;
//    initFiles();
//    writeToFile(code, fileWriter);
//    return itFinished;
//  }
//
//  public boolean isExpired() {
//    boolean isExpired = true;
//
//    try {
//
//
//    } catch (Exception e) {
//      e.printStackTrace();
//    }
//
//    return isExpired;
//  }
//
//  private void initFiles() {
//    try {
//      fileWriter = new FileWriter(new File(fileName), true);
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
//  }
//
//  private static void writeToFile(String content, FileWriter fileWriter) {
//    try {
//      fileWriter.write(content);
//      fileWriter.write("\n");
//      fileWriter.flush();
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
//  }
}
