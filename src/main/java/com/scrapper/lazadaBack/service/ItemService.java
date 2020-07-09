package com.scrapper.lazadaBack.service;

import com.google.gson.*;
import com.lazada.lazop.api.LazopClient;
import com.lazada.lazop.api.LazopRequest;
import com.lazada.lazop.api.LazopResponse;
import com.scrapper.lazadaBack.model.Globals;

import java.util.ArrayList;
import java.util.Map;


@org.springframework.stereotype.Service

public class ItemService {
//  private static FileWriter fileWriter;
//  private String fileName = "code.txt";

  public String getOrders() {
    //http://localhost:8080/orders
    String responseArray = "";

    Globals.initTokensIfNecessery();

    for (Map.Entry<String, ArrayList<String>> entry : Globals.tokenMap.entrySet()) {
      String email = entry.getKey();
      ArrayList<String> tokens = entry.getValue();
      String refreshToken = tokens.get(0);
      String accessToken = tokens.get(1);

      try {
        String response = getOrdersLazada(accessToken);
        response = addEmailToJson(response, email) + ",";
        responseArray += response;

      } catch (Exception e) {
        e.printStackTrace();
      }

    }

    responseArray = responseArray.substring(0, responseArray.lastIndexOf(","));
    responseArray = "[" + responseArray + "]";

    return responseArray;
  }

