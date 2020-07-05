package com.scrapper.lazadaBack.model;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.lazada.lazop.api.LazopClient;
import com.lazada.lazop.api.LazopRequest;
import com.lazada.lazop.api.LazopResponse;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Globals {
  public static String restUrl = "https://api.lazada.co.th/rest";
  public static String appKey = "119295";
  public static String appSecret = "nPI7IibeDTPsXoRZr1dBXJquFkfsgEl3";

  public static String refresh_token1 = "";
  public static String access_token1 = "";

  public static void init() {
    initRefreshTokens();
    initAccessTokens();
  }

  private static void initRefreshTokens() {
    //zut karduma fileic
    File file = new File("refreshToken.txt");
    List<String> list = readFile(file);
    refresh_token1 = list.get(list.size() - 1).trim();
    System.out.println("refresh_token1: " + refresh_token1);
  }

  public static void initAccessTokens() {
    //refresh@ talisa nor access@ vercnuma
    access_token1 = gerRefreshedAccessToken(refresh_token1);
    System.out.println("access_token1: " + access_token1);
  }

  private static String gerRefreshedAccessToken(String refresh_token) {
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

  private static String getAccessTokenFromJson(String jsonContent) {
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

  private static String getSTRING(JsonObject Obj, String str) {
    String result = "";
    if (Obj.get(str) != null && !Obj.get(str).isJsonNull()) {
      result = Obj.get(str).getAsString();
    }
    return result;
  }
}
