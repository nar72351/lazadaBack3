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
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;


@org.springframework.stereotype.Service

public class ItemService {
  private static FileWriter fileWriter;
  private String fileName = "code.txt";

  public boolean writeCode(String code) {
    boolean itFinished = false;
    initFiles();
    writeToFile(code, fileWriter);
    return itFinished;
  }

  public boolean isExpired() {
    boolean isExpired = true;

    try {


    } catch (Exception e) {
      e.printStackTrace();
    }

    return isExpired;
  }

  private void initFiles() {
    try {
      fileWriter = new FileWriter(new File(fileName), true);
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  private static void writeToFile(String content, FileWriter fileWriter) {
    try {
      fileWriter.write(content);
      fileWriter.write("\n");
      fileWriter.flush();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }


  public String getOrders() {
    String orders = "No new orders yet...";
    System.out.println("getOrders");
    try {
      File file = new File("refreshToken.txt");
      List<String> list = readFile(file);
      String refresh_token = list.get(list.size() - 1).trim();

      String access_token = gerRefreshedAccessToken(refresh_token);
      System.out.println("access_token: " + access_token);

      orders = GetOrders(access_token);
    } catch (Exception e) {
      e.printStackTrace();
    }

    return orders;
  }

  private String GetOrders(String access_token) {
    String orders = "No new orders yet...";
    try {
      String url = "https://api.lazada.co.th/rest";
      String appkey = "119295";
      String appSecret = "nPI7IibeDTPsXoRZr1dBXJquFkfsgEl3";

      LazopClient client = new LazopClient(url, appkey, appSecret);
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
      e.printStackTrace();
    }
    return orders;
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
      e.printStackTrace();
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
      e.printStackTrace();
    }

    return access_token;
  }

  private String getSTRING(JsonObject Obj, String str) {
    String result = "";
    if (Obj.get(str) != null && !Obj.get(str).isJsonNull()) {
      result = Obj.get(str).getAsString();
    }
    return result;
  }
}
