//Plantbotter Net Connection
#ifndef plantbotterutil
#define plantbotterutil

#include <Arduino.h>
#include <Arduino_JSON.h>

class PlantbotterNet {    
  private:
    //vars
    String server;
    String api_key;
    
    String ssid;
    String password;

    //functions
    String getRequest(String address);
    String postRequest(String address, String type, double value);
  public:
    //vars
    JSONVar settings;
    //init
    PlantbotterNet();
    //functions
    bool begin();
    bool getSettings();
    bool logData(String log_id, String type, double value);
};

#endif
