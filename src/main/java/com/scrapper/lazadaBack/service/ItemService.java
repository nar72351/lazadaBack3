package com.scrapper.lazadaBack.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

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
}
