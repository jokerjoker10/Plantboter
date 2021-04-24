// ##############################################
//              Plantboter Settings
// ##############################################

/*
    ##### Plantboter Cloud Settings ####
!Only Works with Wifi enabled Microcontrollers like ESP8266!

To enable Plantbotter Cloud set plantBotterCloud to true.
You have to enter a valid server Address and API Key.

For a valid wifi connection enter your wifi ssid and wifi password 
*/
#define plantBotterCloud false

//cloud server
#define server "http://plantbottercloud/api"
#define apiKey "ahfsvblikdfzuuvbpksösdvbsofnhisvbiksdvbiseufbiedfbasivbsiefvcb"

//wifi
#define ssid "ssid"
#define password "password"


/*
    ##### Display Settings #####
This option allows for a 0.91 inch display.
The display shows current status and the plants.  
*/
#define useDisplay true


/*
    ##### Plant Settings #####
To Add a Plant change the number of plants. Then add a Plant by adding a array like that:
{"Plant Name", "Sensor Pin", "Pump Pin", "trigger percentage"}

trigger Percentage (min 0, max 100):
//0 => Completly Wet 
//100 => Completly Dry
if status is above the trigger percentage it will pump whater
*/

/* number of plants
          ---v---         */
char* plants[1][4] {
    {"Minzi", "34", "15", "40"}
};

//The time in ms witch the pump is activated
#define pumpTime 1000
