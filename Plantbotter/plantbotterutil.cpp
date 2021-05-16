//wifi imports
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Arduino_JSON.h>

#include "plantbotterutil.h"
#include "Arduino.h"

//include
#include "settings.h"


//api path
String ENDPOINT_GET_SETTINGS = "api/getsettings/";
String ENDPOINT_LOG_PLANT = "api/logplant/";

String httpGETRequest(const char* serverName);

PlantbotterNet::PlantbotterNet(){
  this->server = SERVER;
  this->api_key = API_KEY;
  
  this->ssid = WIFI_SSID;
  this->password = WIFI_PASSWORD;  
}

//connect to wifi
//returns bool with status of wifi
bool PlantbotterNet::begin(){
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WIFI");

  //waiting for connection
  int timeout = 0;
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    timeout++;

    //after 1 minute connection is timeout
    if(timeout >= 120){
      Serial.println("WIFI Connection Failed. Retrying");
      return false;
    }
  }

  //if loop exited connection is established
  Serial.println("Connection Successfull");
  Serial.println("IP Adress: " + WiFi.localIP());
}

//get settings from cloud server
//returns json object with details from server
bool PlantbotterNet::getSettings(){
  if(WiFi.status()== WL_CONNECTED){

    //getting data and parsing it
    String data = this->getRequest(SERVER + ENDPOINT_GET_SETTINGS + API_KEY);
    Serial.println("Data Recieved!");
    JSONVar settingsObject = JSON.parse(data);

    //test if parsing successfull
    if(JSON.typeof(settingsObject) == "undefined"){
      Serial.println("Json Parsing Failed");
      return false;
    }

    //setting object vars
    this->settings = settingsObject;
    
    return true;
  }
  else{
  }
  return false;
}

//log datapoint
//returns bool of success
bool PlantbotterNet::logData(String log_id, String type, double value){
  log_id.replace("\"", "");
  if(WiFi.status()== WL_CONNECTED){
    String data = this->postRequest(SERVER + ENDPOINT_LOG_PLANT + API_KEY + "/" + log_id, type, value);
  }
  else{
    Serial.println("Wifi Disconnected");
  }
}

//post requests
//returns string with data
String PlantbotterNet::postRequest(String address, String type, double value){
  HTTPClient http;
  http.begin(address);
  http.addHeader("Content-Type", "application/json");
  int responseCode = http.POST("{\"type\":\"" + type +"\",\"value\":\"" + (String)value + "\"}"); 

  String data = "{}";
  
  if(responseCode > 0){
    data = http.getString();
  }
  else{
    Serial.println("Error Response: " + responseCode);
  }
  
  http.end();
  return data;
}


//get Request to server
//returns string with response
String PlantbotterNet::getRequest(String address){
  HTTPClient http;

  http.begin(address);

  //making the call
  int responseCode = http.GET();

  String data = "{}";
  //testing for response code
  if(responseCode == 200){
    data = http.getString();
  }
  else{
    Serial.println("Error Response: " + responseCode);
  }

  http.end();
  return data;
}
