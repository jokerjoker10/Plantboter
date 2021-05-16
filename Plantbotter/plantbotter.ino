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
  
  Serial.println("\nData from controller: " + JSON.stringify(plants) + "\n");
  
  for(int i = 0; plants.length() > i;i++){
    //plant object
    JSONVar plant = plants[i];

    //all vars form plant
    JSONVar name = plant["name"];
    int sensor_pin = (int)plant["sensor_pin"];
    int pump_pin = (int)plant["pump_pin"];
    int trigger_percentage = (int)plant["trigger_percentage"];
    JSONVar log_id = plant["log"];
        
    Serial.print("Plant :");
    Serial.println(name);

    Serial.println("Getting Sensor Value...");

    int sensorValue = analogRead(sensor_pin);
    
    Serial.print("Sensor Value: ");
    Serial.println(sensorValue);
    
    double percent = (sensorValue/10.23);
    Serial.println("Percentage: " + (String)percent + "%");

    //log value
    Serial.println("logging data...");
    cloud.logData((String)JSON.stringify(log_id), "value_log", percent);
    
    //test if need to water
    if((float)trigger_percentage < percent){
      Serial.println("Watering plant");
      cloud.logData((String)JSON.stringify(log_id), "water_log", 100);
      
      //setting the pump
      pinMode(pump_pin, OUTPUT);
      
      digitalWrite(pump_pin, LOW);
      delay(PUMP_TIME);
      digitalWrite(pump_pin, HIGH);
    }
    
    Serial.println("");
  }
  delay(CYCLE_DELAY);
  Serial.println("\n");
}
