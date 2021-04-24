/*
  ### Plantbotter Loadware ###
  Made for ESP 8266
  Read the documentation before you start: https://github.com/jokerjoker10/PlantBotter
*/

//settings
#include "settings.h"

//display imports
#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <U8g2lib.h>

//wifi imports
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>

U8G2_SSD1306_128X32_UNIVISION_F_HW_I2C u8g2(U8G2_R0); 

void printDisplay(String topText, String botText = "");
void listPlants();

void setup(){
  Serial.begin(9600);
  Serial.println("Init Please Wait...\n");  

  if(useDisplay){
    u8g2.begin();
  }

  if(plantBotterCloud){
    
  }
  
  printDisplay("Init", "Please Wait...");
  listPlants();

  for(int i = 0; i < getPlantLength(); i++){
    pinMode(getPlantPump(i), OUTPUT);
    digitalWrite(getPlantPump(i), HIGH);
    
    pinMode(getPlantSensor(i), INPUT);
  }

  
  delay(500);
  printDisplay("Init", "Done!");
  Serial.println("\nInit Done");
}

void loop(){
  for(int i = 0; i < getPlantLength(); i++){
    Serial.println("Plant " + getPlantName(i) + " " + calcPercent(getSensorData(i)) + "%dry");

    printDisplay("Plant " + getPlantName(i), "Status: " + String(calcPercent(getSensorData(i))) + "%dry");
    delay(500);
    
    if(calcPercent(getSensorData(i)) > getTriggerPercentage(i)){
        printDisplay("Watering " + getPlantName(i), "...");
        Serial.println("Watering " + getPlantName(i) + "...");
        digitalWrite(getPlantPump(i), LOW);
        
        delay(pumpTime);
        
        digitalWrite(getPlantPump(i), HIGH);
        Serial.println("Done");
    }

    delay(500);
    printDisplay("Plant " + getPlantName(i), "Status: " + String(calcPercent(getSensorData(i))) + "%dry");
    
    delay(10000);
    Serial.println("");
  }
}

int getSensorData(int index){
  return analogRead(getPlantSensor(index));
}

float calcPercent(int data){
  return float(data/10.23);
}

void listPlants(){
  printDisplay("Number of Plants: " + getPlantLength(), "");
  Serial.println("Number of Plants " + getPlantLength());
  delay(500);
  Serial.println("\nPlant | Index | Plant Name | Sensor Pin | Pump Pin");
  for(int i = 0; i < getPlantLength(); i++){
    Serial.println("Plant | " + String(i) + " | " + getPlantName(i) + " | " + String(getPlantSensor(i)).c_str() + " | " + String(getPlantPump(i)).c_str());
    printDisplay("Plant: " + getPlantName(i), "Sensor: " + String(getPlantSensor(i)) + ", Pump: " + getPlantPump(i));
    delay(500);
  }

  return;
}

String getPlantName(int index){
  if(plantBotterCloud){
    
  }
  return plants[index][0];
}

int getPlantSensor(int index){
  if(plantBotterCloud){
    
  }
  return String(plants[index][1]).toInt();
}

int getPlantPump(int index){
  if(plantBotterCloud){
    
  }
  int out = String(plants[index][2]).toInt();
  return out;
}

int getTriggerPercentage(int index){
  if(plantBotterCloud){
    
  }
  return String(plants[index][3]).toInt();
}

int getPlantLength(){
  if(plantBotterCloud){
    
  }
  return (sizeof(plants)/sizeof(*plants));
}

void printDisplay(String topText, String botText){
  if(!useDisplay){
    return;
  }
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_6x13_tf );
  u8g2.drawStr(8, 14, topText.c_str());
  u8g2.drawStr(8, 31, botText.c_str());
  u8g2.sendBuffer();
}
