import React from 'react';
import { IonCard, IonCardTitle, IonContent, IonHeader, IonCardHeader, IonItem, IonRow, IonCardContent,IonGrid,IonCol } from '@ionic/react';
import {getAllController, getLog, getLang, plant, controller} from '../../scripts/superStore';

var lang = getLang();
var controllers: any = getAllController();

interface ContainerProps {
  plant: plant; 
  controller: controller;
}

interface plantData {
  controllerid: string;
  controllername: string;
  controllerApiKey: string;
  name: string;
  img: string;
  sensor_pin: Number;
  pump_pin: Number;
};

const DisplayInfo: React.FC<ContainerProps> = ({ plant, controller }) => {
  var output: plantData = {
    controllerid: "",
    controllername: "",
    controllerApiKey: "",
    name: "",
    img: "",
    sensor_pin: 0,
    pump_pin:0,
  };
  
  if(plant != undefined && controller != undefined){
    output = {
      controllerid : controller._id,
      controllername : controller.name,
      controllerApiKey : controller.api_key,
      name : plant.name,
      img : plant.img,
      sensor_pin : Number(plant.sensor_pin),
      pump_pin : Number(plant.pump_pin)
    }
  }
  var logs = plant.log;

  var datapointCount = 0; 
  var waterCount = 0;

    logs.logs.forEach((element:any) => {
      if(element.type === "value_log")
        datapointCount ++;
      if(element.type === "water_log")
        waterCount ++;
    });

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{lang.log.Info.Title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>

        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-align-self-start">{lang.log.Info.Data.PlantName}</IonCol>
              <IonCol className="ion-align-self-end">{output.name}</IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-align-self-start">{lang.log.Info.Data.sensorPin}</IonCol>
              <IonCol className="ion-align-self-end">{output.sensor_pin}</IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-align-self-start">{lang.log.Info.Data.pumpPin}</IonCol>
              <IonCol className="ion-align-self-end" >{output.pump_pin}</IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-align-self-start">{lang.log.Info.Data.controllername}</IonCol>
              <IonCol className="ion-align-self-end" ><a href={"/settings"}>{output.controllername}</a></IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
        
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-align-self-start">{lang.log.Info.Data.dataPointNumber}</IonCol>
              <IonCol className="ion-align-self-end" >{datapointCount}</IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
        
        <IonItem>
          <IonGrid>
            <IonRow>
              <IonCol className="ion-align-self-start">{lang.log.Info.Data.wateringCount}</IonCol>
              <IonCol className="ion-align-self-end" >{waterCount}</IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>

      </IonCardContent>
    </IonCard>
  );
};

export default DisplayInfo;