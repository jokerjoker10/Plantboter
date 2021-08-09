/*
  ### Plantbotter Loadware ###
  Made for ESP 8266
  Read the documentation before you start: https://github.com/jokerjoker10/PlantBotter
*/

#include "plantbotterutil.h"
#include "settings.h"
#include <Arduino.h>
#include <Arduino_JSON.h>

PlantbotterNet cloud;

//init
void setup(){
  Serial.begin(9600);

  Serial.println("Initializing Please Wait...");

  //connecting to cloud
  if(!cloud.begin()){
    return; 
  }

  Serial.println("Initializing Done!");
}

void loop(){
  //get Settings from cloud
  if(!cloud.getSettings()){
    Serial.println("Can't get updated Settings. Proceed with last Settings recieved");
  }

  JSONVar plants = cloud.settings["plants"];
  int cycle_time = (int)cloud.settings["cycle_time"];
    
  for(int i = 0; plants.length() > i;i++){
    //plant object
    JSONVar plant = plants[i];

    //all vars form plant
    String name = (String)JSON.stringify(plant["name"]);
    int sensor_pin = (int)plant["sensor_pin"];
    String sensor_type = (String)JSON.stringify(plant["sensor_type"]);
    int pump_pin = (int)plant["pump_pin"];
    int pump_time = (int)plant["pump_time"];
    int trigger_percentage = (int)plant["trigger_percentage"];
    String log_id = (String)JSON.stringify(plant["log"]);

    Serial.print("Plant :");
    Serial.println(name);

    Serial.println("Getting Sensor Value...");

    bool waterPlant = false;
    int sensorValue = 0;
    
    if(sensor_type == "\"analog\""){
      sensorValue = analogRead(sensor_pin);
      double percent = (sensorValue/10.23);
    
      Serial.println("Percentage: " + (String)percent + "%");

      if((float)trigger_percentage < percent){
        waterPlant = true; 
      }

      cloud.logData((String)JSON.stringify(log_id), "value_log", percent);
    }
    else if(sensor_type == "\"digital\""){
      pinMode(sensor_pin, INPUT);
      sensorValue = digitalRead(sensor_pin);
      
      if(sensorValue == HIGH){
        waterPlant = true; 
      }
      
      cloud.logData((String)JSON.stringify(log_id), "value_log", sensorValue);
    }
    else{
      Serial.println("Error");
    }

      Serial.println(pump_time);
    
    //test if need to water
    if(waterPlant){
      Serial.print("Watering plant");
      cloud.logData((String)JSON.stringify(log_id), "water_log", 100);
      Serial.print(".");
      //setting the pump
      
      Serial.print(".");
      pinMode(pump_pin, OUTPUT);
      Serial.print(".");
      digitalWrite(pump_pin, LOW);
      Serial.print(".");
      delay(pump_time);
      Serial.print(".");
      digitalWrite(pump_pin, HIGH);
      Serial.print(".");
      Serial.println("Done");
    }
    
    Serial.println("");
  }
  delay((int)cycle_time);
  Serial.println("\n");
}
