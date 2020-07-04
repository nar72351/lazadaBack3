package com.scrapper.lazadaBack.model;

import java.util.Date;

public class Globals {
  public static String restUrl = "https://api.lazada.co.th/rest";
  public static String appKey = "119295";
  public static String appSecret = "nPI7IibeDTPsXoRZr1dBXJquFkfsgEl3";
  public static long expiremilis = 120000l;
  public static String access_token = "";
  public static String refresh_token = "";

  public static Date accessTokenExpirationDate = new Date(System.currentTimeMillis() - 3);
  public static Date refreshTokenExpirationDate = new Date(System.currentTimeMillis() + expiremilis);
}
