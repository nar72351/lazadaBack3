package com.scrapper.lazadaBack.model;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.lazada.lazop.api.LazopClient;
import com.lazada.lazop.api.LazopRequest;
import com.lazada.lazop.api.LazopResponse;
import com.lazada.lazop.util.ApiException;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Globals {
  public static String restUrl = "https://api.lazada.co.th/rest";
  public static String appKey = "119295";
  public static String appSecret = "nPI7IibeDTPsXoRZr1dBXJquFkfsgEl3";

  public static Map<String, ArrayList<String>> tokenMap;

  public static void initTokens() {
    File file = new File("refreshToken.txt");
    List<String> list = readFile(file);

    tokenMap = new LinkedHashMap();
    for (String each : list) {
      String[] arr = each.split("--");
      if (arr.length == 2) {
        String email = arr[0];
        String refreshToken = arr[1];

        String accessToken = gerRefreshedAccessToken(refreshToken);

        ArrayList<String> tokens = new ArrayList<>();
        tokens.add(refreshToken);
        tokens.add(accessToken);

        tokenMap.put(email, tokens);
      }

    }

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

  public static void initTokensIfNecessery() {
    Map.Entry<String, ArrayList<String>> firstEntry = tokenMap.entrySet().iterator().next();
    ArrayList<String> tokens = firstEntry.getValue();
    String accessToken = tokens.get(1);

    String orders = "";
    try {
      LazopClient client = new LazopClient(Globals.restUrl, Globals.appKey, Globals.appSecret);
      LazopRequest request = new LazopRequest();
      request.setApiName("/orders/get");
      request.setHttpMethod("GET");
      request.addApiParameter("created_after", "2020-05-10T09:00:00+08:00");
      request.addApiParameter("offset", "0");
      request.addApiParameter("limit", "10");
      LazopResponse response = client.execute(request, accessToken);
      orders = response.getBody();
    } catch (ApiException e) {
      e.printStackTrace();
    }

    if (accessTokenExpired(orders)) {
      System.out.println("NEED TO INIT TOKENS");
      initTokens();
    } else {
      System.out.println("NO NEED TO INIT TOKENS");

    }
  }

  private static boolean accessTokenExpired(String jsonContent) {
    boolean isExpired = false;
    try {
      JsonParser jsonParser = new JsonParser();
      JsonElement jsonElement = jsonParser.parse(jsonContent);
      JsonObject jsonObject = jsonElement.getAsJsonObject();

      String code = getSTRING(jsonObject, "code");
      if (code.equals("IllegalAccessToken")) {
        isExpired = true;
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    return isExpired;
  }

}