  public String getOrdersLazada(String access_token) {
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
//      request.addApiParameter("limit", "100");
//      request.addApiParameter("update_after", "2017-02-10T09:00:00+08:00");
//      request.addApiParameter("sort_by", "updated_at");
      LazopResponse response = client.execute(request, access_token);
      //System.out.println(response.getBody());
      orders = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      e.printStackTrace();
      orders = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in GetOrders()");
    }
    return orders;
  }

  public String getOrdersForGivenTime(String created_before, String created_after) {
    //http://localhost:8080/2020-06-24/2020-01-10
    String responseArray = "";

    Globals.initTokensIfNecessery();

    for (Map.Entry<String, ArrayList<String>> entry : Globals.tokenMap.entrySet()) {
      String email = entry.getKey();
      ArrayList<String> tokens = entry.getValue();
      //String refreshToken = tokens.get(0);
      String accessToken = tokens.get(1);

      try {
        String response = getOrdersForGivenTimeLazada(accessToken, created_before, created_after);
        response = addEmailToJson(response, email) + ",";
        responseArray += response;

      } catch (Exception e) {
        e.printStackTrace();
      }

    }

    responseArray = responseArray.substring(0, responseArray.lastIndexOf(","));
    responseArray = "[" + responseArray + "]";

    return responseArray;
  }


  public String getOrdersForGivenTimeLazada(String access_token, String created_before, String created_after) {
    String ordersForGivenTime = "";
    try {
      created_before = created_before + "T09:00:00+08:00";
      created_after = created_after + "T09:00:00+08:00";

      ////////////////////
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
      Thread.sleep(300);
    } catch (Exception e) {
      ordersForGivenTime = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in GetOrdersForGivenTime()");
    }
    return ordersForGivenTime;
  }

  public String cancelTheOrder(String order_id, String email, String value) {
    String responseStr = "";
    try {
      String access_token = Globals.tokenMap.get(email).get(1);
      responseStr = cancelTheOrderLazada(access_token, order_id, value);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;
  }

  public String cancelTheOrderLazada(String access_token, String order_id, String value) {
    String responseStr = "";

    try {
      String OrderItemsJson = GetOrderItemsLazada(access_token, order_id);
      String item_id = getItemIdFromJson(OrderItemsJson);
      System.out.println("cancelTheOrder is called for - " + item_id);
      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/cancel");
      request.addApiParameter("reason_detail", value);
      request.addApiParameter("reason_id", "15");
      request.addApiParameter("order_item_id", item_id);
      LazopResponse response = client.execute(request, access_token);
      responseStr = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in CancelTheOrder()");
    }

    return responseStr;
  }

  public String setInvoiceNumber(String order_id, String email, String value) {
    String responseStr = "";
    try {
      String access_token = Globals.tokenMap.get(email).get(1);
      responseStr = setInvoiceNumberLazada(access_token, order_id, value);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;
  }

  public String setInvoiceNumberLazada(String access_token, String order_id, String value) {
    String responseStr = "";

    try {
      String OrderItemsJson = GetOrderItemsLazada(access_token, order_id);
      String item_id = getItemIdFromJson(OrderItemsJson);
      System.out.println("setInvoiceNumber is called for - " + item_id);
      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/invoice_number/set");
      request.addApiParameter("order_item_id", item_id);
      request.addApiParameter("invoice_number", value);
      LazopResponse response = client.execute(request, access_token);
      responseStr = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in setInvoiceNumber()");
    }

    return responseStr;
  }

  public String markPacked(String order_id, String email, String value) {
    String responseStr = "";
    try {
      String access_token = Globals.tokenMap.get(email).get(1);
      responseStr = markPackedLazada(access_token, order_id, value);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;
  }

  public String markPackedLazada(String access_token, String order_id, String value) {
    String responseStr = "";

    try {
      String OrderItemsJson = GetOrderItemsLazada(access_token, order_id);
      String item_id = getItemIdFromJson(OrderItemsJson);
      String order_item_ids = "[" + item_id + "]";
      System.out.println("markPacked is called for - " + item_id);
      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/pack");
      request.addApiParameter("shipping_provider", value);
      request.addApiParameter("delivery_type", "dropship");
      request.addApiParameter("order_item_ids", order_item_ids);
      LazopResponse response = client.execute(request, access_token);
      responseStr = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in markPacked()");
    }

    return responseStr;
  }

  public String markDelivered(String order_id, String email, String value) {
    String responseStr = "";
    try {
      String access_token = Globals.tokenMap.get(email).get(1);
      responseStr = markDeliveredLazada(access_token, order_id, value);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;
  }

  public String markDeliveredLazada(String access_token, String order_id, String value) {
    String responseStr = "";

    try {
      String OrderItemsJson = GetOrderItemsLazada(access_token, order_id);
      String item_id = getItemIdFromJson(OrderItemsJson);
      String order_item_ids = "[" + item_id + "]";
      System.out.println("markDelivered is called for - " + item_id);
      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/sof/delivered");
      request.addApiParameter("order_item_ids", order_item_ids);
      LazopResponse response = client.execute(request, access_token);
      responseStr = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in markDelivered()");
    }

    return responseStr;
  }


  public String markReadyToShip(String order_id, String email, String value1, String value2) {
    String responseStr = "";
    try {
      String access_token = Globals.tokenMap.get(email).get(1);
      responseStr = markReadyToShipLazada(access_token, order_id, value1, value2);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;
  }

  public String markReadyToShipLazada(String access_token, String order_id, String value1, String value2) {
    String responseStr = "";

    try {
      String OrderItemsJson = GetOrderItemsLazada(access_token, order_id);
      String item_id = getItemIdFromJson(OrderItemsJson);
      String order_item_ids = "[" + item_id + "]";
      System.out.println("markReadyToShip is called for - " + item_id);
      ////////////////
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/rts");
      request.addApiParameter("delivery_type", "dropship");
      request.addApiParameter("order_item_ids", order_item_ids);
      request.addApiParameter("shipment_provider", value1);
      request.addApiParameter("tracking_number", value2);
      LazopResponse response = client.execute(request, access_token);
      responseStr = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      responseStr = "ERROR_TRY_AGAIN";
      System.out.println("ERROR in markReadyToShip()");
    }

    return responseStr;
  }

  public String getOrderItems(String order_id, String email) {
    String responseStr = "";
    try {
      String access_token = Globals.tokenMap.get(email).get(1);
      responseStr = GetOrderItemsLazada(access_token, order_id);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;

  }

  private String GetOrderItemsLazada(String access_token, String order_id) {
    String OrderItemsJson = "";
    try {
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/order/items/get");
      request.setHttpMethod("GET");
      request.addApiParameter("order_id", order_id);
      LazopResponse response = client.execute(request, access_token);
      OrderItemsJson = response.getBody();
      Thread.sleep(300);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return OrderItemsJson;
  }

  private String getItemIdFromJson(String jsonContent) {
    String item_id = "";
    try {
      if (jsonContent != null) {
        JsonParser jsonParser = new JsonParser();
        JsonElement jsonElement = jsonParser.parse(jsonContent);
        JsonObject jsonObject = jsonElement.getAsJsonObject();

        JsonArray dataArray = getARRAY(jsonObject, "data");

        if (dataArray.size() > 0) {
          JsonObject firstObject = dataArray.get(0).getAsJsonObject();
          item_id = getSTRING(firstObject, "order_item_id");
          System.out.println("item_id: " + item_id);
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return item_id;
  }

//  private boolean accessTokenExpired(String jsonContent) {
//    boolean isExpired = false;
//    try {
//      JsonParser jsonParser = new JsonParser();
//      JsonElement jsonElement = jsonParser.parse(jsonContent);
//      JsonObject jsonObject = jsonElement.getAsJsonObject();
//
//      String code = getSTRING(jsonObject, "code");
//      if (code.equals("IllegalAccessToken")) {
//        isExpired = true;
//      }
//    } catch (Exception e) {
//      e.printStackTrace();
//    }
//
//    return isExpired;
//  }

  private String getSTRING(JsonObject Obj, String str) {
    String result = "";
    if (Obj.get(str) != null && !Obj.get(str).isJsonNull()) {
      result = Obj.get(str).getAsString().trim();
    }
    return result;
  }

  private JsonObject getOBJECT(JsonObject jsonObject, String str) {
    JsonObject object = null;

    if (!jsonObject.get(str).isJsonNull()) {
      object = jsonObject.getAsJsonObject(str);
    }
    return object;
  }

  private JsonArray getARRAY(JsonObject jsonObject, String str) {
    JsonArray array = null;

    if (!jsonObject.get(str).isJsonNull()) {
      array = jsonObject.getAsJsonArray(str);
    }
    return array;
  }

  private String addEmailToJson(String responseStr, String email_address) {
    try {
      Gson gson = new Gson();
      JsonObject jsonObject = gson.fromJson(responseStr, JsonObject.class); // parse
      jsonObject.addProperty("email_address", email_address); // modify
      //System.out.println(jsonObject); // generate
      responseStr = jsonObject.toString();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return responseStr;
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
